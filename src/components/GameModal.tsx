// src/components/GameModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Game } from '../types/game';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export default function GameModal({ game, onClose }: GameModalProps) {
  const [activeTab, setActiveTab] = useState<'descrizione' | 'regole'>('descrizione');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!game) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay active"
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <button
          className="modal-close-btn"
          aria-label="Chiudi dettagli gioco"
          onClick={onClose}
        >
          <i className="fas fa-times" />
        </button>

        <div className="modal-image-column">
          <img
            src={game.immagineDettaglio}
            alt={`Immagine dettaglio ${game.titolo}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="modal-details-column flex flex-col">
          <h3 className="modal-game-title-popup">{game.titolo}</h3>

          {/* Tab nav */}
          <nav className="mt-4 flex border-b border-gray-700">
            {(['descrizione', 'regole'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'descrizione' ? 'Descrizione' : 'Regole';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 text-center py-2 font-semibold transition-colors
                    ${isActive
                      ? 'text-white border-b-2 border-brand-blue'
                      : 'text-gray-400 hover:text-white'}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Contenuto tab */}
          <div className="mt-4 overflow-y-auto flex-1">
            {activeTab === 'descrizione' ? (
              <div className="space-y-2">
                <p><strong className="text-brand-yellow">Categoria:</strong> {game.categoria}</p>
                <p><strong className="text-brand-yellow">Giocatori:</strong> {game.giocatori}</p>
                <p><strong className="text-brand-yellow">Durata:</strong> {game.durata}</p>
                <p><strong className="text-brand-yellow">Difficoltà:</strong> {game.difficolta}</p>
                <p className="mt-4 text-gray-300">{game.descrizioneBreve}</p>
              </div>
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap">
                {game.rules}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
