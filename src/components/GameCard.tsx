import React from 'react';
import { Game } from '../types/game'; // Assumendo che il percorso sia corretto

interface GameCardProps {
  game: Game;
  onClick: (id: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div
      onClick={() => onClick(game.id)}
      className="
        group // Aggiunto per effetti hover su elementi figli
        h-full flex flex-col 
        bg-white dark:bg-gray-800 // Sfondo chiaro per tema chiaro, scuro per tema scuro
        rounded-xl overflow-hidden // Angoli più arrotondati
        shadow-lg hover:shadow-2xl dark:hover:shadow-brand-blue/30 // Ombra più definita e effetto hover
        cursor-pointer 
        transition-all duration-300 ease-in-out // Transizione più fluida per tutti gli effetti
        transform hover:scale-[1.03] // Leggermente ridotto lo scale per finezza
      "
    >
      {/* Immagine di copertina */}
      <div className="relative w-full h-56 flex-shrink-0 overflow-hidden">
        <img
          src={game.immagineCopertina || '/placeholder-image.jpg'} // Fallback per immagine mancante
          alt={`Copertina di ${game.titolo}`}
          className="
            w-full h-full object-cover 
            transition-transform duration-300 ease-in-out 
            group-hover:scale-110 // Effetto zoom sull'immagine all'hover sulla card
          "
        />
        {/* Badge categoria posizionato sopra l'immagine */}
        <span 
          className="
            absolute top-3 right-3 
            bg-brand-blue text-white 
            text-xs font-semibold 
            px-3 py-1 rounded-full 
            shadow
          "
        >
          {game.categoria}
        </span>
      </div>

      {/* Contenuto */}
      <div className="p-5 flex flex-col flex-grow"> {/* Aumentato padding */}
        {/* Titolo */}
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate" title={game.titolo}>
          {/* Usare un font custom se disponibile, es. font-display */}
          {game.titolo}
        </h4>

        {/* Descrizione breve */}
        <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow leading-relaxed">
          {/* Limita il numero di righe se necessario con plugin Tailwind Typography o CSS */}
          {game.descrizioneBreve}
        </p>
        
        {/* Potresti aggiungere altri dettagli qui se necessario, es. Giocatori, Durata */}
        {/* Esempio:
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{game.giocatori} Giocatori</span>
            <span>{game.durata}</span>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default GameCard;