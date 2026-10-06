import { useState } from 'react';

// ── Search helpers ──────────────────────────────────────────────────────────

function valueText(value) {
  if (value === null) return 'null';
  if (typeof value === 'object') return '';
  return String(value);
}

// Does this subtree (key or any descendant key/value) contain the query?
function subtreeMatches(key, value, q) {
  if (key != null && String(key).toLowerCase().includes(q)) return true;
  if (value !== null && typeof value === 'object') {
    const entries = Array.isArray(value) ? value.entries() : Object.entries(value);
    for (const [k, v] of entries) {
      if (subtreeMatches(k, v, q)) return true;
    }
    return false;
  }
  return valueText(value).toLowerCase().includes(q);
}

function Highlight({ text, query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-gray-900 rounded-sm">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function ValueNode({ value, query }) {
  if (value === null) return <span className="text-purple-500">null</span>;
  if (typeof value === 'boolean') return <span className="text-purple-600 font-medium">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-blue-600"><Highlight text={String(value)} query={query} /></span>;
  return <span className="text-emerald-700">"<Highlight text={value} query={query} />"</span>;
}

// ── Node ──────────────────────────────────────────────────────────────────

function Node({ k, value, depth, query }) {
  const isContainer = value !== null && typeof value === 'object';
  const [manualOpen, setManualOpen] = useState(depth < 1);

  if (!isContainer) {
    return (
      <div className="py-0.5 hover:bg-gray-50 rounded px-1 -mx-1">
        {k != null && <span className="text-gray-500">"<Highlight text={String(k)} query={query} />": </span>}
        <ValueNode value={value} query={query} />
      </div>
    );
  }

  const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value);
  const visibleEntries = query
    ? entries.filter(([ck, cv]) => subtreeMatches(ck, cv, query))
    : entries;

  if (query && visibleEntries.length === 0) return null;

  const open = query ? true : manualOpen;
  const typeLabel = Array.isArray(value)
    ? `Array(${entries.length})`
    : `Object(${entries.length})`;

  return (
    <div>
      <button
        type="button"
        onClick={() => !query && setManualOpen(o => !o)}
        className="flex items-center gap-1 text-left w-full hover:bg-gray-50 rounded px-1 -mx-1 py-0.5"
      >
        <span className="text-gray-400 w-3 inline-block text-[10px]">{open ? '▾' : '▸'}</span>
        {k != null && <span className="text-gray-500">"<Highlight text={String(k)} query={query} />": </span>}
        <span className="text-gray-400 text-[11px]">{typeLabel}</span>
      </button>
      {open && (
        <div className="border-l border-gray-100 ml-1.5 pl-3">
          {visibleEntries.map(([ck, cv]) => (
            <Node key={ck} k={ck} value={cv} depth={depth + 1} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function JsonTree({ data }) {
  const [query, setQuery] = useState('');

  const noMatches = query && !subtreeMatches(null, data, query.toLowerCase());

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search in response…"
        className="w-full mb-2 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400"
      />
      <div className="font-mono text-xs text-gray-800 bg-gray-50 rounded-lg p-3 overflow-auto max-h-[480px]">
        {noMatches ? (
          <p className="text-gray-400 text-center py-4">No matches for "{query}"</p>
        ) : (
          <Node k={null} value={data} depth={0} query={query ? query.toLowerCase() : ''} />
        )}
      </div>
    </div>
  );
}
