import React from 'react';
import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
  onClick: (id: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div
      onClick={() => onClick(game.id)}
      className="
        h-full
        rounded-lg overflow-hidden shadow-lg cursor-pointer 
        transform transition-transform duration-200 hover:scale-105
        bg-white flex flex-col
      "
    >
      {/* Immagine di copertina: altezza fissa */}
      <div className="w-full h-56 bg-gray-200 flex-shrink-0">
        <img
          src={game.immagineCopertina}
          alt={game.titolo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenuto */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Badge di categoria */}
        <span className="self-start inline-block text-xs font-semibold bg-brand-blue text-white px-2 py-1 rounded-full whitespace-nowrap">
          {game.categoria}
        </span>

        {/* Titolo */}
        <h4 className="mt-2 text-lg font-bold text-gray-900">
          {game.titolo}
        </h4>

        {/* Descrizione breve */}
        <p className="mt-1 text-gray-600 text-sm flex-grow">
          {game.descrizioneBreve}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
