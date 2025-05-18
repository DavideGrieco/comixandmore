// src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchWithToken } from '../../../utils/adminApi';
import type { Game } from '../../../types/game';

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token non trovato. Effettua di nuovo il login.');
        setLoading(false);
        return;
      }

      try {
        // Chiamata all’endpoint protetto
        const response = await fetchWithToken('/api/games?populate=*', token);

        // parsing flat: response.data è un array di oggetti con le proprietà in root
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
        const parsedGames: Game[] = response.data.map((item: any) => ({
          id: String(item.id),
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
      } catch (err: any) {
        setError(err.message || 'Errore durante il recupero dei giochi');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Amministratore</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Caricamento giochi...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Titolo</th>
              <th className="border px-4 py-2">Categoria</th>
              <th className="border px-4 py-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td className="border px-4 py-2">{game.titolo}</td>
                <td className="border px-4 py-2">{game.categoria}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Modifica
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
