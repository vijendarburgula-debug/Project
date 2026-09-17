import { useState } from 'react';
import axios from 'axios';

export default function LoginGate({ onLogin }) {
  const [mode,     setMode]     = useState('login'); // 'login' | 'register' | 'forgot'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const isValidEmail = /\S+@\S+\.\S+/.test(email.trim());
  const isValid = mode === 'forgot' ? isValidEmail : (isValidEmail && password.length >= 8);

  const switchMode = next => {
    setMode(next);
    setError('');
    setForgotSent(false);
  };

  const submit = async e => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    setError('');

    try {
      if (mode === 'forgot') {
        await axios.post('/api/auth/request-reset', { email: email.trim() });
        setForgotSent(true);
      } else {
        const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const res = await axios.post(url, { email: email.trim(), password });
        onLogin(res.data.token, res.data.email);
      }
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
            {mode === 'login'    && 'Sign in to continue'}
            {mode === 'register' && 'Create an account to continue'}
            {mode === 'forgot'   && 'Request a password reset'}
          </p>
        </div>

        {mode === 'forgot' && forgotSent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
            Request sent for <span className="font-semibold">{email.trim()}</span> — your admin
            will set a new password for you and let you know.
          </div>
        ) : (
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
            {mode !== 'forgot' && (
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        )}

        {mode === 'login' && (
          <div className="text-right -mt-2">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot password?
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        {!(mode === 'forgot' && forgotSent) && (
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? 'Please wait…'
              : mode === 'login'    ? 'Sign In'
              : mode === 'register' ? 'Create Account'
              : 'Send Request'}
          </button>
        )}

        <p className="text-xs text-gray-400 text-center">
          {mode === 'login' && (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => switchMode('register')} className="text-blue-600 hover:text-blue-800 font-medium">
                Create one
              </button>
            </>
          )}
          {mode === 'register' && (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')} className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <button type="button" onClick={() => switchMode('login')} className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to sign in
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
