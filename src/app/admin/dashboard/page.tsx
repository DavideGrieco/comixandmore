'use client';

import { useEffect, useState, ChangeEvent, FormEvent, useRef } from 'react';
import {
  fetchWithToken,
  uploadFile,
  createGame,
  updateGameByDocumentId,
  deleteGameByDocumentId
} from '../../../utils/adminApi';
import type { Game } from '../../../types/game';

// Icone
const IconCatalog = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 4h8a2 2 0 012 2v10a2 2 0 01-2 2H9V4zm-1 0H3a2 2 0 00-2 2v10a2 2 0 002 2h5V4zM3 6h5v1H3V6zm0 2h5v1H3V8zm0 2h5v1H3v-1z" />
  </svg>
);
const IconEvents = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);
const IconColumns = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h5a2 2 0 002-2V7a2 2 0 00-2-2h-5a2 2 0 00-2 2m0 10l-3-3m3 3l3-3m-3-3l-3 3m3-3l3 3" />
  </svg>
);
const IconClose = () => ( // Icona per chiudere il modale
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface FormDataInterface { // Rinominata per chiarezza, FormData è un tipo globale
  documentId?: string;
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

const initialFormData: FormDataInterface = {
  titolo: '',
  descrizioneBreve: '',
  categoria: '',
  giocatori: '',
  durata: '',
  difficolta: '',
  rules: '',
};

const configurableColumns = [
  { key: 'categoria', label: 'Categoria', defaultVisible: true },
  { key: 'giocatori', label: 'Giocatori', defaultVisible: true },
  { key: 'durata', label: 'Durata', defaultVisible: false },
  { key: 'difficolta', label: 'Difficoltà', defaultVisible: false },
  { key: 'descrizioneBreve', label: 'Descrizione', defaultVisible: false },
  { key: 'rules', label: 'Regole', defaultVisible: false }
] as const;

type ConfigurableColumnKey = typeof configurableColumns[number]['key'];

// Helper per inizializzare visibleColumns, assicurandosi che tutte le chiavi siano presenti
const getInitialVisibleColumns = (): Record<ConfigurableColumnKey, boolean> => {
  const initialState = {} as Record<ConfigurableColumnKey, boolean>;
  configurableColumns.forEach(col => {
    initialState[col.key] = col.defaultVisible;
  });
  return initialState;
};


export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataInterface>(initialFormData);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  // Stato per la visibilità delle colonne, inizializzato correttamente
  const [visibleColumns, setVisibleColumns] = useState<Record<ConfigurableColumnKey, boolean>>(
    getInitialVisibleColumns()
  );
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const columnSelectorRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);


  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchGames = async () => {
    if (!token) {
      setError('Token non trovato. Effettua di nuovo il login.');
      setLoadingList(false);
      return;
    }
    setLoadingList(true);
    try {
      const response = await fetchWithToken('/api/games?populate=*', token);
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';
      const parsed: Game[] = response.data.map((item: any) => ({
        id: String(item.id),
        documentId: item.documentId,
        titolo: item.titolo || '',
        descrizioneBreve: item.descrizioneBreve || '',
        categoria: item.categoria || '',
        giocatori: item.giocatori || '',
        durata: item.durata || '',
        difficolta: item.difficolta || '',
        rules: item.rules || '',
        immagineCopertina: item.immagineCopertina?.url ? `${baseUrl}${item.immagineCopertina.url}` : '',
        immagineDettaglio: item.immagineDettaglio?.url ? `${baseUrl}${item.immagineDettaglio.url}` : ''
      }));
      setGames(parsed);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Errore durante il recupero dei giochi');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchGames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setColumnSelectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [columnSelectorRef]);

  // Gestione chiusura modale
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && formOpen) {
        setFormOpen(false);
      }
    };
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (formOpen && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        setFormOpen(false);
      }
    };
    if (formOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutsideModal);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [formOpen]);

  const openNewForm = () => {
    setFormData({...initialFormData, documentId: undefined, coverFile: undefined, detailFile: undefined});
    setFormError('');
    setFormStatus('idle');
    setFormOpen(true);
  };

  const openEditForm = (game: Game) => {
    setFormData({
      documentId: game.documentId,
      titolo: game.titolo || '',
      descrizioneBreve: game.descrizioneBreve || '',
      categoria: game.categoria || '',
      giocatori: game.giocatori || '',
      durata: game.durata || '',
      difficolta: game.difficolta || '',
      rules: game.rules || '',
      coverFile: undefined,
      detailFile: undefined,
    });
    setFormError('');
    setFormStatus('idle');
    setFormOpen(true);
  };

  const handleDelete = async (documentId: string | undefined) => {
    if (!documentId) { alert('ID del documento non valido.'); return; }
    if (!confirm('Sei sicuro di voler eliminare questo gioco?')) return;
    if (!token) { alert('Token non trovato.'); return; }
    try {
      await deleteGameByDocumentId(token, documentId);
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
    setFormData((f) => ({ ...f, [name]: (files && files.length > 0) ? files[0] : undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setFormError('Token non trovato.'); setFormStatus('error'); return;
    }
    setFormStatus('submitting');
    setFormError('');
    try {
      let coverId: number | undefined;
      let detailId: number | undefined;
      if (formData.coverFile) coverId = await uploadFile(token, formData.coverFile);
      if (formData.detailFile) detailId = await uploadFile(token, formData.detailFile);
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
      if (formData.documentId) {
        await updateGameByDocumentId(token, formData.documentId, payload);
      } else {
        await createGame(token, payload);
      }
      await fetchGames();
      setFormOpen(false);
      setFormStatus('idle');
    } catch (err: any) {
      console.error("Errore submit:", err.response?.data || err.message || err);
      setFormError(err.response?.data?.error?.message || err.message || 'Errore durante il salvataggio');
      setFormStatus('error');
    }
  };

  const handleColumnToggle = (key: ConfigurableColumnKey) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <aside className="w-20 md:w-64 bg-gray-800 p-4 md:p-6 space-y-8 shadow-lg fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out hidden sm:block"> {/* Aumentato z-index sidebar */}
        <div className="text-brand-yellow font-bold text-xl md:text-2xl pb-4 border-b border-gray-700 hidden md:block">
          Admin
        </div>
        <nav className="space-y-3">
          <a href="#" className="flex items-center space-x-3 p-2 md:p-3 rounded-lg text-gray-300 bg-brand-blue bg-opacity-80 hover:bg-opacity-100 transition-colors" aria-current="page">
            <IconCatalog />
            <span className="hidden md:inline">Catalogo Giochi</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 md:p-3 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-700 transition-colors">
            <IconEvents />
            <span className="hidden md:inline">Eventi (Placeholder)</span>
          </a>
        </nav>
      </aside>

      <main className="flex-1 sm:ml-20 md:ml-64 p-6 md:p-10 space-y-10 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Catalogo Giochi
          </h1>
          <button onClick={openNewForm} className="bg-brand-blue hover:bg-opacity-80 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            <span>Nuovo Gioco</span>
          </button>
        </header>

        {error && <p className="bg-red-800 text-red-100 p-4 rounded-md shadow-lg">{error}</p>}

        {/* LA SEZIONE DEL FORM INLINE E' STATA RIMOSSA DA QUI */}

        <section className="mt-12">
          <div className="mb-6 flex justify-end">
            <div className="relative" ref={columnSelectorRef}>
              <button onClick={() => setColumnSelectorOpen(!columnSelectorOpen)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 transition-colors">
                <IconColumns />
                <span>Configura Colonne</span>
              </button>
              {columnSelectorOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-gray-700 rounded-lg shadow-xl z-40 p-4 space-y-3 border border-gray-600"> {/* Aumentato z-index */}
                  <p className="text-sm font-semibold text-white mb-2">Mostra/Nascondi Colonne:</p>
                  {configurableColumns.map(col => (
                    <label key={col.key} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-600 rounded-md">
                      <input type="checkbox" checked={visibleColumns[col.key]} onChange={() => handleColumnToggle(col.key)} className="form-checkbox h-4 w-4 text-brand-blue bg-gray-600 border-gray-500 rounded focus:ring-brand-blue focus:ring-opacity-50"/>
                      <span className="text-sm text-gray-200">{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          {loadingList ? ( <p className="text-center text-xl text-gray-400 py-10">Caricamento...</p> ) :
            games.length === 0 && !error ? ( <p className="text-center text-xl text-gray-400 py-10 bg-gray-800 rounded-lg shadow-md">Nessun gioco.</p> ) :
            !error && games.length > 0 ? (
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">Titolo</th>
                    {configurableColumns.map(col => visibleColumns[col.key] && (
                        <th key={col.key} scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider hidden sm:table-cell">{col.label}</th>
                    ))}
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-200 uppercase tracking-wider">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {games.map((g) => (
                    <tr key={g.documentId || g.id} className="hover:bg-gray-750 transition-colors duration-100 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{g.titolo}</div>
                          {/* Mostra categoria sotto il titolo su mobile se la colonna categoria è nascosta O non configurabile */}
                          {(!configurableColumns.find(c => c.key === 'categoria') || (configurableColumns.find(c => c.key === 'categoria') && !visibleColumns.categoria) ) && (
                             <div className="text-xs text-gray-400 sm:hidden">{g.categoria}</div>
                          )}
                      </td>
                      {configurableColumns.map(col => visibleColumns[col.key] && (
                          <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{(g as any)[col.key]}</td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-1 md:space-x-2">
                          {/* ICONA MODIFICA RIPRISTINATA */}
                          <button
                            onClick={() => openEditForm(g)}
                            className="text-indigo-400 hover:text-indigo-300 p-2 rounded-md hover:bg-gray-700 transition-all"
                            aria-label={`Modifica ${g.titolo}`}
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                          </button>
                          {/* ICONA ELIMINA RIPRISTINATA */}
                          <button
                            onClick={() => handleDelete(g.documentId)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-gray-700 transition-all"
                            aria-label={`Elimina ${g.titolo}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
            
      {/* MODALE PER IL FORM */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out" // Aumentato z-index, ridotta opacità bg
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalContentRef}
            className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-4 sm:mx-6 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 id="modal-title" className="text-2xl font-semibold text-white">
                {formData.documentId ? 'Modifica Gioco' : 'Crea Nuovo Gioco'}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-700"
                aria-label="Chiudi modale"
              >
                <IconClose />
              </button>
            </div>

            {/* Il form vero e proprio */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Titolo', name: 'titolo', type: 'text', required: true },
                  { label: 'Categoria', name: 'categoria', type: 'text', required: true },
                  { label: 'Giocatori (es. 2-4)', name: 'giocatori', type: 'text' },
                  { label: 'Durata (es. 30-60 min)', name: 'durata', type: 'text' },
                  { label: 'Difficoltà (es. Facile)', name: 'difficolta', type: 'text' },
                ].map(({ label, name, type, required }) => (
                  <label key={name} className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-300">{label}</span>
                    <input
                      type={type} name={name} value={(formData as any)[name] || ''} onChange={handleChange}
                      className="p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-shadow"
                      required={required}
                    />
                  </label>
                ))}
                <label className="flex flex-col space-y-1 md:col-span-2">
                  <span className="text-sm font-medium text-gray-300">Descrizione Breve</span>
                  <textarea
                    name="descrizioneBreve" value={formData.descrizioneBreve} onChange={handleChange} rows={3}
                    className="p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-shadow"
                  />
                </label>
                <label className="flex flex-col space-y-1 md:col-span-2">
                  <span className="text-sm font-medium text-gray-300">Regolamento (Rules)</span>
                  <textarea
                    name="rules" value={formData.rules} onChange={handleChange} rows={5}
                    className="p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-shadow"
                  />
                </label>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-300">Immagine Copertina</span>
                  <input type="file" name="coverFile" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-opacity-80 cursor-pointer"/>
                  {formData.coverFile && <span className="text-xs text-gray-400 mt-1">Selezionato: {formData.coverFile.name}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-300">Immagine Dettaglio</span>
                  <input type="file" name="detailFile" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-opacity-80 cursor-pointer"/>
                  {formData.detailFile && <span className="text-xs text-gray-400 mt-1">Selezionato: {formData.detailFile.name}</span>}
                </div>
              </div>
              {formError && <p className="bg-red-900 bg-opacity-50 text-red-300 p-3 rounded-md text-sm">{formError}</p>}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-700 mt-6">
                <button type="submit" disabled={formStatus === 'submitting'} className="bg-brand-yellow hover:bg-opacity-90 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                  {formStatus === 'submitting' ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-150 ease-in-out">
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}