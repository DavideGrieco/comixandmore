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

  // Clip-path per il taglio obliquo.
  // Il primo valore Y (0% 25%) definisce quanto in basso inizia il taglio a sinistra.
  // Il secondo valore Y (100% 5%) definisce quanto in basso inizia il taglio a destra.
  // Percentuali più piccole per Y significano che il taglio inizia più in alto sull'area colorata.
  const clipPathBottomStyle = {
    clipPath: 'polygon(0% 25%, 100% 5%, 100% 100%, 0% 100%)',
    // Aumentando il primo Y (es. 0% 35%) e diminuendo il secondo Y (es. 100% 0%)
    // si aumenta l'inclinazione e si riduce l'altezza del taglio sul lato destro.
  };

  return (
    <div
      onClick={() => onClick(game.id)}
      className="
        relative w-full md:w-72 lg:w-80 h-[260px] // Altezza card leggermente ridotta
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
          h-[55%] // RIDOTTA l'altezza dell'area colorata
          bg-gradient-to-br ${selectedGradient.from} ${selectedGradient.to}
          transition-all duration-300 ease-in-out z-10
          group-hover:h-[61%] // Effetto hover corrispondente
        `}
        style={clipPathBottomStyle}
      >
        {/* Padding interno. Il padding-top è cruciale. */}
        <div className="h-full p-4 pt-[30px] md:pt-[35px] flex flex-col justify-between"> {/* RIDOTTO padding-top */}
          <div>
            <h3 
              className={`text-lg font-bold ${selectedGradient.buttonText} mb-1 truncate`} 
              title={game.titolo}
              // Aggiungi un po' di altezza minima se il titolo può essere molto corto
              // style={{ minHeight: '1.75rem' }} // Equivalente a h-7
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