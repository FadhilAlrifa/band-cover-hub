import React from 'react';
import { Disc3, Wand2, Volume2, Sparkles } from 'lucide-react';

export default function Header({ currentUser, onOpenConverter }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-amber-500/20 px-4 py-3 flex items-center justify-between shadow-2xl">
      {/* Profil User & Status Band */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center p-0.5 shadow-neon-amber">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Disc3 className="w-6 h-6 text-amber-400 animate-[spin_8s_linear_infinite]" />
            </div>
          </div>
          {/* Status Indicator Dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-extrabold tracking-tight text-white">Band Hub</h1>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono uppercase">Live</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="text-slate-200 font-semibold">{currentUser.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 capitalize flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              {currentUser.instrument.replace('_', ' ')}
            </span>
          </p>
        </div>
      </div>

      {/* Converter Button & Audio Equalizer Animated Bars */}
      <div className="flex items-center gap-3">
        {/* Visualizer Equalizer Mini */}
        <div className="hidden sm:flex items-end gap-1 h-5 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="w-0.5 bg-amber-400 animate-eq-1 rounded-full" />
          <span className="w-0.5 bg-amber-400 animate-eq-2 rounded-full" />
          <span className="w-0.5 bg-amber-400 animate-eq-3 rounded-full" />
          <span className="w-0.5 bg-amber-400 animate-eq-4 rounded-full" />
        </div>

        <button
          onClick={onOpenConverter}
          className="relative group overflow-hidden px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 shadow-neon-amber active:scale-95 transition-all"
        >
          <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span>Convert</span>
          <Sparkles className="w-3 h-3 text-slate-900 animate-pulse" />
        </button>
      </div>
    </header>
  );
}