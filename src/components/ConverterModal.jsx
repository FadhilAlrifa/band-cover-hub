import React, { useState } from 'react';
import { Wand2, X } from 'lucide-react';
import { convertStandardToBracket } from '../utils/chordUtils';

export default function ConverterModal({ onClose }) {
  const [rawText, setRawText] = useState('');
  const [convertedText, setConvertedText] = useState('');

  const handleConvert = () => {
    const result = convertStandardToBracket(rawText);
    setConvertedText(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100">Chord Auto-Converter</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Tempel lirik & chord standar dari web manapun di bawah ini, lalu klik tombol konversi!
        </p>

        <textarea
          rows={5}
          placeholder="Tempel chord standar di sini..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
        />

        <button
          onClick={handleConvert}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
        >
          Ubah ke Format Bracket
        </button>

        {convertedText && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Hasil Konversi:</label>
            <textarea
              rows={5}
              readOnly
              value={convertedText}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(convertedText);
                alert('Hasil konversi telah disalin!');
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Salin Hasil Konversi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}