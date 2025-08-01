import React from 'react';

type MintBotControlsProps = {
  privateKey: string;
  setPrivateKey: (k: string) => void;
  mintAmount: number;
  setMintAmount: (m: number) => void;
  loading: boolean;
  onMint: () => void;
  max: number;
};

const MintBotControls: React.FC<MintBotControlsProps> = ({
  privateKey,
  setPrivateKey,
  mintAmount,
  setMintAmount,
  loading,
  onMint,
  max,
}) => {
  return (
    <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-md mb-6space-y-6">
      {/* Private Key */}
      <div>
        <p className="text-xs text-gray-300 uppercase tracking-widest mb-3">PRIVATE KEY</p>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Enter your private key"
          className="w-full px-3 py-4 text-sm text-white bg-[#1e1f22] rounded-lg focus:outline-none placeholder-gray-500"
        />
      </div>

      {/* Mint Amount & Start Button */}
      <div>
        <p className="text-xs text-gray-300 uppercase tracking-widest mb-3">QUANTITY</p>

        <div className="flex flex-nowrap items-center justify-between gap-4 overflow-x-auto">
          {/* Mint Input Box */}
          <div className="flex items-center bg-[#1e1f22] rounded-lg px-3 py-2 space-x-2">
            <button
              onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
              disabled={mintAmount <= 1}
              className="text-lg text-white px-2 disabled:opacity-40"
            >
              −
            </button>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) =>
                setMintAmount(Math.min(max, Number(e.target.value)))
              }
              className="w-10 text-center bg-transparent text-white appearance-none focus:outline-none
              [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <button
              onClick={() => setMintAmount(Math.min(max, mintAmount + 1))}
              disabled={mintAmount >= max}
              className="text-lg text-white px-2 disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Mint Button */}
          <button
            onClick={onMint}
            disabled={loading}
            className="px-4 py-3 text-xs text-white uppercase tracking-widest mb-3 bg-blue-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Minting...' : 'Activate'}
          </button>
        </div>

        {/* Limit Text */}
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">LIMIT {max} per wallet</p>
      </div>
    </div>
  );
};

export default MintBotControls;
