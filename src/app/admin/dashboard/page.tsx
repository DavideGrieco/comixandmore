// src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import {
  fetchWithToken,
  uploadFile,
  createGame,
  updateGame,
  deleteGame,
} from '../../../utils/adminApi';
import type { Game } from '../../../types/game';

interface FormData {
  id?: string;
  titolo: string;
  descrizioneBreve: string;
  categoria: string;
  giocatori: string;
  durata: string;
  difficolta: string;
  rules: string;
  coverFile?: File;
  detailFile?: File;
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    titolo: '',
    descrizioneBreve: '',
    categoria: '',
    giocatori: '',
    durata: '',
    difficolta: '',
    rules: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // --- Fetch lista giochi ---
  const fetchGames = async () => {
    if (!token) {
      setError('Token non trovato. Effettua di nuovo il login.');
      setLoadingList(false);
      return;
    }
    try {
      const response = await fetchWithToken('/api/games?populate=*', token);
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
      const parsed: Game[] = response.data.map((item: any) => ({
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
      setError(err.message || 'Errore durante il recupero dei giochi');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // --- Handlers form ---
  const openNewForm = () => {
    setFormData({
      titolo: '',
      descrizioneBreve: '',
      categoria: '',
      giocatori: '',
      durata: '',
      difficolta: '',
      rules: '',
    });
    setFormError('');
    setFormStatus('idle');
    setFormOpen(true);
  };

  const openEditForm = (game: Game) => {
    setFormData({
      id: game.id,
      titolo: game.titolo,
      descrizioneBreve: game.descrizioneBreve,
      categoria: game.categoria,
      giocatori: game.giocatori,
      durata: game.durata,
      difficolta: game.difficolta,
      rules: game.rules,
    });
    setFormError('');
    setFormStatus('idle');
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo gioco?')) return;
    try {
      await deleteGame(token!, id);
      fetchGames();
    } catch (err: any) {
      alert(err.message || 'Errore durante l\'eliminazione');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    setFormData((f) => ({ ...f, [name]: files[0] }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormError('');

    try {
      // 1) upload file se presenti
      let coverId: number | undefined;
      let detailId: number | undefined;
      if (formData.coverFile) {
        coverId = await uploadFile(token!, formData.coverFile);
      }
      if (formData.detailFile) {
        detailId = await uploadFile(token!, formData.detailFile);
      }

      // 2) costruisco payload
      const payload: any = {
        titolo: formData.titolo,
        descrizioneBreve: formData.descrizioneBreve,
        categoria: formData.categoria,
        giocatori: formData.giocatori,
        durata: formData.durata,
        difficolta: formData.difficolta,
        rules: formData.rules,
      };
      if (coverId) payload.immagineCopertina = coverId;
      if (detailId) payload.immagineDettaglio = detailId;

      console.log('Update ID:', formData.id, typeof formData.id);

      // 3) create o update
      if (formData.id) {
        await updateGame(token!, Number(formData.id), payload);
      } else {
        await createGame(token!, payload);
      }

      // 4) refresh lista e chiudi form
      await fetchGames();
      setFormOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Errore durante il salvataggio');
      setFormStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Amministratore</h1>

      {error && <p className="text-red-400">{error}</p>}

      {/* Bottone per aprire il form */}
      <button
        onClick={openNewForm}
        className="inline-block bg-brand-blue text-white px-4 py-2 rounded"
      >
        + Nuovo Gioco
      </button>

      {/* FORM */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded shadow space-y-4 max-w-2xl"
        >
          <h2 className="text-xl font-semibold">
            {formData.id ? 'Modifica Gioco' : 'Crea Nuovo Gioco'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span>Titolo</span>
              <input
                name="titolo"
                value={formData.titolo}
                onChange={handleChange}
                required
                className="p-2 bg-gray-700 rounded"
              />
            </label>
            <label className="flex flex-col">
              <span>Categoria</span>
              <input
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="p-2 bg-gray-700 rounded"
              />
            </label>
            <label className="flex flex-col">
              <span>Giocatori</span>
              <input
                name="giocatori"
                value={formData.giocatori}
                onChange={handleChange}
                className="p-2 bg-gray-700 rounded"
              />
            </label>
            <label className="flex flex-col">
              <span>Durata</span>
              <input
                name="durata"
                value={formData.durata}
                onChange={handleChange}
                className="p-2 bg-gray-700 rounded"
              />
            </label>
            <label className="flex flex-col md:col-span-2">
              <span>Descrizione Breve</span>
              <textarea
                name="descrizioneBreve"
                value={formData.descrizioneBreve}
                onChange={handleChange}
                className="p-2 bg-gray-700 rounded"
              />
            </label>
            <label className="flex flex-col md:col-span-2">
              <span>Rules</span>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                className="p-2 bg-gray-700 rounded"
              />
            </label>
            <label className="flex flex-col">
              <span>Copertina</span>
              <input
                type="file"
                name="coverFile"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
            </label>
            <label className="flex flex-col">
              <span>Immagine Dettaglio</span>
              <input
                type="file"
                name="detailFile"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
            </label>
          </div>

          {formError && <p className="text-red-400">{formError}</p>}

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={formStatus === 'submitting'}
              className="bg-brand-yellow text-gray-900 px-4 py-2 rounded"
            >
              {formStatus === 'submitting' ? 'Salvataggio...' : 'Salva'}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="bg-gray-600 px-4 py-2 rounded"
            >
              Annulla
            </button>
          </div>
        </form>
      )}

      {/* TABELLA GIOCHI */}
      {loadingList ? (
        <p>Caricamento giochi...</p>
      ) : (
        <table className="w-full table-auto border-collapse bg-gray-800 rounded">
          <thead>
            <tr>
              <th className="border px-4 py-2">Titolo</th>
              <th className="border px-4 py-2">Categoria</th>
              <th className="border px-4 py-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id} className="hover:bg-gray-700">
                <td className="border px-4 py-2">{g.titolo}</td>
                <td className="border px-4 py-2">{g.categoria}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditForm(g)}
                    className="bg-blue-500 px-2 py-1 rounded"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="bg-red-500 px-2 py-1 rounded"
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
