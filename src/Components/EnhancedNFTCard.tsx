//import React from 'react';

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
    <div className="bg-[#2c3445] text-white rounded-xl shadow-md p-5 w-full max-w-md space-y-4 border border-[#3c4459]">
      {/* Title + Emoji */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{collectionName}</h2>
          <p className="text-sm text-gray-400">{symbol}</p>
        </div>
        <div className="text-2xl">🎨</div>
      </div>

      {/* Start Time + End Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#3b4358] text-center p-3 rounded-lg">
          <p className="text-sm text-gray-300">Start Time</p>
          <p className="text-sm text-white">{formattedStartTime}</p>
        </div>
        <div className="bg-[#3b4358] text-center p-3 rounded-lg">
          <p className="text-sm text-gray-300">End Time</p>
          <p className="text-sm text-white">{nft.endTime || 'N/A'}</p>
        </div>
      </div>

      {/* Description */}
      {nft.description && (
        <div className="border-t border-[#3c4459] pt-3">
          <p className="text-sm text-gray-300 mb-1">Description</p>
          <p className="text-sm text-white">{nft.description}</p>
        </div>
      )}

      {/* Contract Address */}
      <div className="border-t border-[#3c4459] pt-3 text-sm text-gray-400">
        <p className="mb-1">Contract</p>
        <p className="text-blue-400">{formatAddress(nft.contractAddress)}</p>
      </div>

    </div>
  );
};

export default EnhancedNFTCard;
