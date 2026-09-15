import { useState } from 'react';

const METHOD_BADGE = {
  GET:    'bg-emerald-500 text-white',
  POST:   'bg-blue-500 text-white',
  PATCH:  'bg-amber-500 text-white',
  PUT:    'bg-orange-500 text-white',
  DELETE: 'bg-red-500 text-white',
};

function statusColor(code) {
  if (!code) return 'text-gray-400 bg-gray-100';
  if (code >= 200 && code < 300) return 'text-emerald-700 bg-emerald-100';
  if (code >= 400) return 'text-red-700 bg-red-100';
  return 'text-amber-700 bg-amber-100';
}

function relativeTime(ts) {
  const d = Date.now() - ts;
  if (d < 60_000)     return 'just now';
  if (d < 3_600_000)  return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function shortUrl(url) {
  try {
    const u = new URL(url);
    const path = u.hostname + u.pathname;
    return path.length > 44 ? '…' + path.slice(-(43)) : path;
  } catch {
    return url.length > 44 ? url.slice(0, 43) + '…' : url;
  }
}

// ── Single history row ────────────────────────────────────────────────────────
function HistoryRow({ item, onSelect, onDelete, isActive }) {
  return (
    <div
      onClick={onSelect}
      className={`group border-b border-gray-100 cursor-pointer transition-colors px-3 py-2.5 ${
        isActive ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-gray-50'
      }`}
    >
      {/* Row 1: method + status + time + delete */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${METHOD_BADGE[item.method] || 'bg-gray-400 text-white'}`}>
            {item.method}
          </span>
          {item.status > 0 && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${statusColor(item.status)}`}>
              {item.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">{relativeTime(item.timestamp)}</span>
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs w-4 text-center"
            title="Remove from history"
          >✕</button>
        </div>
      </div>

      {/* Row 2: operation name */}
      <p className="text-xs font-semibold text-gray-800 truncate leading-tight">
        {item.operationName}
      </p>

      {/* Row 3: service */}
      <p className="text-xs text-gray-400 truncate">{item.serviceName}</p>

      {/* Row 4: URL */}
      <p className="text-xs font-mono text-gray-500 truncate mt-0.5" title={item.url}>
        {shortUrl(item.url)}
      </p>
    </div>
  );
}

// ── Sidebar (collapsed = just a thin rail) ────────────────────────────────────
export default function HistorySidebar({
  history, activeId, onSelect, onDelete, onClear, collapsed, onToggle,
}) {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? history.filter(h =>
        (h.operationName + h.serviceName + h.url + h.method)
          .toLowerCase().includes(filter.toLowerCase())
      )
    : history;

  /* ── Collapsed rail ── */
  if (collapsed) {
    return (
      <aside className="w-10 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-3 flex-shrink-0">
        <button
          onClick={onToggle}
          title="Expand history"
          className="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </button>
        <span
          className="text-xs text-gray-300 select-none"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          History ({history.length})
        </span>
      </aside>
    );
  }

  /* ── Full sidebar ── */
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </button>
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            History
          </span>
          <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 font-medium">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      {history.length > 3 && (
        <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter history…"
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
          />
        </div>
      )}

      {/* History list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <div className="text-2xl mb-2">📭</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {history.length === 0
                ? 'No history yet.\nSend a request to start tracking.'
                : `No matches for "${filter}"`}
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <HistoryRow
              key={item.id}
              item={item}
              isActive={item.id === activeId}
              onSelect={() => onSelect(item)}
              onDelete={() => onDelete(item.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
