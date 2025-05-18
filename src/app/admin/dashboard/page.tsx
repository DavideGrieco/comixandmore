'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const exp = localStorage.getItem('token_expiration');

    const isValid =
      token && exp && parseInt(exp) > Date.now();

    if (!isValid) {
      router.replace('/admin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <main className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        <p>Controllo credenziali in corso...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Amministratore</h1>
      <p>Benvenuto nella sezione di gestione del catalogo!</p>
      {/* Qui aggiungerai la gestione CRUD del catalogo */}
    </main>
  );
}
