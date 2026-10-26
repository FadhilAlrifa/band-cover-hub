import React from 'react';
import { ChevronRight, Music, Activity, Flame } from 'lucide-react';

export default function SongCard({ song, onSelect }) {
  return (
    <div
      onClick={() => onSelect(song)}
      className="relative overflow-hidden p-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl flex items-center justify-between cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* Background Stage Light Effect */}
      <div className="absolute -left-10 top-0 bottom-0 w-20 bg-amber-500/5 blur-xl group-hover:bg-amber-500/20 transition-all duration-500" />

      <div className="space-y-1.5 pr-2 min-w-0 relative z-10">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-100 text-base truncate group-hover:text-amber-300 transition-colors">
            {song.title}
          </h3>
          {song.status === 'wishlist' && (
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce shrink-0" />
          )}
        </div>

        <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 font-medium">
          <Music className="w-3 h-3 text-slate-500" />
          <span>{song.artist}</span>
        </p>

        <div className="flex items-center gap-2 pt-1">
          <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-extrabold font-mono tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            Key: {song.key}
          </span>
          {song.bpm && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
              <Activity className="w-3 h-3 text-amber-400" />
              {song.bpm} BPM
            </span>
          )}
        </div>
      </div>

      <div className="w-8 h-8 rounded-xl bg-slate-800/80 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition-all duration-300 shrink-0 shadow-md">
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}