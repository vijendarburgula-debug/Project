import { useState } from 'react';
import axios from 'axios';

export default function LoginGate({ onLogin }) {
  const [mode,     setMode]     = useState('login'); // 'login' | 'register'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const isValidEmail = /\S+@\S+\.\S+/.test(email.trim());
  const isValid = isValidEmail && password.length >= 8;

  const submit = async e => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    setError('');

    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(url, { email: email.trim(), password });
      onLogin(res.data.token, res.data.email);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"
      >
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm mb-3">
            API
          </div>
          <h1 className="text-sm font-bold text-gray-900">Cloud API Helper</h1>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'login' ? 'Sign in to continue' : 'Create an account to continue'}
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            autoComplete="username"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  );
}
