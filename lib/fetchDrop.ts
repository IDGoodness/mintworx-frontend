import { Contract, JsonRpcProvider } from "ethers";
import abi from "./ABI.json";

const SEADROP_ADDRESS = "0x00005EA00Ac477B1030CE78506496e8C2dE24bf5";

const namsym = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
];

const RPC_URLS: Record<number, { rpc: string; chainName: string }> = {
  1: { rpc: "https://rpc.ankr.com/eth", chainName: "ethereum" },
  10: { rpc: "https://mainnet.optimism.io", chainName: "optimism" },
  137: { rpc: "https://polygon-rpc.com", chainName: "polygon" },
  42161: { rpc: "https://arb1.arbitrum.io/rpc", chainName: "arbitrum" },
  8453: { rpc: "https://mainnet.base.org", chainName: "base" },
  43114: { rpc: "https://rpc.zerion.io/v1/avalanche", chainName: "avalanche" },
  2020: { rpc: "https://ronin.drpc.org", chainName: "ronin" },
  33139: { rpc: "https://apechain.drpc.org", chainName: "apechain" },
  2741: { rpc: "https://abstract.drpc.org/", chainName: "abstract" },
  1868: { rpc: "https://soneium.drpc.org/", chainName: "soneium" },
  80094: { rpc: "https://berachain.drpc.org/", chainName: "berachain" },
};

type PublicDropResult =
  | {
      valid: true;
      name: string;
      symbol: string;
      startTime: string;
      endTime: string;
      description?: string;
    }
  | {
      valid: false;
      error: string;
    };

export async function fetchDrop(
  nftAddress: string,
  chainId: number
): Promise<PublicDropResult> {
  try {
    const rpcEntry = RPC_URLS[chainId];
    if (!rpcEntry) return { valid: false, error: "" };

    const provider = new JsonRpcProvider(rpcEntry.rpc);
    const seaDrop = new Contract(SEADROP_ADDRESS, abi, provider);
    const nft = new Contract(nftAddress, namsym, provider);

    const drop = await seaDrop.getPublicDrop(nftAddress);
    const name = await nft.name();
    const symbol = await nft.symbol();
    const startTime = drop[1];
    const endTime = drop[2];

    if (!startTime || Number(startTime) === 0) {
      return {
        valid: false,
        error: "Invalid Address: Verify the network chain⛓️‍💥 and retry",
      };
    }

    // ✅ Attempt to fetch description from OpenSea for chain "ethereum" only
    let description: string | undefined;
    if (rpcEntry.chainName === "ethereum") {
      try {
        const res = await fetch(
          `https://api.opensea.io/api/v2/chain/${rpcEntry.chainName}/contract/${nftAddress}/nfts/1`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        const json = await res.json();
        description = json?.nft?.description || undefined;
      } catch {
        // optional: log or ignore failure
      }
    }

    return {
      valid: true,
      name,
      symbol,
      startTime: new Date(Number(startTime) * 1000).toUTCString(),
      endTime: new Date(Number(endTime) * 1000).toUTCString(),
      description,
    };
  } catch {
    return {
      valid: false,
      error: "Invalid Address: \nVerify the network chain⛓️‍💥 and retry",
    };
  }
}
