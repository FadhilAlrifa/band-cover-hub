import React, { useState } from 'react';
import { Sparkles, Music } from 'lucide-react';
import ConverterModal from './ConverterModal';

export default function Header({ onApplyConvertedLyrics }) {
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const handleApply = (convertedText) => {
    if (onApplyConvertedLyrics) {
      onApplyConvertedLyrics(convertedText);
    }
    setIsConverterOpen(false);
  };

  return (
    <>
      <header className="relative z-30 flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shadow-lg">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            <Music className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Band Hub <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">LIVE</span>
            </h1>
            <p className="text-xs text-slate-400">Gitar Utama</p>
          </div>
        </div>

        {/* Tombol Convert (Terganti Z-Index agar Selalu Bisa Ditekan) */}
        <button
          type="button"
          onClick={() => setIsConverterOpen(true)}
          className="relative z-30 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all active:scale-95 cursor-pointer pointer-events-auto"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Convert</span>
        </button>
      </header>

      {/* Modal Converter */}
      <ConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onApplyConverted={handleApply}
      />
    </>
  );
}