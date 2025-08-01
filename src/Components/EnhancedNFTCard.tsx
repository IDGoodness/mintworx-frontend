const EnhancedNFTCard = ({
  nft,
}: {
  nft: {
    name: string;
    symbol: string;
    startTime: string;
    endTime: string;
    description: string;
    contractAddress: string;
  };
}) => {
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const collectionName = nft.name?.trim() ? nft.name : 'Unlisted NFT Collection';
  const symbol = nft.symbol?.trim() ? nft.symbol : 'NFT';
  const formattedStartTime = nft.startTime || 'N/A';

  return (
    <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-md mb-6 p-6 w-full max-w-md border border-[#303646] hover:shadow-2xl transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">{collectionName}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{symbol}</p>
        </div>
        <div className="text-2xl opacity-80">🖼️</div>
      </div>

      {/* Mint Times */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <div className="bg-[#262b3a] rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-400 mb-1">Start</p>
          <p className="whitespace-pre-line text-xs text-gray-100">{formattedStartTime}</p>
        </div>
        <div className="bg-[#262b3a] rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-gray-400 mb-1">End</p>
           <p className="whitespace-pre-line text-xs text-gray-100">{nft.endTime || 'N/A'}</p>
        </div>
      </div>

      {/* Description */}
      {nft.description && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-1">Description</p>
          <p className="text-sm text-gray-100">{nft.description}</p>
        </div>
      )}

      {/* Contract Address */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-1">Contract Address</p>
        <p className="text-sm text-blue-400">{formatAddress(nft.contractAddress)}</p>
      </div>
    </div>
  );
};

export default EnhancedNFTCard;
