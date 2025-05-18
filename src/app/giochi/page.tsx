'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from '../../components/Navbar';
import GameCard from '../../components/GameCard';
import GameModal from '../../components/GameModal';
import { fetchStrapi } from '../../utils/api';

import type { StrapiGameItem } from '../../types/strapi';

export default function GiochiPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 50 });

    const fetchGiochi = async () => {
      try {
        const json = await fetchStrapi('/api/games?populate=*');

        const parsedGames: Game[] = json.data.map((item: StrapiGameItem) => {
            const attrs = item.attributes;
            const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

            return {
                id: item.id.toString(),
                titolo: attrs.titolo,
                descrizioneBreve: attrs.descrizioneBreve,
                categoria: attrs.categoria,
                giocatori: attrs.giocatori,
                durata: attrs.durata,
                difficolta: attrs.difficolta,
                rules: attrs.rules,
                immagineCopertina: attrs.immagineCopertina?.data?.attributes?.url
                ? `${baseUrl}${attrs.immagineCopertina.data.attributes.url}`
                : '/img/placeholder.jpg',
                immagineDettaglio: attrs.immagineDettaglio?.data?.attributes?.url
                ? `${baseUrl}${attrs.immagineDettaglio.data.attributes.url}`
                : '/img/placeholder.jpg',
            };
            });


        setGames(parsedGames);
      } catch (err) {
        console.error('Errore durante il fetch dei giochi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGiochi();
  }, []);

  const openModal = (id: string) => {
    const game = games.find((g) => g.id === id) ?? null;
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

          <h1 className="page-main-title mb-4" data-aos="fade-down" data-aos-delay={200}>
            Catalogo Giochi
          </h1>

          <p className="section-subtitle text-center md:text-left mb-8" data-aos="fade-up" data-aos-delay={300}>
            Scopri la nostra selezione di giochi da tavolo, perfetti per ogni serata!
          </p>

          <section id="catalogo" className="py-4">
            {loading ? (
              <p className="text-center text-gray-400">Caricamento giochi in corso...</p>
            ) : (
              <div
                id="lista-giochi-container"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                {games.map((game) => (
                  <GameCard key={game.id} game={game} onClick={openModal} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedGame && <GameModal game={selectedGame} onClose={closeModal} />}
    </>
  );
}
