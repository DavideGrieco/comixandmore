// src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  fetchWithToken, 
  createGame, 
  updateGame, 
  deleteGame 
} from '../../../utils/adminApi';
import type { Game } from '../../../types/game';

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // campi del form
  const [formData, setFormData] = useState<Omit<Game,'id'>>({
    titolo: '',
    descrizioneBreve: '',
    categoria: '',
    giocatori: '',
    durata: '',
    difficolta: '',
    rules: '',
    immagineCopertina: '',
    immagineDettaglio: ''
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchGames = useCallback(async () => {
    if (!token) {
      setError('Token non trovato. Effettua il login.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetchWithToken('/api/games?populate=*', token);
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
      const parsed: Game[] = resp.data.map((item: any) => ({
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
          : '',
        immagineDettaglio: item.immagineDettaglio?.url
          ? `${baseUrl}${item.immagineDettaglio.url}`
          : ''
      }));
      setGames(parsed);
    } catch (err: any) {
      setError(err.message || 'Errore recupero giochi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // gestori form
  const openCreateForm = () => {
    setEditingGame(null);
    setFormData({
      titolo: '',
      descrizioneBreve: '',
      categoria: '',
      giocatori: '',
      durata: '',
      difficolta: '',
      rules: '',
      immagineCopertina: '',
      immagineDettaglio: ''
    });
    setFormVisible(true);
  };

  const openEditForm = (game: Game) => {
    setEditingGame(game);
    setFormData({
      titolo: game.titolo,
      descrizioneBreve: game.descrizioneBreve,
      categoria: game.categoria,
      giocatori: game.giocatori,
      durata: game.durata,
      difficolta: game.difficolta,
      rules: game.rules,
      immagineCopertina: game.immagineCopertina,
      immagineDettaglio: game.immagineDettaglio
    });
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingGame(null);
  };

  const handleChange = (field: keyof Omit<Game,'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingGame) {
        await updateGame(token, editingGame.id, formData);
      } else {
        await createGame(token, formData);
      }
      await fetchGames();
      closeForm();
    } catch (err: any) {
      alert(err.message || 'Errore durante il salvataggio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Sei sicuro di voler eliminare questo gioco?')) return;
    try {
      await deleteGame(token, id);
      await fetchGames();
    } catch (err: any) {
      alert(err.message || 'Errore durante l\'eliminazione');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Amministratore</h1>
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={openCreateForm}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
      >
        + Aggiungi Nuovo Gioco
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow space-y-4">
          <h2 className="text-xl">
            {editingGame ? 'Modifica Gioco' : 'Nuovo Gioco'}
          </h2>

          {/** campi di testo */}
          {([
            ['titolo','Titolo'],
            ['descrizioneBreve','Descrizione Breve'],
            ['categoria','Categoria'],
            ['giocatori','Giocatori'],
            ['durata','Durata'],
            ['difficolta','Difficoltà'],
          ] as const).map(([field,label]) => (
            <div key={field}>
              <label className="block text-sm">{label}</label>
              <input
                type="text"
                value={formData[field]}
                onChange={e => handleChange(field, e.target.value)}
                className="mt-1 w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm">Rules</label>
            <textarea
              value={formData.rules}
              onChange={e => handleChange('rules', e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm">URL Copertina</label>
            <input
              type="text"
              value={formData.immagineCopertina}
              onChange={e => handleChange('immagineCopertina', e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">URL Dettaglio</label>
            <input
              type="text"
              value={formData.immagineDettaglio}
              onChange={e => handleChange('immagineDettaglio', e.target.value)}
              className="mt-1 w-full p-2 bg-gray-700 rounded"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              {editingGame ? 'Salva Modifiche' : 'Crea Gioco'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Annulla
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Caricamento giochi...</p>
      ) : (
        <table className="w-full table-auto border-collapse bg-gray-800 rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2">Titolo</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{game.titolo}</td>
                <td className="px-4 py-2">{game.categoria}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => openEditForm(game)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                  >
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
