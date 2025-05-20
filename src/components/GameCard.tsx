// types/game.ts (o dove hai definito il tipo Game)
export interface Game {
  id: string;
  titolo: string;
  descrizioneBreve: string;
  immagineCopertina?: string;
  categoria: string; // Stringa di categorie separate da spazi
  // ...altri campi del gioco
}

// GameCard.tsx
import React, { useEffect, useState } from 'react';
import { Game as Game2 } from '../types/game'; // Assicurati che il percorso sia corretto

interface GameCardProps {
  game: Game2;
  onClick: (id: string) => void;
  gradientIndex?: number;
}

const gradients = [
  { from: 'from-pink-500', to: 'to-purple-600', dateColor: 'text-purple-200', buttonBorder: 'border-white', buttonText: 'text-white' },
  { from: 'from-sky-400', to: 'to-blue-600', dateColor: 'text-blue-200', buttonBorder: 'border-white', buttonText: 'text-white' },
  { from: 'from-green-400', to: 'to-teal-600', dateColor: 'text-teal-200', buttonBorder: 'border-white', buttonText: 'text-white' },
  { from: 'from-yellow-400', to: 'to-orange-500', dateColor: 'text-orange-200', buttonBorder: 'border-gray-700', buttonText: 'text-gray-800' },
  { from: 'from-red-500', to: 'to-rose-600', dateColor: 'text-rose-200', buttonBorder: 'border-white', buttonText: 'text-white' },
];

const GameCard: React.FC<GameCardProps> = ({ game, onClick, gradientIndex }) => {
  const selectedGradient = typeof gradientIndex === 'number' && !isNaN(gradientIndex) && gradientIndex >= 0
    ? gradients[gradientIndex % gradients.length]
    : gradients[0];

  const clipPathBottomStyle = {
    clipPath: 'polygon(0% 25%, 100% 5%, 100% 100%, 0% 100%)',
  };

  const [categories, setCategories] = useState<string[]>([]);

  // Estrae e imposta le categorie
  useEffect(() => {
    const catsArray = game.categoria
      .split(/\s+/) // Divide per uno o più spazi
      .map((c) => c.trim()) // Rimuove spazi bianchi extra da ogni categoria
      .filter(Boolean); // Rimuove stringhe vuote risultanti (es. da spazi multipli)
    
    setCategories(catsArray);
  }, [game.id, game.categoria]); // Riesegue se il gioco o le sue categorie cambiano

  return (
    <div
      onClick={() => onClick(game.id)}
      className="
        relative w-full h-[260px]
        rounded-2xl overflow-hidden shadow-xl cursor-pointer
        group transition-all duration-300 ease-in-out hover:shadow-2xl
      "
    >
      <img
        src={game.immagineCopertina || '/placeholder-image.jpg'}
        alt={`Copertina di ${game.titolo}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 z-0"
      />
      <div
        className={`
          absolute bottom-0 left-0 right-0
          h-[55%]
          bg-gradient-to-br ${selectedGradient.from} ${selectedGradient.to}
          transition-all duration-300 ease-in-out z-10
          group-hover:h-[61%]
          flex flex-col
          p-4 pt-[45px]
          rounded-b-2xl
        `}
        style={clipPathBottomStyle}
      >
        <div>
          <h3
            className={`text-lg font-bold ${selectedGradient.buttonText} mb-1 truncate`}
            title={game.titolo}
          >
            {game.titolo}
          </h3>
          <p className={`${selectedGradient.buttonText} text-xs opacity-80 line-clamp-2 leading-snug`}>
            {game.descrizioneBreve}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Contenitore per le categorie */}
          <div
            className="overflow-hidden max-w-[calc(100%-90px)] flex-grow" // Limita la larghezza per fare spazio al bottone "Dettagli"
          >
            <div
              className="flex gap-2 whitespace-nowrap" // `gap-2` per lo spazio tra i badge
            >
              {categories.length > 0 && (
                <span
                  key={`${game.id}-${categories[0]}-first`}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedGradient.dateColor} ${
                    selectedGradient.buttonText === 'text-gray-800'
                      ? 'bg-black/20'
                      : 'bg-white/20'
                  } whitespace-nowrap flex-shrink-0`}
                  title={categories[0]} // Mostra il nome completo al passaggio del mouse se è troncato
                >
                  {categories[0]}
                </span>
              )}
              {categories.length > 1 && (
                <span
                  key={`${game.id}-plus-more`}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedGradient.dateColor} ${
                    selectedGradient.buttonText === 'text-gray-800'
                      ? 'bg-black/20'
                      : 'bg-white/20'
                  } whitespace-nowrap flex-shrink-0`}
                  title={`Altre ${categories.length - 1} categorie`}
                >
                  +{categories.length - 1}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Impedisce che il click sul bottone triggeri l'onClick della card
              console.log(`Dettagli per il gioco: ${game.id}`);
              // Qui potresti implementare la logica per mostrare i dettagli
            }}
            className={`
              ml-3
              px-4 py-1.5
              border ${selectedGradient.buttonBorder} rounded-lg
              text-xs font-semibold ${selectedGradient.buttonText}
              hover:bg-white/10 dark:hover:bg-black/10
              transition-colors duration-200
              flex-shrink-0
            `}
          >
            Dettagli
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;