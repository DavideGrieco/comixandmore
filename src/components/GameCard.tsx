import React, { useRef, useState, useEffect } from 'react';
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
  const selectedGradient = typeof gradientIndex === 'number' && !isNaN(gradientIndex) && gradientIndex >= 0
    ? gradients[gradientIndex % gradients.length]
    : gradients[0];

  const clipPathBottomStyle = {
    clipPath: 'polygon(0% 25%, 100% 5%, 100% 100%, 0% 100%)',
  };

  const categoriesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showArrows, setShowArrows] = useState(false);

  // Verifica se mostrare le frecce in base al contenuto scrollabile
  useEffect(() => {
    const checkOverflow = () => {
      if (!categoriesRef.current || !containerRef.current) return;
      setShowArrows(categoriesRef.current.scrollWidth > containerRef.current.clientWidth);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [game.categoria]);

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -80, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 80, behavior: 'smooth' });
    }
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
          {/* Wrapper per frecce + categorie */}
          <div
            className="flex items-center max-w-[calc(100%-90px)]"
            ref={containerRef}
          >
            {/* Freccia sinistra */}
            {showArrows && (
              <button
                onClick={e => { e.stopPropagation(); scrollLeft(); }}
                aria-label="Scroll categorie a sinistra"
                className="flex items-center justify-center text-white hover:text-gray-300 transition-colors duration-200 flex-shrink-0 px-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Categorie scrollabili */}
            <div
              ref={categoriesRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap"
              style={{scrollBehavior: 'smooth'}}
            >
              {game.categoria
                .split(/\s+/)
                .map((c) => c.trim())
                .filter(Boolean)
                .map((cat) => (
                  <span
                    key={cat}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedGradient.dateColor} ${
                      selectedGradient.buttonText === 'text-gray-800'
                        ? 'bg-black/20'
                        : 'bg-white/20'
                    } whitespace-nowrap`}
                  >
                    {cat}
                  </span>
                ))}
            </div>

            {/* Freccia destra */}
            {showArrows && (
              <button
                onClick={e => { e.stopPropagation(); scrollRight(); }}
                aria-label="Scroll categorie a destra"
                className="flex items-center justify-center text-white hover:text-gray-300 transition-colors duration-200 flex-shrink-0 px-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottone Dettagli */}
          <button
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
