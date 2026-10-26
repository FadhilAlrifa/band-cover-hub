import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Radio, Music2, Gauge, CheckCircle2 } from 'lucide-react';
import { transposeChord } from '../utils/chordUtils';
import { updateSongStatus } from '../services/songService';

export default function StageView({ song, onBack }) {
  const [transposeKeyShift, setTransposeKeyShift] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [isUpdating, setIsUpdating] = useState(false);
  const lyricsContainerRef = useRef(null);

  // Auto Scroll Effect
  useEffect(() => {
    let scrollInterval = null;
    if (isScrolling) {
      scrollInterval = setInterval(() => {
        if (lyricsContainerRef.current) {
          lyricsContainerRef.current.scrollTop += 1;
        }
      }, 50 / scrollSpeed);
    }
    return () => clearInterval(scrollInterval);
  }, [isScrolling, scrollSpeed]);

  // Fungsi untuk mengubah status lagu menjadi 'completed' (Sudah Dicover)
  const handleMarkAsCompleted = async () => {
    setIsUpdating(true);
    try {
      await updateSongStatus(song.id, 'completed');
      alert(`Lagu "${song.title}" berhasil dipindahkan ke "Sudah Dicover"!`);
      onBack(); // Kembali ke daftar lagu setelah berhasil
    } catch (err) {
      alert("Gagal memperbarui status lagu.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Parsing lirik format bracket [Chord]
  const parseBracketLyrics = (text, shift = 0) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Header Bagian Lagu (Intro, Verse, Reff, Solo)
      if (line.trim().startsWith('[') && line.trim().endsWith(']') && !line.includes(' ')) {
        return (
          <div key={lineIdx} className="font-extrabold text-amber-300 mt-6 mb-2 text-sm tracking-widest uppercase border-b border-amber-500/30 pb-1 flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{line.trim().replace('[', '').replace(']', '')}</span>
          </div>
        );
      }

      const regex = /\[(.*?)\]/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ lyric: line.substring(lastIndex, match.index), chord: '' });
        }
        const chordTransposed = transposeChord(match[1], shift);
        parts.push({ lyric: '', chord: chordTransposed });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push({ lyric: line.substring(lastIndex), chord: '' });
      }

      const merged = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].chord && parts[i + 1] && parts[i + 1].lyric) {
          merged.push({ chord: parts[i].chord, lyric: parts[i + 1].lyric });
          i++;
        } else if (parts[i].chord) {
          merged.push({ chord: parts[i].chord, lyric: ' ' });
        } else {
          merged.push({ chord: '', lyric: parts[i].lyric });
        }
      }

      return (
        <div key={lineIdx} className="flex flex-wrap items-end min-h-[3rem] my-1.5">
          {merged.length === 0 ? <br /> : merged.map((item, itemIdx) => (
            <div key={itemIdx} className="flex flex-col items-start mr-2 leading-tight">
              {item.chord && (
                <span 
                  className="text-amber-300 font-black text-base font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-200 hover:scale-110"
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.9), 0 0 20px rgba(245, 158, 11, 0.6)' }}
                >
                  {item.chord}
                </span>
              )}
              <span className="text-slate-100 text-base font-semibold tracking-wide">{item.lyric}</span>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 z-20">
      {/* Top Controller Console */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/90 p-4 space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs text-amber-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all active:scale-95"
          >
            ← Kembali
          </button>

          {/* Transpose Key Control */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase font-bold mr-1">Transpose:</span>
            <button
              onClick={() => setTransposeKeyShift(prev => prev - 1)}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
            >
              -
            </button>
            <span className="text-xs font-black text-amber-300 w-7 text-center font-mono">
              {transposeKeyShift > 0 ? `+${transposeKeyShift}` : transposeKeyShift}
            </span>
            <button
              onClick={() => setTransposeKeyShift(prev => prev + 1)}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 active:scale-90 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* Title & Info & Status Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Music2 className="w-5 h-5 text-amber-400" />
              {song.title}
            </h2>
            <p className="text-xs text-slate-400 font-medium pl-7">{song.artist}</p>
          </div>

          {/* Tombol Tandai Selesai Cover jika lagu masih di Wishlist */}
          {song.status === 'wishlist' && (
            <button
              onClick={handleMarkAsCompleted}
              disabled={isUpdating}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] active:scale-95 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUpdating ? 'Proses...' : 'Tandai Selesai'}</span>
            </button>
          )}
        </div>

        {/* Stage Play Controller Bar */}
        <div className="flex items-center justify-between bg-slate-950 border border-amber-500/20 rounded-2xl p-2.5 shadow-inner">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScrolling(!isScrolling)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 ${
                isScrolling
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-neon-amber'
              }`}
            >
              {isScrolling ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isScrolling ? 'PAUSE SCROLL' : 'START AUTO-SCROLL'}</span>
            </button>

            <button
              onClick={() => {
                if (lyricsContainerRef.current) lyricsContainerRef.current.scrollTop = 0;
              }}
              className="p-2 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl active:scale-90 transition-all"
              title="Reset ke atas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <Gauge className="w-4 h-4 text-slate-500" />
            <input
              type="range"
              min="1"
              max="5"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
              className="w-16 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Interactive Stage Sheet Container */}
      <div
        ref={lyricsContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-2 select-text scroll-smooth bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950"
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {parseBracketLyrics(song.lyrics, transposeKeyShift)}
      </div>
    </div>
  );
}