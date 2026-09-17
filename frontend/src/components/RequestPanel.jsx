import { useState } from 'react';
import { buildNestedBody } from '../utils/buildBody';

// ── Method colours (Postman-style) ──────────────────────────────────────────
const METHOD_TEXT = {
  GET:    'text-emerald-600',
  POST:   'text-amber-600',
  PATCH:  'text-violet-600',
  PUT:    'text-blue-600',
  DELETE: 'text-red-600',
};

const TYPE_BADGE = {
  path:  { label: 'PATH',  className: 'bg-orange-100 text-orange-700' },
  query: { label: 'QUERY', className: 'bg-emerald-100 text-emerald-700' },
  body:  { label: 'BODY',  className: 'bg-purple-100 text-purple-700' },
};

function maskToken(value) {
  const raw = String(value || '').replace('Bearer ', '');
  if (!raw || raw === '<your-token>') return '<your-token>';
  if (raw.length <= 12) return raw;
  return raw.slice(0, 12) + '…';
}

export default function RequestPanel({
  operation,
  previewUrl,
  manualUrl,
  onUrlChange,
  paramValues,
  onParamsChange,
  token,
  onTokenChange,
  customHeaders = [],
  onCustomHeadersChange,
  loading,
  onSend,
}) {
  const [tab, setTab]         = useState('params');
  const [showTok, setTok]     = useState(false);

  const pathParams  = operation.params.filter(p => p.type === 'path');
  const queryParams = operation.params.filter(p => p.type === 'query');
  const bodyParams  = operation.params.filter(p => p.type === 'body');
  const paramCount  = pathParams.length + queryParams.length;

  const hasBody     = ['POST', 'PATCH', 'PUT'].includes(operation.method);
  const autoHeaders = {};
  if (hasBody) autoHeaders['Content-Type'] = 'application/json';
  const enabledCustom = customHeaders.filter(h => h.enabled && h.key.trim()).length;
  const headerCount = Object.keys(autoHeaders).length + enabledCustom;

  const displayUrl  = manualUrl !== undefined && manualUrl !== '' ? manualUrl : previewUrl;
  const isEdited    = manualUrl !== undefined && manualUrl !== '';

  const bodyPreview = hasBody ? buildNestedBody(operation.params, paramValues) : null;

  const handleParam = (key, value) => onParamsChange({ ...paramValues, [key]: value });

  const TABS = [
    { id: 'params',  label: 'Params',  count: paramCount },
    { id: 'headers', label: 'Headers', count: headerCount },
    { id: 'body',    label: 'Body',    count: hasBody ? bodyParams.length : null },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Request bar: method · URL · Send (one line) ───────────────────── */}
      <div className="flex items-stretch gap-2 p-3 border-b border-gray-200">
        <div className="flex items-center px-3 rounded-lg border border-gray-300 bg-gray-50">
          <span className={`text-sm font-bold ${METHOD_TEXT[operation.method] || 'text-gray-600'}`}>
            {operation.method}
          </span>
        </div>

        <input
          type="text"
          value={displayUrl}
          onChange={e => onUrlChange(e.target.value)}
          spellCheck={false}
          placeholder="URL will appear here — click to edit"
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={onSend}
          disabled={loading}
          className="flex items-center gap-2 px-6 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : 'Send'}
        </button>
      </div>

      {/* ── Bearer token bar (always visible) ─────────────────────────────── */}
      <div className="border-b border-gray-200 bg-gray-50/40">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">🔑 Bearer Token</span>
          <div className={`flex-1 flex items-center border rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
            token ? 'border-gray-300' : 'border-orange-300 bg-orange-50'
          }`}>
            <input
              type={showTok ? 'text' : 'password'}
              value={token}
              onChange={e => onTokenChange(e.target.value)}
              placeholder="Paste your access token here"
              className="flex-1 min-w-0 px-3 py-2 text-sm font-mono text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setTok(v => !v)}
              className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 border-l border-gray-200 whitespace-nowrap"
            >
              {showTok ? '🙈 Hide' : '👁 Show'}
            </button>
          </div>
          {tokenHelp && (
            <button
              type="button"
              onClick={() => setHelp(v => !v)}
              className={`px-2.5 py-2 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors ${
                showHelp
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-blue-600 border-blue-300 hover:bg-blue-50'
              }`}
            >
              ❓ Need a token?
            </button>
          )}
        </div>

        {showHelp && tokenHelp && (
          <div className="px-3 pb-3 -mt-0.5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Scopes needed</p>
                <div className="flex flex-wrap gap-1">
                  {tokenHelp.scopes.map(s => (
                    <span key={s} className="text-[11px] font-mono bg-white border border-blue-200 text-blue-700 rounded px-1.5 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600">{tokenHelp.note}</p>
              <a
                href={tokenHelp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
              >
                Get one at {tokenHelp.linkLabel} ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Tabs row ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-3 border-b border-gray-200 bg-gray-50/60">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-1 text-xs text-emerald-600 font-semibold">({t.count})</span>
            )}
            {tab === t.id && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <div className="p-4">

        {/* ── Params tab ── */}
        {tab === 'params' && (
          paramCount === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">This operation has no path or query parameters.</p>
          ) : (
            <div className="space-y-5">
              {pathParams.length > 0 && (
                <ParamTable
                  title="Path Variables"
                  params={pathParams}
                  values={paramValues}
                  onChange={handleParam}
                />
              )}
              {queryParams.length > 0 && (
                <ParamTable
                  title="Query Params"
                  params={queryParams}
                  values={paramValues}
                  onChange={handleParam}
                />
              )}
            </div>
          )
        )}

        {/* ── Headers tab (auto rows + editable custom rows + bulk edit) ── */}
        {tab === 'headers' && (
          <HeadersEditor
            autoHeaders={autoHeaders}
            customHeaders={customHeaders}
            onChange={onCustomHeadersChange}
          />
        )}

        {/* ── Body tab ── */}
        {tab === 'body' && (
          !hasBody ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              This is a {operation.method} request — no request body is sent.
            </p>
          ) : bodyParams.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">This operation takes no body fields.</p>
          ) : (
            <div className="space-y-5">
              <ParamTable
                title="Body Fields"
                params={bodyParams}
                values={paramValues}
                onChange={handleParam}
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Raw JSON Preview</p>
                <pre className="bg-gray-950 text-emerald-300 text-xs font-mono rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(bodyPreview ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          )
        )}
      </div>

      {isEdited && (
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-100 bg-amber-50">
          <span className="text-xs text-amber-600 font-medium">✎ URL manually edited</span>
          <button
            onClick={() => onUrlChange('')}
            className="text-xs text-gray-500 hover:text-gray-800 border border-gray-300 rounded px-2 py-0.5"
          >
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}

// ── Reusable Postman-style param table ──────────────────────────────────────
function ParamTable({ title, params, values, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4 w-56">Key</th>
              <th className="py-2 pr-4">Value</th>
              <th className="py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map(param => {
              const badge = TYPE_BADGE[param.type];
              return (
                <tr key={param.key} className="border-b border-gray-100 align-top">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2 pt-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
                        {badge.label}
                      </span>
                      <span className="font-mono text-gray-800 truncate">
                        {param.key.split('.').pop()}
                        {param.required && <span className="text-red-500 ml-0.5">*</span>}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      value={values[param.key] || ''}
                      onChange={e => onChange(param.key, e.target.value)}
                      placeholder={param.hint}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      spellCheck={false}
                    />
                  </td>
                  <td className="py-2 text-xs text-gray-400 pt-3">{param.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Editable headers table with Bulk Edit toggle (Postman-style) ────────────
function HeadersEditor({ autoHeaders, customHeaders, onChange }) {
  const [bulk, setBulk] = useState(false);

  const rows = customHeaders;

  const updateRow = (idx, patch) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    onChange(next);
  };
  const addRow = () => onChange([...rows, { key: '', value: '', description: '', enabled: true }]);
  const removeRow = idx => onChange(rows.filter((_, i) => i !== idx));

  // Bulk text ↔ rows (one "Key: Value" per line)
  const bulkText = rows.map(r => `${r.enabled ? '' : '// '}${r.key}: ${r.value}`).join('\n');
  const parseBulk = text => {
    const parsed = text.split('\n').map(line => {
      const raw = line.trim();
      if (!raw) return null;
      const disabled = raw.startsWith('//');
      const clean = disabled ? raw.replace(/^\/\/\s*/, '') : raw;
      const idx = clean.indexOf(':');
      if (idx === -1) return { key: clean, value: '', description: '', enabled: !disabled };
      return {
        key: clean.slice(0, idx).trim(),
        value: clean.slice(idx + 1).trim(),
        description: '',
        enabled: !disabled,
      };
    }).filter(Boolean);
    onChange(parsed);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">
          Auto headers are added for you; add your own below.
        </p>
        <button
          onClick={() => setBulk(v => !v)}
          className={`text-xs font-medium px-2.5 py-1 rounded border transition-colors ${
            bulk
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          {bulk ? 'Key-Value Edit' : 'Bulk Edit'}
        </button>
      </div>

      {bulk ? (
        <>
          <textarea
            value={bulkText}
            onChange={e => parseBulk(e.target.value)}
            spellCheck={false}
            rows={Math.max(4, rows.length + 2)}
            placeholder={'Content-Type: application/json\nX-Custom-Header: value\n// disabled-header: value'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            One <span className="font-mono">Key: Value</span> per line. Prefix a line with <span className="font-mono">//</span> to disable it.
          </p>
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-200">
                <th className="w-8 py-2"></th>
                <th className="py-2 pr-4">Key</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2 pr-4">Description</th>
                <th className="w-8 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {/* Auto headers (read-only) */}
              {Object.entries(autoHeaders).map(([key, value]) => (
                <tr key={`auto-${key}`} className="border-b border-gray-100 bg-gray-50/50">
                  <td className="py-2.5 pl-1">
                    <input type="checkbox" checked readOnly className="accent-blue-600" />
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-gray-500">{key}</td>
                  <td className="py-2.5 pr-4 font-mono text-gray-500 break-all">
                    {key.toLowerCase() === 'authorization' ? `Bearer ${maskToken(value)}` : value}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-400 text-xs">
                    {key.toLowerCase() === 'authorization' ? 'Auto — from Authorization tab' : 'Auto'}
                  </td>
                  <td></td>
                </tr>
              ))}

              {/* Editable custom headers */}
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-1.5 pl-1">
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={e => updateRow(idx, { enabled: e.target.checked })}
                      className="accent-blue-600"
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={row.key}
                      onChange={e => updateRow(idx, { key: e.target.value })}
                      placeholder="Key"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      spellCheck={false}
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={row.value}
                      onChange={e => updateRow(idx, { value: e.target.value })}
                      placeholder="Value"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      spellCheck={false}
                    />
                  </td>
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={row.description}
                      onChange={e => updateRow(idx, { description: e.target.value })}
                      placeholder="Description"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      spellCheck={false}
                    />
                  </td>
                  <td className="py-1.5 text-center">
                    <button
                      onClick={() => removeRow(idx)}
                      title="Remove header"
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-lg px-3 py-1.5"
          >
            + Add header
          </button>
        </div>
      )}
    </div>
  );
}
