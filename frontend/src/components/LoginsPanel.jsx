import { useEffect, useState } from 'react';
import axios from 'axios';

function formatTime(iso) {
  try { return new Date(iso).toLocaleString(); }
  catch { return iso; }
}

export default function LoginsPanel({ requesterEmail, onClose }) {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    axios.get('/api/auth/logins', { params: { requesterEmail } })
      .then(res => setRows(res.data || []))
      .catch(err => setError(err.response?.data?.error || err.message || 'Failed to load logins.'))
      .finally(() => setLoading(false));
  }, [requesterEmail]);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Login History</h2>
            <p className="text-xs text-gray-400 mt-0.5">{rows.length} total login{rows.length === 1 ? '' : 's'}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/auth/logins/export?requesterEmail=${encodeURIComponent(requesterEmail)}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors"
            >
              ⬇ Download CSV
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-lg leading-none px-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
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
      </div>
    </div>
  );
}
