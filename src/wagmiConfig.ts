// wagmiConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  base,
  mainnet,
  arbitrum,
  polygon,
  optimism,
  avalanche,
  soneium,
  abstract,
  berachain,
  ronin,
  apeChain,
} from 'viem/chains';
//import { defineChain } from 'viem';
import sone from './assets/sone.svg';
import abst from './assets/abst.png';
// import hypeIcon from './assets/hype.png'; // Optional if you have an icon

const projectId = 'e6c376f9243c66b0a473775a22ded1f0';

const minato = {
  ...soneium,
  name: 'Soneium Mainnet',
  iconUrl: sone,
};

const abstr = {
  ...abstract,
  name: 'Abstract',
  iconUrl: abst,
};

/*
const hyperEvm = defineChain({
  id: 999, // Mainnet chain ID for HyperEVM
  name: 'HyperEVM',
  nativeCurrency: {
    name: 'HYPE',
    symbol: 'HYPE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
    public: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperliquid Explorer',
      url: 'https://explorer.hyperliquid.xyz',
    },
  },
  // iconUrl: hypeIcon, // Uncomment if you have an icon
});
*/

const chns = [
  base,
  mainnet,
  arbitrum,
  polygon,
  optimism,
  avalanche,
  minato,
  abstr,
  berachain,
  ronin,
  apeChain,
  //hyperEvm,
];

export const wagmiConfig = getDefaultConfig({
  appName: 'Mintworx.io',
  projectId,
  chains: [base, mainnet, arbitrum, polygon, optimism, avalanche, minato, abstr, berachain, ronin, apeChain,],//hyperEvm],
  transports: Object.fromEntries(chns.map((chain) => [chain.id, http()])),
  ssr: true,
});
