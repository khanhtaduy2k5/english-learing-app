"use client";

interface RadioStation {
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
}

interface RadioStationCardProps {
  station: RadioStation;
  isCurrent: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

export default function RadioStationCard({ station, isCurrent, isPlaying, onClick }: RadioStationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${
        isCurrent 
          ? "bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/30 shadow-lg"
          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
      }`}
    >
      {/* Indicator for currently playing */}
      {isCurrent && isPlaying && (
        <span className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-bold uppercase rounded-bl-xl tracking-wider select-none animate-pulse">
          Playing
        </span>
      )}
      
      {/* Channel Favicon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl border transition-all ${
        isCurrent
          ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 scale-105"
          : "bg-white/5 border-white/5 text-slate-400 group-hover:scale-105"
      }`}>
        {station.favicon ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={station.favicon} 
            alt="" 
            className="w-full h-full object-cover rounded-xl" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
          />
        ) : (
          "📻"
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            {station.country}
          </span>
        </div>
        <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-indigo-400" : "text-white group-hover:text-indigo-400 transition-colors"}`}>
          {station.name}
        </h4>
        <p className="text-slate-500 text-xs truncate mt-0.5">
          {station.tags}
        </p>
      </div>
    </button>
  );
}
