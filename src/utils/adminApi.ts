const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://comixadmin.duckdns.org';

export const loginToStrapi = async (identifier: string, password: string) => {
  const res = await fetch(`${STRAPI_BASE_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || 'Login fallito');
  }

  return res.json(); // restituisce { jwt, user }
};

export const fetchWithToken = async (endpoint: string, token: string, options: RequestInit = {}) => {
  const res = await fetch(`${STRAPI_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Errore fetch su ${endpoint}: ${res.status}`);
  }

  // Evita .json() se il corpo è vuoto (es. 204 No Content)
  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};


export const createGame = async (token: string, data: any) => {
  return fetchWithToken('/api/games', token, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
};

export const updateGame = async (token: string, id: string | number, data: any) => {
  return fetchWithToken(`/api/games/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
};

export const updateGameByDocumentId = async (
  token: string,
  documentId: string,
  data: any
) => {
  // Ottieni i giochi, incluse le bozze
  const queryRes = await fetchWithToken('/api/games?pagination[pageSize]=100&publicationState=preview', token);

  // 👇 Corretto accesso alla struttura tipica di Strapi (con attributes)
  const match = queryRes.data.find((g: any) => g.documentId === documentId);


  if (!match) {
    console.log('❌ documentId cercato:', documentId);
    console.log('📦 disponibili:', queryRes.data.map((g: any) => g.attributes?.documentId));
    throw new Error(`Nessun gioco trovato con documentId "${documentId}"`);
  }

  const gameId = match.id;

  console.log('✅ Updating game with real ID:', gameId);

  return fetchWithToken(`/api/games/${documentId}`, token, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
};



export const deleteGame = async (token: string, id: string) => {
  return fetchWithToken(`/api/games/${id}`, token, {
    method: 'DELETE',
  });
};

export const deleteGameByDocumentId = async (token: string, documentId: string) => {
  // Ottieni i giochi (inclusi quelli in bozza)
  const queryRes = await fetchWithToken('/api/games?pagination[pageSize]=100&publicationState=preview', token);

  const match = queryRes.data.find((g: any) => g.documentId === documentId);

  if (!match) {
    console.log('❌ documentId cercato per delete:', documentId);
    console.log('📦 disponibili:', queryRes.data.map((g: any) => g.documentId));
    throw new Error(`Nessun gioco trovato con documentId "${documentId}"`);
  }

  console.log('🗑️ Eliminazione gioco con ID:', match.id);

  return fetchWithToken(`/api/games/${documentId}`, token, {
    method: 'DELETE',
  });
};


export const uploadFile = async (token: string, file: File): Promise<number> => {
  const formData = new FormData();
  formData.append('files', file);
  const res = await fetch(`${STRAPI_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload file fallito: ${res.status}`);
  const data = await res.json();
  return data[0].id; // restituisce l'ID del file appena caricato
};
