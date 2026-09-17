import { useState } from 'react';
import axios from 'axios';

export default function LoginGate({ onLogin }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = /\S+@\S+\.\S+/.test(email.trim());

  const submit = async e => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);

    try {
      await axios.post('/api/auth/login', { email: email.trim() });
    } catch (err) {
      // Still let them in locally even if the backend log couldn't be written —
      // this gate is for identification, not real access control.
      console.warn('Login logging failed:', err.message);
    }

    onLogin(email.trim());
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
          <p className="text-xs text-gray-400 mt-1">Enter your email to continue</p>
        </div>

        <div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Continuing…' : 'Continue'}
        </button>

        <p className="text-xs text-gray-300 text-center">
          No password needed — this just identifies who's using the tool.
        </p>
      </form>
    </div>
  );
}
