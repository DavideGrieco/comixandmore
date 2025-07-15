import React, { useEffect, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

interface GameCategory {
  id: number;
  icon: string;
  title: string;
  text: string;
  color: string;
}

const gameCategories: GameCategory[] = [
  {
    id: 1,
    icon: 'fa-dice-d20',
    title: 'Giochi di Ruolo & Strategia',
    text: 'Immergiti in avventure epiche o pianifica la tua vittoria. Perfetti per serate intense.',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 2,
    icon: 'fa-users',
    title: 'Party Games',
    text: 'Risate garantite! Ideali per gruppi numerosi e per rompere il ghiaccio.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 3,
    icon: 'fa-puzzle-piece',
    title: 'Giochi per Famiglie',
    text: 'Divertimento per tutte le età. Semplici da imparare, difficili da smettere.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 4,
    icon: 'fa-chess-knight',
    title: 'Grandi Classici',
    text: 'Rispolvera i tuoi preferiti o scopri i giochi che hanno fatto la storia.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 5,
    icon: 'fa-brain',
    title: 'Eurogames & American',
    text: 'Per i palati fini: meccaniche complesse, ambientazioni immersive e sfide avvincenti.',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 6,
    icon: 'fa-plus-circle',
    title: 'E Molto Altro...',
    text: 'La nostra collezione è in continua espansione. Chiedi al nostro staff!',
    color: 'from-red-500 to-pink-600'
  }
];

export default function GameBoard() {
  const [activeSquare, setActiveSquare] = useState<number>(1);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Auto-play sempre attivo
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSquare = (activeSquare % 6) + 1;
      handleSquareClick(nextSquare);
    }, 3000); // Più rapido: 3 secondi

    return () => clearInterval(interval);
  }, [activeSquare]);

  const handleSquareClick = (squareNumber: number) => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Animazione del dado più rapida
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount > 8) { // Meno iterazioni per essere più rapido
        clearInterval(rollInterval);
        setDiceValue(squareNumber);
        setActiveSquare(squareNumber);
        setIsRolling(false);
      }
    }, 80); // Più veloce: 80ms invece di 100ms
  };

  const getDiceFace = (value: number) => {
    const dots: JSX.Element[] = [];
    const positions = [
      [], // 0 (non usato)
      [[50, 50]], // 1
      [[25, 25], [75, 75]], // 2
      [[25, 25], [50, 50], [75, 75]], // 3
      [[25, 25], [75, 25], [25, 75], [75, 75]], // 4
      [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]], // 5
      [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]] // 6
    ];

    positions[value]?.forEach((pos, index) => {
      dots.push(
        <div
          key={index}
          className="absolute w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner"
          style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
        />
      );
    });

    return dots;
  };


  const activeCategory = gameCategories.find(cat => cat.id === activeSquare);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Board di Gioco - Sinistra */}
      <div className="relative">
        <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl p-8 shadow-2xl border-8 border-amber-800 relative overflow-hidden">
          {/* Board Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-amber-800' : 'bg-amber-600'}`}
                />
              ))}
            </div>
          </div>

          {/* Central Dice - Molto più 3D */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div 
              className={`w-24 h-24 relative cursor-pointer transition-all duration-300 ${
                isRolling ? 'animate-spin scale-110' : 'hover:scale-105'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isRolling ? 'rotateX(360deg) rotateY(360deg) scale(1.1)' : 'rotateX(-10deg) rotateY(15deg)'
              }}
              onClick={() => handleSquareClick(Math.floor(Math.random() * 6) + 1)}
            >
              {/* Dado 3D con 6 facce */}
              <div className="dice-3d">
                {/* Faccia frontale */}
                <div className="dice-face dice-front">
                  {getDiceFace(diceValue)}
                </div>
                {/* Faccia posteriore */}
                <div className="dice-face dice-back">
                  {getDiceFace(7 - diceValue)}
                </div>
                {/* Faccia destra */}
                <div className="dice-face dice-right">
                  {getDiceFace((diceValue % 6) + 1)}
                </div>
                {/* Faccia sinistra */}
                <div className="dice-face dice-left">
                  {getDiceFace(((diceValue + 1) % 6) + 1)}
                </div>
                {/* Faccia superiore */}
                <div className="dice-face dice-top">
                  {getDiceFace(((diceValue + 2) % 6) + 1)}
                </div>
                {/* Faccia inferiore */}
                <div className="dice-face dice-bottom">
                  {getDiceFace(((diceValue + 3) % 6) + 1)}
                </div>
              </div>
            </div>
          </div>

          {/* Game Squares in Circle */}
          <div className="relative h-96">
            {gameCategories.map((category, index) => {
              const angle = (index * 60) - 90; // Distribuisce le 6 caselle in cerchio
              const radius = 140;
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <div
                  key={category.id}
                  className={`absolute w-24 h-24 rounded-2xl cursor-pointer transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 ${
                    activeSquare === category.id 
                      ? `bg-gradient-to-br ${category.color} scale-110 shadow-2xl ring-4 ring-white` 
                      : 'bg-gray-700 hover:bg-gray-600 scale-100 shadow-lg'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  onClick={() => handleSquareClick(category.id)}
                >
                  <div className="flex items-center justify-center h-full">
                    <i 
                      className={`fas ${category.icon} text-2xl ${
                        activeSquare === category.id ? 'text-white' : 'text-brand-yellow'
                      }`} 
                    />
                  </div>
                  
                  {/* Square Number */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeSquare === category.id 
                      ? 'bg-white text-gray-800' 
                      : 'bg-brand-yellow text-gray-800'
                  }`}>
                    {category.id}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-amber-800 rounded-full opacity-60"></div>
          <div className="absolute top-4 right-4 w-8 h-8 bg-amber-800 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 bg-amber-800 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-amber-800 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Descrizione Categoria - Destra */}
      {activeCategory && (
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 transition-all duration-500 h-full flex flex-col justify-center">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${activeCategory.color} mb-6 shadow-lg`}>
              <i className={`fas ${activeCategory.icon} text-3xl text-white`} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {activeCategory.title}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {activeCategory.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}