'use client';

import { useEffect, useState } from 'react';
import { fetchStrapi } from '../../utils/adminApi';
import type { Game } from '../../types/game';

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await fetchStrapi('/api/games');
        setGames(data);
      } catch (error) {
        console.error('Errore nel recupero dei giochi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Amministratore</h1>

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
                <td className="border px-4 py-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Modifica</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
