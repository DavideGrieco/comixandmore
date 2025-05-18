// src/utils/api.ts
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://91.99.50.222:1337';

export const fetchStrapi = async (endpoint: string, options = {}) => {
  const res = await fetch(`${STRAPI_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Errore fetch su ${endpoint}: ${res.status}`);
  }

  return res.json();
};
