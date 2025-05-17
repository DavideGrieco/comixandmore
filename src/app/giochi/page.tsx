'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from '../../components/Navbar';
import GameCard from '../../components/GameCard';
import GameModal from '../../components/GameModal';
import { giochiData } from '../../data/giochiData';
import type { Game } from '../../types/game';

export default function GiochiPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 50 });
  }, []);

  const openModal = (id: string) => {
    const game = giochiData.find((g) => g.id === id) ?? null;
    setSelectedGame(game);
  };
  const closeModal = () => setSelectedGame(null);

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-16 bg-gray-800 text-gray-100 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-gray-400 mb-2"
            data-aos="fade-up"
            data-aos-delay={100}
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>{' '}
            <span className="mx-2">/</span>{' '}
            <span className="text-white">Catalogo Giochi</span>
          </nav>

          {/* Titolo */}
          <h1
            className="page-main-title mb-4"
            data-aos="fade-down"
            data-aos-delay={200}
          >
            Catalogo Giochi
          </h1>

          {/* Sottotitolo */}
          <p
            className="section-subtitle text-center md:text-left mb-8"
            data-aos="fade-up"
            data-aos-delay={300}
          >
            Scopri la nostra selezione di giochi da tavolo, perfetti per ogni serata!
          </p>

          {/* Griglia di game-card */}
          <section id="catalogo" className="py-4">
            <div
              id="lista-giochi-container"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
              data-aos="fade-up"
              data-aos-delay={400}
            >
              {giochiData.map((game) => (
                <GameCard key={game.id} game={game} onClick={openModal} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modale di dettaglio */}
      {selectedGame && (
        <GameModal game={selectedGame} onClose={closeModal} />
      )}
    </>
  );
}
