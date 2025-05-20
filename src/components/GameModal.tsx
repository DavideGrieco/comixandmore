// src/components/GameModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Game } from '../types/game';

// ... (IconClose e altre definizioni rimangono invariate) ...
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export default function GameModal({ game, onClose }: GameModalProps) {
  const [activeTab, setActiveTab] = useState<'descrizione' | 'regole'>('descrizione');
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null); // Ref per il contenitore dei tab
  const [indicatorStyle, setIndicatorStyle] = useState({}); // Stile per l'indicatore

  useEffect(() => {
    if (!game) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [game, onClose]);

  // Effetto per calcolare la posizione dell'indicatore del tab
  useEffect(() => {
    if (tabsContainerRef.current && game) {
      const activeButton = tabsContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeButton) {
        setIndicatorStyle({
          left: `${activeButton.offsetLeft}px`,
          width: `${activeButton.offsetWidth}px`,
        });
      }
    }
  }, [activeTab, game]); // Riesegui quando activeTab o game (per assicurare che il modale sia montato) cambiano


  if (!game) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const TABS_CONFIG = [
    { id: 'descrizione', label: 'Descrizione' },
    { id: 'regole', label: 'Regole' },
  ] as const;


  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 transition-opacity duration-300 ease-in-out animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
    >
      <div
        ref={modalContentRef}
        className="bg-gray-800 text-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] transform transition-all duration-300 ease-out animate-modalContentShow"
      >
        {/* Colonna Immagine */}
        <div className="w-full md:w-2/5 h-64 md:h-auto flex-shrink-0 relative">
          <img src={game.immagineDettaglio} alt={`Immagine dettaglio ${game.titolo}`} className="w-full h-full object-cover" />
          <button className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors md:hidden" aria-label="Chiudi dettagli gioco" onClick={onClose}><IconClose /></button>
        </div>

        {/* Colonna Dettagli */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-hidden">
          <div className="flex justify-between items-start mb-1">
            <h3 id="game-modal-title" className="text-2xl sm:text-3xl font-bold text-white">{game.titolo}</h3>
            <button className="text-gray-400 hover:text-white transition-colors ml-4 p-1 hidden md:block" aria-label="Chiudi dettagli gioco" onClick={onClose}><IconClose /></button>
          </div>
          <span className="text-sm text-brand-yellow mb-6 block">{game.categoria}</span>

          {/* Navigazione Tab */}
          <nav ref={tabsContainerRef} className="mb-1 relative border-b border-gray-700 flex"> {/* Aggiunto relative e rimosso space-x */}
            {TABS_CONFIG.map((tabItem) => {
              const isActive = activeTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  data-tab={tabItem.id} // Aggiunto data-tab per querySelector
                  onClick={() => setActiveTab(tabItem.id)}
                  className={`
                    flex-1 text-center px-4 py-3 font-medium text-sm 
                    transition-colors duration-200 ease-in-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-opacity-75
                    ${isActive ? 'text-brand-blue' : 'text-gray-400 hover:text-white'}
                  `}
                >
                  {tabItem.label}
                </button>
              );
            })}
            {/* Indicatore animato */}
            <div
              className="absolute bottom-[-1px] h-0.5 bg-brand-blue transition-all duration-300 ease-out" // -1px per sovrapporsi leggermente al bordo
              style={indicatorStyle}
            />
          </nav>

          {/* Contenuto Tab */}
          <div className="mt-1 overflow-y-auto flex-1 custom-scrollbar pr-1"> {/* Scrollbar personalizzata */}
            <div key={activeTab} className="animate-tabContentShow">
              {activeTab === 'descrizione' ? (
                <div className="space-y-3 py-4 text-sm">
                  <p><strong className="font-semibold text-gray-300">Giocatori:</strong> {game.giocatori}</p>
                  <p><strong className="font-semibold text-gray-300">Durata:</strong> {game.durata}</p>
                  <p><strong className="font-semibold text-gray-300">Difficoltà:</strong> {game.difficolta}</p>
                  <p className="mt-4 text-gray-300 leading-relaxed">{game.descrizioneBreve}</p>
                </div>
              ) : (
                <p className="py-4 text-gray-300 whitespace-pre-wrap leading-relaxed text-sm break-words">
                  {game.rules.split(/(https?:\/\/\S+)/g).map((part, i) =>
                    /^https?:\/\//.test(part) ? (
                      <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue underline"
                      >
                        {part}
                      </a>
                    ) : (
                      part
                    ),
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}