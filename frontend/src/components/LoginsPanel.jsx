import { useEffect, useState } from 'react';
import axios from 'axios';

function formatTime(iso) {
  try { return new Date(iso).toLocaleString(); }
  catch { return iso; }
}

export default function LoginsPanel({ onClose }) {
  const [tab, setTab] = useState('history'); // 'history' | 'requests' | 'reset'

  // ── Reset requests ("forgot password" clicks) ───────────────────────────
  const [requests,        setRequests]        = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError,   setRequestsError]   = useState('');

  useEffect(() => {
    axios.get('/api/auth/admin/reset-requests')
      .then(res => setRequests(res.data || []))
      .catch(err => setRequestsError(err.response?.data?.error || err.message || 'Failed to load requests.'))
      .finally(() => setRequestsLoading(false));
  }, []);

  // ── Login history ────────────────────────────────────────────────────────
  const [rows,      setRows]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    axios.get('/api/auth/logins')
      .then(res => setRows(res.data || []))
      .catch(err => setError(err.response?.data?.error || err.message || 'Failed to load logins.'))
      .finally(() => setLoading(false));
  }, []);

  // A plain <a href> can't carry the session's Authorization header, so fetch
  // the CSV via axios (which does) and hand the browser a local blob instead.
  const downloadCsv = async () => {
    setExporting(true);
    try {
      const res = await axios.get('/api/auth/logins/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logins.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to export CSV.');
    }
    setExporting(false);
  };

  // ── Reset password ───────────────────────────────────────────────────────
  const [users,        setUsers]        = useState([]);
  const [targetEmail,  setTargetEmail]  = useState('');
  const [newPassword,  setNewPassword]  = useState('');
  const [resetting,    setResetting]    = useState(false);
  const [resetMessage, setResetMessage] = useState(null); // { type: 'ok'|'error', text }

  useEffect(() => {
    axios.get('/api/auth/admin/users')
      .then(res => {
        setUsers(res.data || []);
        if (res.data?.length) setTargetEmail(res.data[0].email);
      })
      .catch(() => {});
  }, []);

  const jumpToReset = email => {
    setTargetEmail(email);
    setResetMessage(null);
    setTab('reset');
  };

  const submitReset = async e => {
    e.preventDefault();
    if (!targetEmail || newPassword.length < 8 || resetting) return;
    setResetting(true);
    setResetMessage(null);
    try {
      await axios.post('/api/auth/admin/reset-password', { email: targetEmail, newPassword });
      setResetMessage({ type: 'ok', text: `Password reset for ${targetEmail}. They've been signed out everywhere.` });
      setNewPassword('');
    } catch (err) {
      setResetMessage({ type: 'error', text: err.response?.data?.error || err.message || 'Failed to reset password.' });
    }
    setResetting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-900">Admin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none px-1">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-gray-200 flex-shrink-0">
          {[
            { id: 'history',  label: 'Login History' },
            { id: 'requests', label: `Reset Requests${requests.length ? ` (${requests.length})` : ''}` },
            { id: 'reset',    label: 'Reset Password' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
              {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* ── Login History tab ── */}
        {tab === 'history' && (
          <>
            <div className="px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
              <p className="text-xs text-gray-400">{rows.length} total login{rows.length === 1 ? '' : 's'}</p>
              <button
                onClick={downloadCsv}
                disabled={exporting}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exporting…' : '⬇ Download CSV'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
              ) : error ? (
                <p className="text-sm text-red-500 text-center py-8">{error}</p>
              ) : rows.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No logins recorded yet.</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="px-4 py-2 font-semibold">Email</th>
                      <th className="px-4 py-2 font-semibold">Time</th>
                      <th className="px-4 py-2 font-semibold">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-gray-800">{r.email}</td>
                        <td className="px-4 py-2 text-gray-500">{formatTime(r.timestamp)}</td>
                        <td className="px-4 py-2 text-gray-400">{r.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── Reset Requests tab ── */}
        {tab === 'requests' && (
          <div className="flex-1 overflow-y-auto">
            {requestsLoading ? (
              <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
            ) : requestsError ? (
              <p className="text-sm text-red-500 text-center py-8">{requestsError}</p>
            ) : requests.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No password reset requests.</p>
            ) : (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Requested</th>
                    <th className="px-4 py-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-gray-800">{r.email}</td>
                      <td className="px-4 py-2 text-gray-500">{formatTime(r.timestamp)}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => jumpToReset(r.email)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Reset →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Reset Password tab ── */}
        {tab === 'reset' && (
          <form onSubmit={submitReset} className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-xs text-gray-500">
              Set a new password for any registered user — they'll need it next time they sign in,
              and any devices they're currently signed in on will be signed out.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">User</label>
              {users.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No registered users found.</p>
              ) : (
                <select
                  value={targetEmail}
                  onChange={e => setTargetEmail(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {users.map(u => (
                    <option key={u.email} value={u.email}>{u.email}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {resetMessage && (
              <p className={`text-xs ${resetMessage.type === 'ok' ? 'text-emerald-600' : 'text-red-500'}`}>
                {resetMessage.text}
              </p>
            )}

            <button
              type="submit"
              disabled={!targetEmail || newPassword.length < 8 || resetting}
              className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {resetting ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
