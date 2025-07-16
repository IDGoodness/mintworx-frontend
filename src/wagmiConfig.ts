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
  apeChain
} from 'viem/chains';
import sone from './assets/sone.svg';
import abst from './assets/abst.png';

const projectId = 'e6c376f9243c66b0a473775a22ded1f0';

const minato = {
  ...soneium,
  name: "Soneium Mainnet",
  iconUrl: sone,
};

const abstr = {
  ...abstract,
  name: "Abstract",
  iconUrl: abst,
}

 const chns = [base, mainnet, arbitrum, polygon, optimism, avalanche,minato,abstr,berachain,ronin,apeChain];

export const wagmiConfig = getDefaultConfig({
  appName: 'My App',
  projectId,
  chains: [base, mainnet, arbitrum, polygon, optimism, avalanche,minato,abstr,berachain,ronin,apeChain],
  transports: Object.fromEntries(chns.map((chain) => [chain.id, http()])),
  ssr: true,
});
