import React from 'react';
import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
  onClick: (id: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  // Colori di esempio - Rendi dinamici come preferisci
  const gradientFrom = 'from-pink-500'; // Esempio, puoi cambiarlo o basarlo su game.categoria
  const gradientTo = 'to-purple-600';   // Esempio
  const textColor = 'text-white';
  const dateColor = 'text-purple-200'; // O un altro colore che si adatti al gradiente
  const buttonBorderColor = 'border-white';
  const buttonHoverBg = 'hover:bg-white/20';

  // Clip-path per il taglio obliquo
  // Poligono: punto in alto a sinistra, punto in alto a destra, punto in basso a destra, punto in basso a sinistra
  // Esempio: sposta il punto in alto a sinistra più in basso per un taglio più profondo
  // e il punto in alto a destra un po' più in basso se vuoi che il taglio inizi più sotto
  const clipPathStyle = {
    // Esempio: taglio da (0% x, 30% y) a (100% x, 10% y)
    clipPath: 'polygon(0% 30%, 100% 10%, 100% 100%, 0% 100%)',
  };

  return (
    <div
      onClick={() => onClick(game.id)}
      className="
        relative w-full md:w-72 lg:w-80 h-52 md:h-56  // Altezza leggermente ridotta, larghezza reattiva
        rounded-2xl overflow-hidden shadow-xl cursor-pointer 
        group transition-all duration-300 ease-in-out hover:shadow-2xl
      "
    >
      {/* Immagine di copertina */}
      <img
        src={game.immagineCopertina || '/placeholder-image.jpg'} // Usa un placeholder se l'immagine non c'è
        alt={`Copertina di ${game.titolo}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Contenitore del contenuto colorato sagomato */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 
          h-[70%] md:h-[75%] // Aumentata l'altezza per più spazio per il testo
          bg-gradient-to-br ${gradientFrom} ${gradientTo}
          transition-all duration-300 ease-in-out
          group-hover:h-[75%] md:group-hover:h-[80%] // Leggero effetto hover
        `}
        style={clipPathStyle} // Applica il clip-path
      >
        {/* Padding interno all'area clippata */}
        {/* Il padding-top è importante per distanziare il testo dal "taglio" del clip-path */}
        <div className="h-full p-4 pt-10 md:pt-12 lg:pt-14 flex flex-col justify-between"> {/* Aggiustato padding-top */}
          <div>
            {/* Titolo del gioco */}
            <h3 className={`text-base md:text-lg font-bold ${textColor} mb-1 truncate`} title={game.titolo}>
              {game.titolo}
            </h3>
            {/* Descrizione */}
            <p className={`${textColor} text-xs md:text-sm opacity-80 line-clamp-2 md:line-clamp-3 leading-tight`}>
              {game.descrizioneBreve}
            </p>
          </div>

          {/* Footer della card colorata */}
          <div className="flex justify-between items-center mt-2"> {/* Aggiunto mt-2 per un po' di spazio */}
            <span className={`text-[10px] md:text-xs ${dateColor} opacity-80`}>
              {game.categoria} {/* O un'altra info come la data */}
            </span>
            <button
              className={`
                px-3 py-1 md:px-4 md:py-1.5
                border ${buttonBorderColor} rounded-md 
                text-[10px] md:text-xs font-semibold ${textColor}
                ${buttonHoverBg}
                transition-colors duration-200
              `}
            >
              Dettagli
            </button>
          </div>
        </div>
      </div>

      {/* L'ICONA SEPARATA È STATA RIMOSSA */}
    </div>
  );
};

export default GameCard;