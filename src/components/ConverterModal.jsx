import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, FileText, Music } from 'lucide-react';
import { convertStandardToBracket } from '../utils/chordUtils';

export default function ConverterModal({ isOpen, onClose }) {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    const result = convertStandardToBracket(value);
    setConvertedText(result);
  };

  const handleCopy = () => {
    if (!convertedText) return;
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Smart Chord Converter</h3>
              <p className="text-xs text-slate-400">Konversi lirik 2-baris web ke format [Chord]</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Tempel Teks Asli Web</span>
            </label>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Contoh:\nG         D\nMalam ini ku sendiri\nEm        B7\nTak ada yang menemani`}
              className="flex-1 min-h-[280px] p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none placeholder:text-slate-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-400" />
              <span>Hasil Format Bracket [Chord]</span>
            </label>
            <div className="flex-1 min-h-[280px] p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-300/90 text-sm font-mono overflow-y-auto whitespace-pre-wrap select-text">
              {convertedText || (
                <span className="text-slate-600 italic">Hasil konversi akan muncul di sini...</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-500">*Salin hasil konversi untuk digunakan pada form lagu.</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all active:scale-95"
            >
              Tutup
            </button>
            <button
              onClick={handleCopy}
              disabled={!convertedText}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 rounded-xl flex items-center gap-2 transition-all shadow-neon-amber disabled:opacity-40 disabled:pointer-events-none active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Berhasil Disalin!' : 'Salin Hasil'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}