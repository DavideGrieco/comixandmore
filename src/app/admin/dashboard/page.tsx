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
        const response = await fetchWithToken('/api/games?populate=*', token);
        const parsedGames: Game[] = response.data.map((item: any) => ({
          id: item.id.toString(),
          titolo: item.attributes.titolo,
          descrizioneBreve: item.attributes.descrizioneBreve,
          categoria: item.attributes.categoria,
          giocatori: item.attributes.giocatori,
          durata: item.attributes.durata,
          difficolta: item.attributes.difficolta,
          rules: item.attributes.rules,
          immagineCopertina: item.attributes.immagineCopertina?.data?.attributes?.url || '',
          immagineDettaglio: item.attributes.immagineDettaglio?.data?.attributes?.url || '',
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
