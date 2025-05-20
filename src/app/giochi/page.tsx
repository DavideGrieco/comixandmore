'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from '../../components/Navbar';
import GameCard from '../../components/GameCard';
import GameModal from '../../components/GameModal';
import { fetchStrapi } from '../../utils/api';
import type { Game } from '../../types/game';
import type { StrapiGameItem } from '../../types/strapi';

export default function GiochiPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 50 });

    const fetchGiochi = async () => {
      try {
        setError(null);
        const json = await fetchStrapi('/api/games?populate=*');
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
        const parsedGames: Game[] = json.data.map((item: StrapiGameItem) => ({
          id:            item.id.toString(),
          titolo:        item.titolo,
          descrizioneBreve: item.descrizioneBreve,
          categoria:     item.categoria,
          giocatori:     item.giocatori,
          durata:        item.durata,
          difficolta:    item.difficolta,
          rules:         item.rules,
          immagineCopertina: item.immagineCopertina?.url
            ? `${baseUrl}${item.immagineCopertina.url}`
            : '/img/placeholder.jpg',
          immagineDettaglio: item.immagineDettaglio?.url
            ? `${baseUrl}${item.immagineDettaglio.url}`
            : '/img/placeholder.jpg',
        }));
        setGames(parsedGames);
        const uniqueCategories = Array.from(

          new Set(
            parsedGames
              .flatMap((g) => g.categoria.split(/\s+/))
              .map((c) => c.trim())
              .filter(Boolean),
          ),

        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Errore fetch giochi:', err);
        setError('Errore nel caricamento dei giochi');
      } finally {
        setLoading(false);
      }
    };

    fetchGiochi();
  }, []);

  const filteredGames = selectedCategory

    ? games.filter((g) =>
        g.categoria
          .split(/\s+/)
          .map((c) => c.trim())
          .includes(selectedCategory),
      )

    : games;

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
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Catalogo Giochi</span>
          </nav>

          <h1
            className="text-4xl font-bold mb-4 text-center md:text-left"
            data-aos="fade-down"
            data-aos-delay={200}
          >
            Catalogo Giochi
          </h1>

          <p
            className="text-gray-300 mb-8 text-center md:text-left"
            data-aos="fade-up"
            data-aos-delay={300}
          >
            Scopri la nostra selezione di giochi da tavolo, perfetti per ogni serata!
          </p>

          <section id="catalogo" className="py-4">
            {loading ? (
              <p className="text-center text-gray-400">Caricamento giochi in corso...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <div className="mb-6" data-aos="fade-up" data-aos-delay={350}>
                  <label htmlFor="categorySelect" className="sr-only">
                    Filtra per categoria
                  </label>
                  <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="">Tutte le categorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  id="lista-giochi-container"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  data-aos="fade-up"
                  data-aos-delay={400}
                >
                  {filteredGames.map((game, index) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onClick={openModal}
                      gradientIndex={index % 5}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {selectedGame && (
        <GameModal game={selectedGame} onClose={closeModal} />
      )}
    </>
  );
}
