import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import Layout from './src/Components/Layout';
import { authWithWallet } from './lib/authWallet';
import ErrorModal from './src/Components/ErrorPopup';
import LoadingModal from './src/Components/LoadingPopup';
import { useAccount, useSignMessage } from 'wagmi';
import { useAuthStatus } from './lib/useAut';
import { useView } from './lib/useView';
import { useDisconnect } from 'wagmi';


// Images
import nft1 from './src/assets/nft1.png';
import nft2 from './src/assets/nft2.png';
import nft3 from './src/assets/nft3.png';
import nft4 from './src/assets/nft4.png';
import nft5 from './src/assets/nft5.png';

const nftImages = [nft1, nft2, nft3, nft4, nft5];

export default function ConnectSite() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { refreshAuth } = useAuthStatus();
  const { setView } = useView();
  const { disconnect } = useDisconnect();


  const [showModal, setShowModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % nftImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auth flow when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      const authenticate = async () => {
        setLoading(true);
        setShowModal(false);
        setAuthError('');

        const { authError } = await authWithWallet({
          address,
          signMessageAsync,
        });

        if (authError) {
          setAuthError(authError);
          setShowModal(true);
          setLoading(false);
          disconnect();
          
        } else {
          refreshAuth(); // ✅ Re-check token
          setView('dashboard'); // ✅ Navigate to dashboard
          setLoading(false);
        }
      };

      authenticate();
    }
  }, [isConnected, address, signMessageAsync, refreshAuth, setView,disconnect]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e2153] text-white px-6">
        {showModal && (
          <ErrorModal message={authError} onClose={() => setShowModal(false)} />
        )}
        {isLoading && <LoadingModal show={true} />}

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl w-full">
          {/* Left Section */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-md text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <img alt="MintworX Logo" className="w-28" src="/assets/logo-remove.png" />
              <span className="text-3xl font-bold">MintworX</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Revolutionalize minting processes with our exclusive Mint-Bot
            </h2>
            <p className="text-sm text-gray-300">
              MintworX combines the excitement of NFT art with practical utility. Our NFTs are your exclusive key to the Mint Bot, a powerful tool for minting NFTs from top launchpads with precision.
            </p>
          </motion.div>

          {/* Right Side Card */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="bg-[#111827] rounded-2xl shadow-xl p-6 text-center w-[420px]"
          >
            <div className="rounded-lg overflow-hidden mb-5">
              <img
                src={nftImages[currentIndex]}
                alt={`NFT ${currentIndex + 1}`}
                className="w-full h-90 object-cover rounded-xl transition duration-700 ease-in-out"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">MintworX</h3>
            <p className="text-sm text-gray-400 mb-5">
              This NFT can be minted from a website.
            </p>

            {/* Connect Button */}
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
