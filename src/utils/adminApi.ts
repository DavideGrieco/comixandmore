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

  return res.json();
};

export const createGame = async (token: string, data: any) => {
  return fetchWithToken('/api/games', token, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
};

export const updateGame = async (token: string, id: string, data: any) => {
  return fetchWithToken(`/api/games/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
};

export const deleteGame = async (token: string, id: string) => {
  return fetchWithToken(`/api/games/${id}`, token, {
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
