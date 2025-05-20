'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from '../../components/Navbar';
import GameCard from '../../components/GameCard';
import GameModal from '../../components/GameModal';
import SuggestGameModal from '../../components/SuggestGameModal';
import { fetchStrapi } from '../../utils/api';
import type { Game } from '../../types/game';
import type { StrapiGameItem } from '../../types/strapi';

export default function GiochiPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [minPlayersBound, setMinPlayersBound] = useState<number>(0);
  const [maxPlayersBound, setMaxPlayersBound] = useState<number>(10);

  const [selectedMinPlayers, setSelectedMinPlayers] = useState<number | ''>('');
  const [minPlayerOptions, setMinPlayerOptions] = useState<number[]>([]);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [suggestOpen, setSuggestOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 50 });

    const fetchGiochi = async () => {
      try {
        setError(null);
        const json = await fetchStrapi('/api/games?populate=*');
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';

        const parsedGames: Game[] = json.data.map((item: StrapiGameItem) => ({
          id: item.id.toString(),
          titolo: item.titolo,
          descrizioneBreve: item.descrizioneBreve,
          categoria: item.categoria,
          giocatori: item.giocatori,
          durata: item.durata,
          difficolta: item.difficolta,
          rules: item.rules,
          immagineCopertina: item.immagineCopertina?.url
            ? `${baseUrl}${item.immagineCopertina.url}`
            : '/img/placeholder.jpg',
          immagineDettaglio: item.immagineDettaglio?.url
            ? `${baseUrl}${item.immagineDettaglio.url}`
            : '/img/placeholder.jpg',
        }));

        setGames(parsedGames);

        // Calcolo intervallo minimo e massimo di giocatori
        const playersNumbers = parsedGames
          .map((g) => g.giocatori.split('-').map((n) => parseInt(n, 10)))
          .filter((arr) => arr.length === 2 && !arr.some((n) => isNaN(n)));

        const minPlayers = playersNumbers.length
          ? Math.min(...playersNumbers.map((p) => p[0]))
          : 0;
        const maxPlayers = playersNumbers.length
          ? Math.max(...playersNumbers.map((p) => p[1]))
          : 0;

        setMinPlayersBound(minPlayers);
        setMaxPlayersBound(maxPlayers);

        // Categorie uniche
        const uniqueCategories = Array.from(
          new Set(
            parsedGames
              .flatMap((g) => g.categoria.split(/\s+/))
              .map((c) => c.trim())
              .filter(Boolean),
          ),
        );
        setCategories(uniqueCategories);

        // Opzioni min giocatori uniche
        const uniqueMinPlayers = Array.from(
          new Set(
            parsedGames
              .map((g) => parseInt(g.giocatori.split('-')[0], 10))
              .filter((n) => !isNaN(n)),
          ),
        ).sort((a, b) => a - b);
        setMinPlayerOptions(uniqueMinPlayers);
      } catch (err) {
        console.error('Errore fetch giochi:', err);
        setError('Errore nel caricamento dei giochi');
      } finally {
        setLoading(false);
      }
    };

    fetchGiochi();
  }, []);

  const filteredGames = games
    .filter((g: Game) => {
      if (selectedCategory) {
        const categoriesArray = g.categoria
          .split(/\s+/)
          .map((c) => c.trim());
        if (!categoriesArray.includes(selectedCategory)) return false;
      }
      return true;
    })
    .filter((g: Game) => {
      if (selectedMinPlayers !== '') {
        const [minP, maxP] = g.giocatori.split('-').map((n) => parseInt(n, 10));
        if (isNaN(minP) || isNaN(maxP)) return true;
        return maxP >= selectedMinPlayers;
      }
      return true;
    });

  const openModal = (id: string) => {
    const game = games.find((g) => g.id === id) ?? null;
    setSelectedGame(game);
  };
  const closeModal = () => setSelectedGame(null);

  const handleRandom = () => {
    if (games.length === 0) return;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setSelectedGame(randomGame);
    setSuggestOpen(false);
  };

  const handleSuggest = (category: string) => {
    const moodGames = games.filter((g) =>
      g.categoria
        .split(/\s+/)
        .map((c) => c.trim())
        .includes(category),
    );
    if (moodGames.length === 0) return;
    const randomGame = moodGames[Math.floor(Math.random() * moodGames.length)];
    setSelectedGame(randomGame);
    setSuggestOpen(false);
  };

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
            </Link>
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
                {/* Filtri sulla stessa riga */}
                <div
                  className="flex flex-wrap items-center gap-4 mb-6"
                  data-aos="fade-up"
                  data-aos-delay={350}
                >
                  {/* Filtro Categoria */}
                  <div>
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

                  {/* Slider Giocatori Minimi */}
                  <div className="flex-1 min-w-[150px] max-w-xs">
                    <label
                      htmlFor="players-range"
                      className="block text-xs mb-1 text-gray-300 select-none"
                    >
                      Giocatori minimi: {selectedMinPlayers === '' ? 1 : selectedMinPlayers}
                    </label>
                    <input
                      type="range"
                      id="players-range"
                      min={1}
                      max={12}
                      value={selectedMinPlayers === '' ? 1 : selectedMinPlayers}
                      onChange={(e) => setSelectedMinPlayers(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 rounded-full accent-yellow-400 cursor-pointer"
                    />
                  </div>
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

      {selectedGame && <GameModal game={selectedGame} onClose={closeModal} />}
      {suggestOpen && (
        <SuggestGameModal
          categories={categories}
          onRandom={handleRandom}
          onSuggest={handleSuggest}
          onClose={() => setSuggestOpen(false)}
        />
      )}
    </>
  );
}
