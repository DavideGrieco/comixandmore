'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SuggestGameModalProps {
  categories: string[];
  onRandom: () => void;
  onSuggest: (categories: string[]) => void;
  onClose: () => void;
}

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function SuggestGameModal({ categories, onRandom, onSuggest, onClose }: SuggestGameModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 transition-opacity duration-300 ease-in-out animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggest-game-title"
    >
      <div className="bg-gray-800 text-gray-100 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-modalContentShow">
        <div className="flex justify-between items-start">
          <h2 id="suggest-game-title" className="text-xl font-bold">Consiglio Gioco</h2>
          <button onClick={onClose} aria-label="Chiudi" className="text-gray-400 hover:text-white transition-colors">
            <IconClose />
          </button>
        </div>
        <button
          onClick={onRandom}
          className="w-full bg-brand-yellow text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-yellow/90 transition-colors"
        >
          Gioco casuale
        </button>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Scegli un mood
          </label>
          <div className="max-h-48 overflow-y-auto mb-3 space-y-1">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedMoods.includes(cat)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedMoods((prev) =>
                      checked ? [...prev, cat] : prev.filter((c) => c !== cat),
                    );
                  }}
                  className="text-brand-blue focus:ring-brand-blue"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => selectedMoods.length && onSuggest(selectedMoods)}
            disabled={selectedMoods.length === 0}
            className="w-full bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
          >
            Suggerisci
          </button>
        </div>
      </div>
    </div>
  );
}

