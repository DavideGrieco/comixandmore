'use client';

import { useState } from 'react';
import { loginToStrapi } from '../../utils/adminApi';

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const result = await loginToStrapi(identifier, password);
      console.log('Login successo:', result);
      setStatus('success');
      setMessage('Login effettuato con successo!');
    } catch (err: any) {
      console.error('Login fallito:', err.message);
      setStatus('error');
      setMessage(err.message || 'Errore durante il login');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login Amministratore</h1>

        <label className="block mb-3">
          <span className="text-sm text-gray-300">Email o username</span>
          <input
            type="text"
            className="mt-1 block w-full p-2 rounded bg-gray-700 text-white"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-300">Password</span>
          <input
            type="password"
            className="mt-1 block w-full p-2 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-brand-yellow text-gray-900 font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
        >
          {status === 'loading' ? 'Accesso...' : 'Accedi'}
        </button>

        {status !== 'idle' && (
          <p className={`mt-4 text-sm text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
