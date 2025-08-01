import {RefreshCw} from "lucide-react";

type SniperEntry = {
  address: string;
  status: "pending" | "error" | "minted";
};

type Props = {
  snipers: SniperEntry[];
  onData?: () => void;
};

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const getStatusChip = (status: SniperEntry["status"]) => {
  const base = "px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold";
  switch (status) {
    case "pending":
      return <span className={`${base} text-gray-400`}>SNIPING</span>;
    case "error":
      return <span className={`${base} text-gray-400`}>FAILED</span>;
    case "minted":
      return <span className={`${base} text-gray-400`}>MINTED</span>;
  }
};

const GroupedSnipingCards = ({ snipers, onData }: Props) => {
  
    if (!snipers || snipers.length === 0) {
    return (
      <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-md mb-6 ">
        No active mints yet.
      </div>
    );
  }
  
  
  return (
    <div className="w-full max-w-md md:max-w-none md:flex-1 md:basis-1/2">
      <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-md mb-6 space-y-4">
          <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs text-gray-300 uppercase tracking-widest">Bot Status</h2>
              {onData && (
                <button
                  onClick={onData}
                  className="text-gray-400 hover:text-white transition"
                  title="Refresh"
                >
                  <RefreshCw size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#3b4358]">
          {snipers.map((entry, i) => (
            <div
              key={entry.address + i}
              className="flex justify-between items-center bg-[#3a3f52]/20 hover:bg-[#3a3f52] rounded-xl px-4 py-3 transition"
            >
              <p className="text-sm font-medium text-white/80">{formatAddress(entry.address)}</p>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/50 tracking-wider uppercase mb-[2px]"></span>
                {getStatusChip(entry.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupedSnipingCards;
