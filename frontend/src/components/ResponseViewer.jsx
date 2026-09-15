import { useState } from 'react';
import { downloadCsv } from '../utils/jsonToCsv';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  error:   'bg-red-100 text-red-700 border-red-200',
  warn:    'bg-amber-100 text-amber-700 border-amber-200',
};
const STATUS_TEXT = {
  200: 'OK', 201: 'Created', 204: 'No Content',
  400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
  404: 'Not Found', 429: 'Too Many Requests',
  500: 'Internal Server Error', 503: 'Service Unavailable',
};

function statusStyle(code) {
  if (code >= 200 && code < 300) return STATUS_STYLE.success;
  if (code >= 400) return STATUS_STYLE.error;
  return STATUS_STYLE.warn;
}

// Detect the primary array in the response body (handles Graph's "value", Drive's "files", etc.)
function findArray(data) {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') return data;
  if (!data || typeof data !== 'object') return null;
  const keys = ['value', 'files', 'entries', 'items', 'users', 'members',
                 'groups', 'matches', 'permissions', 'data', 'resources',
                 'accounts', 'list', 'results', 'contacts', 'folders',
                 'drives', 'sites', 'lists'];
  for (const key of keys) {
    if (Array.isArray(data[key]) && data[key].length > 0 && typeof data[key][0] === 'object') {
      return data[key];
    }
  }
  return null;
}

// Extract display name, ID, and secondary field from any item object
function extractFields(item) {
  const nameCandidates = [
    'displayName','name','title','primaryEmail','email',
    'userPrincipalName','login','userName','path','fileName','label',
  ];
  const idCandidates = [
    'id','fileId','userId','groupId','teamMemberId','memberId',
    'account_id','uid','objectId',
  ];
  const emailCandidates = [
    'mail','userPrincipalName','email','primaryEmail','login',
    'emails.value','proxyAddresses',
  ];

  let displayName = null;
  for (const k of nameCandidates) {
    if (item[k] && typeof item[k] === 'string') { displayName = item[k]; break; }
  }
  if (!displayName) {
    // try nested name objects e.g. { name: { formatted: "..." } }
    if (item.name && typeof item.name === 'object') {
      displayName = item.name.formatted || item.name.givenName || null;
    }
  }

  let id = null;
  for (const k of idCandidates) {
    if (item[k] && typeof item[k] === 'string') { id = item[k]; break; }
  }

  let email = null;
  for (const k of emailCandidates) {
    const v = item[k];
    if (typeof v === 'string' && v.includes('@')) { email = v; break; }
  }

  return { displayName: displayName || id || '(no name)', id, email };
}

// ── Copy toast state shared across all rows ────────────────────────────────────
function useCopyToast() {
  const [toast, setToast] = useState('');
  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast(label);
      setTimeout(() => setToast(''), 1800);
    });
  };
  return { toast, copy };
}

// ── Quick Pick Table ───────────────────────────────────────────────────────────
function QuickPick({ items }) {
  const { toast, copy } = useCopyToast();
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? items.filter(item => {
        const { displayName, id, email } = extractFields(item);
        const q = filter.toLowerCase();
        return (displayName || '').toLowerCase().includes(q)
            || (id || '').toLowerCase().includes(q)
            || (email || '').toLowerCase().includes(q);
      })
    : items;

  return (
    <div className="mb-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-emerald-400 text-xs font-mono px-3 py-2 rounded-lg shadow-lg border border-gray-700 animate-pulse">
          ✓ Copied: {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-600">
          Quick Pick — {items.length} items
          <span className="ml-1 font-normal text-gray-400">(click any field to copy)</span>
        </p>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter..."
          className="text-xs border border-gray-200 rounded px-2 py-1 w-40 focus:outline-none focus:border-blue-400"
        />
      </div>

      <div className="overflow-auto max-h-64 rounded-lg border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="text-left px-3 py-2 text-gray-500 font-semibold">#</th>
              <th className="text-left px-3 py-2 text-gray-500 font-semibold">Name / Path</th>
              <th className="text-left px-3 py-2 text-gray-500 font-semibold">ID</th>
              <th className="text-left px-3 py-2 text-gray-500 font-semibold">Email / UPN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item, idx) => {
              const { displayName, id, email } = extractFields(item);
              return (
                <tr key={idx} className="hover:bg-blue-50 transition-colors">
                  <td className="px-3 py-2 text-gray-400">{idx + 1}</td>

                  {/* Name */}
                  <td className="px-3 py-2 max-w-[200px]">
                    <button
                      onClick={() => copy(displayName, displayName)}
                      className="text-gray-800 font-medium truncate block w-full text-left hover:text-blue-600 hover:underline"
                      title={`Copy: ${displayName}`}
                    >
                      {displayName}
                    </button>
                  </td>

                  {/* ID */}
                  <td className="px-3 py-2 max-w-[220px]">
                    {id ? (
                      <button
                        onClick={() => copy(id, `ID: ${id.slice(0, 16)}…`)}
                        className="font-mono text-blue-600 hover:text-blue-800 hover:underline truncate block w-full text-left"
                        title={`Copy ID: ${id}`}
                      >
                        {id.length > 32 ? id.slice(0, 30) + '…' : id}
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Email / UPN */}
                  <td className="px-3 py-2 max-w-[200px]">
                    {email ? (
                      <button
                        onClick={() => copy(email, email)}
                        className="text-purple-600 hover:text-purple-800 hover:underline truncate block w-full text-left font-mono"
                        title={`Copy: ${email}`}
                      >
                        {email}
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-xs py-4">No items match "{filter}"</p>
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-400">
        Click any cell to copy its value to clipboard, then paste it into a param field above.
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResponseViewer({ response }) {
  const { status, body, error } = response;
  const [view, setView] = useState('table');  // 'table' | 'json'

  const isSuccess = status >= 200 && status < 300;
  const bodyStr   = body != null ? JSON.stringify(body, null, 2) : (error || 'No response body');
  const canDownload = body != null;
  const arrayItems  = body ? findArray(body) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            6 · Response
          </p>
          {status > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${statusStyle(status)}`}>
              {status} {STATUS_TEXT[status] || ''}
            </span>
          )}
          {arrayItems && (
            <span className="text-xs text-gray-400">
              {arrayItems.length} item{arrayItems.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle — only shown when array is detected */}
          {arrayItems && (
            <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
              <button
                onClick={() => setView('table')}
                className={`px-3 py-1.5 font-medium transition-colors ${view === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Table
              </button>
              <button
                onClick={() => setView('json')}
                className={`px-3 py-1.5 font-medium transition-colors border-l border-gray-300 ${view === 'json' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                JSON
              </button>
            </div>
          )}

          {/* Download CSV */}
          <button
            onClick={() => canDownload && downloadCsv(body, `response-${status}.csv`)}
            disabled={!canDownload}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
              canDownload
                ? 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 cursor-pointer'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="p-4">
        {/* Quick Pick table — shown when array detected AND table view selected */}
        {arrayItems && view === 'table' && (
          <QuickPick items={arrayItems} />
        )}

        {/* Raw JSON — always shown when no array, or when JSON view selected */}
        {(!arrayItems || view === 'json') && (
          <pre className="text-xs font-mono text-gray-800 bg-gray-50 rounded-lg p-4 overflow-auto max-h-[480px] whitespace-pre-wrap break-all leading-relaxed">
            {bodyStr}
          </pre>
        )}

        {/* When table view is active, also show raw JSON collapsed below */}
        {arrayItems && view === 'table' && (
          <details className="mt-3">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
              Show raw JSON
            </summary>
            <pre className="mt-2 text-xs font-mono text-gray-700 bg-gray-50 rounded-lg p-3 overflow-auto max-h-64 whitespace-pre-wrap break-all leading-relaxed">
              {bodyStr}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
