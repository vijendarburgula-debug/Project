import { useState, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { buildNestedBody, findResponseArray } from '../utils/buildBody';

const PROXY_URL = '/api/proxy/execute';

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusColor(code) {
  if (code >= 200 && code < 300) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (code > 0)                  return 'text-red-600 bg-red-50 border-red-200';
  return 'text-gray-500 bg-gray-50 border-gray-200';
}

function statusIcon(code) {
  if (code >= 200 && code < 300) return '✅';
  if (code > 0)                  return '❌';
  return '⚠️';
}

function smartPreview(body) {
  if (!body || typeof body !== 'object') return '';
  const priorityFields = ['displayName','name','mail','userPrincipalName',
                           'login','email','primaryEmail','status','path','title'];
  for (const f of priorityFields) {
    if (body[f] && typeof body[f] === 'string') return body[f].slice(0, 60);
  }
  const str = JSON.stringify(body);
  return str.length > 60 ? str.slice(0, 58) + '…' : str;
}

function downloadCsv(results, operationName) {
  const cols = ['#', 'value', 'status', 'success', 'preview'];
  const rows = results.map((r, i) => [
    i + 1,
    r.value,
    r.status,
    r.status >= 200 && r.status < 300 ? 'Yes' : 'No',
    r.body ? smartPreview(r.body) : (r.error || ''),
  ]);
  const escape = v => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csv = [cols.join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `batch-${operationName.replace(/\s+/g, '-')}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BatchRunner({
  operation,      // current API operation object
  paramValues,    // current non-batch param values
  token,          // bearer token
  manualUrl,      // user-edited URL override (if any)
  lastResponse,   // last response from main panel (for "extract" feature)
}) {
  const [batchParam,    setBatchParam]    = useState('');
  const [values,        setValues]        = useState('');
  const [extractField,  setExtractField]  = useState('');
  const [delayMs,       setDelayMs]       = useState(300);
  const [running,       setRunning]       = useState(false);
  const [results,       setResults]       = useState([]);
  const [current,       setCurrent]       = useState(0);
  const abortRef = useRef(false);

  const params = operation?.params || [];

  // Values split into lines
  const lines = useMemo(
    () => values.split('\n').map(l => l.trim()).filter(Boolean),
    [values]
  );
  const total  = lines.length;
  const pct    = total > 0 ? Math.round((current / total) * 100) : 0;

  // Extract array from the last response for "Use Last Response" feature
  const responseArray = useMemo(() => {
    if (!lastResponse?.body) return null;
    return findResponseArray(lastResponse.body);
  }, [lastResponse]);

  // String fields available in the first response array item
  const extractableFields = useMemo(() => {
    if (!responseArray?.length) return [];
    const first = responseArray[0];
    return Object.entries(first)
      .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
      .map(([k]) => k);
  }, [responseArray]);

  // When a response is loaded, pre-select a sensible default extract field
  useMemo(() => {
    if (!extractableFields.length) return;
    const preferred = ['userPrincipalName','mail','email','login','primaryEmail','id','name','path'];
    const found = preferred.find(p => extractableFields.includes(p));
    setExtractField(found || extractableFields[0]);
  }, [extractableFields.join(',')]); // eslint-disable-line

  // Pull values from last response array
  const handleExtract = () => {
    if (!responseArray || !extractField) return;
    const extracted = responseArray
      .map(item => String(item[extractField] ?? ''))
      .filter(Boolean)
      .join('\n');
    setValues(extracted);
  };

  // ── Run batch ──────────────────────────────────────────────────────────────

  const run = useCallback(async () => {
    if (!lines.length)    { alert('Add at least one value to run.');    return; }
    if (!batchParam)      { alert('Select the param to loop over.');    return; }
    if (!token.trim())    { alert('No Bearer token — fill it in first.'); return; }

    abortRef.current = false;
    setRunning(true);
    setResults([]);
    setCurrent(0);

    for (let i = 0; i < lines.length; i++) {
      if (abortRef.current) break;

      const v      = lines[i];
      const merged = { ...paramValues, [batchParam]: v };

      // Build URL
      let url = manualUrl.trim() || operation.baseUrl;
      if (!manualUrl.trim()) {
        params.filter(p => p.type === 'path').forEach(p => {
          url = url.replace(`{${p.key}}`, encodeURIComponent(merged[p.key] || ''));
        });
      }

      // Query params
      const qp = {};
      params.filter(p => p.type === 'query' && merged[p.key]).forEach(p => {
        qp[p.key] = merged[p.key];
      });

      const body    = buildNestedBody(params, merged);
      const headers = { Authorization: `Bearer ${token}` };
      if (['POST', 'PATCH', 'PUT'].includes(operation.method)) {
        headers['Content-Type'] = 'application/json';
      }

      let result;
      try {
        const res = await axios.post(PROXY_URL, {
          url, method: operation.method, headers, queryParams: qp, body,
        });
        result = { value: v, status: res.data.status, body: res.data.body, error: null };
      } catch (err) {
        result = {
          value:  v,
          status: err.response?.status || 0,
          body:   err.response?.data || null,
          error:  err.message,
        };
      }

      setResults(prev => [...prev, result]);
      setCurrent(i + 1);

      if (i < lines.length - 1 && !abortRef.current && delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    setRunning(false);
  }, [lines, batchParam, token, paramValues, manualUrl, operation, params, delayMs]);

  const stop = () => { abortRef.current = true; };

  // Stats
  const succeeded = results.filter(r => r.status >= 200 && r.status < 300).length;
  const failed    = results.length - succeeded;

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 bg-indigo-600 text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <div>
            <h2 className="text-sm font-bold leading-none">Batch Runner</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Run one API call per line, automatically</p>
          </div>
        </div>
      </div>

      {/* Scrollable config + results */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Config panel ── */}
        <div className="p-4 space-y-4 border-b border-gray-100">

          {/* Step 1: pick which param to loop */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              1 · Loop over which param?
            </label>
            {params.length === 0 ? (
              <p className="text-xs text-gray-400 italic">
                This operation has no params. Switch to one that has path/query params.
              </p>
            ) : (
              <select
                value={batchParam}
                onChange={e => setBatchParam(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="">— select a param —</option>
                {params.map(p => (
                  <option key={p.key} value={p.key}>
                    [{p.type.toUpperCase()}] {p.key}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2: paste values */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-600">
                2 · Values <span className="font-normal text-gray-400">(one per line)</span>
              </label>
              {total > 0 && (
                <span className="text-xs text-indigo-600 font-medium">{total} items</span>
              )}
            </div>
            <textarea
              value={values}
              onChange={e => setValues(e.target.value)}
              rows={7}
              placeholder={`Paste values here, one per line:\n\nuser1@example.com\nuser2@example.com\nuser3@example.com\n…`}
              spellCheck={false}
              className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-2 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-300"
            />
          </div>

          {/* "Use last response" extractor */}
          {responseArray && (
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 mb-2">
                📋 Extract from last response
                <span className="font-normal text-indigo-500 ml-1">({responseArray.length} items)</span>
              </p>
              <div className="flex gap-2">
                <select
                  value={extractField}
                  onChange={e => setExtractField(e.target.value)}
                  className="flex-1 text-xs border border-indigo-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  {extractableFields.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <button
                  onClick={handleExtract}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
                >
                  Use →
                </button>
              </div>
              <p className="text-xs text-indigo-400 mt-1">
                Pulls {extractField || '…'} from each item into the Values box above.
              </p>
            </div>
          )}

          {/* Step 3: delay */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              3 · Delay between calls
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={delayMs}
                onChange={e => setDelayMs(Math.max(0, Number(e.target.value)))}
                min={0}
                max={10000}
                className="w-24 text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs text-gray-500">ms  (0 = no delay)</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Increase to avoid API rate limits.</p>
          </div>

          {/* Run / Stop buttons */}
          <div className="flex gap-2 pt-1">
            {!running ? (
              <button
                onClick={run}
                disabled={!total || !batchParam}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ▶ Run Batch ({total || 0} calls)
              </button>
            ) : (
              <button
                onClick={stop}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                ■ Stop
              </button>
            )}
          </div>
        </div>

        {/* ── Progress ── */}
        {(running || results.length > 0) && (
          <div className="px-4 pt-4 pb-2 border-b border-gray-100 space-y-2 flex-shrink-0">

            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">
                {running ? `Running… ${current} / ${total}` : `Done — ${current} / ${total}`}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-200 ${running ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Stats row */}
            {results.length > 0 && (
              <div className="flex gap-3 text-xs pt-1">
                <span className="text-emerald-600 font-semibold">✅ {succeeded} ok</span>
                <span className="text-red-600 font-semibold">❌ {failed} failed</span>
                <span className="text-gray-400">{results.length} done</span>
              </div>
            )}

            {/* Download CSV */}
            {!running && results.length > 0 && (
              <button
                onClick={() => downloadCsv(results, operation?.name || 'batch')}
                className="w-full text-xs flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                Download Results CSV
              </button>
            )}
          </div>
        )}

        {/* ── Results list ── */}
        {results.length > 0 && (
          <div className="divide-y divide-gray-100">
            {results.map((r, idx) => (
              <div key={idx} className="px-3 py-2.5 hover:bg-gray-50 transition-colors">
                {/* Top: index + icon + status */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 w-5 text-right">{idx + 1}</span>
                    <span className="text-xs">{statusIcon(r.status)}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${statusColor(r.status)}`}>
                      {r.status || 'err'}
                    </span>
                  </div>
                </div>

                {/* Value used */}
                <p className="text-xs font-mono text-gray-700 truncate pl-7" title={r.value}>
                  {r.value}
                </p>

                {/* Smart preview */}
                {(r.body || r.error) && (
                  <p className="text-xs text-gray-400 truncate pl-7 mt-0.5">
                    {r.body ? smartPreview(r.body) : r.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="h-8" />
      </div>
    </aside>
  );
}
