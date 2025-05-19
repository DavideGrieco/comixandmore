import React from 'react';
import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
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
  let selectedGradient = gradients[0]; 
  if (typeof gradientIndex === 'number' && !isNaN(gradientIndex) && gradientIndex >= 0) {
    selectedGradient = gradients[gradientIndex % gradients.length];
  } else if (gradientIndex !== undefined) {
    console.warn(`GameCard per "${game.titolo}": Ricevuto gradientIndex non valido (${gradientIndex}), usando gradiente di default.`);
  }

  // Clip-path per il taglio obliquo
  const clipPathBottomStyle = {
    clipPath: 'polygon(0% 25%, 100% 5%, 100% 100%, 0% 100%)',
  };

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
        `}
        style={clipPathBottomStyle}
      >
        <div className="h-full p-4 pt-[45px] flex flex-col justify-between">
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
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs ${selectedGradient.dateColor} opacity-90`}>
              {game.categoria}
            </span>
            <button
              className={`
                px-4 py-1.5
                border ${selectedGradient.buttonBorder} rounded-lg 
                text-xs font-semibold ${selectedGradient.buttonText}
                hover:bg-white/10 dark:hover:bg-black/10 
                transition-colors duration-200
              `}
            >
              Dettagli
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;