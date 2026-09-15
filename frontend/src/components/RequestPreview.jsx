const METHOD_BADGE = {
  GET:    'bg-emerald-500 text-white',
  POST:   'bg-blue-500 text-white',
  PATCH:  'bg-amber-500 text-white',
  PUT:    'bg-orange-500 text-white',
  DELETE: 'bg-red-500 text-white',
};

function maskToken(value) {
  const raw = value.replace('Bearer ', '');
  if (!raw || raw === '<your-token>') return '<your-token>';
  return raw.slice(0, 6) + '•'.repeat(10) + raw.slice(-4);
}

export default function RequestPreview({ url, method, headers, manualUrl, onUrlChange }) {
  const displayUrl = manualUrl !== undefined && manualUrl !== '' ? manualUrl : url;
  const isEdited   = manualUrl !== undefined && manualUrl !== '';

  return (
    <div className="bg-gray-950 rounded-xl border border-gray-700 p-4 shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          5 · Request Preview &amp; Edit
        </p>
        <div className="flex items-center gap-2">
          {isEdited && (
            <span className="text-xs text-amber-400 font-medium">✎ Manually edited</span>
          )}
          {isEdited && (
            <button
              onClick={() => onUrlChange('')}
              className="text-xs text-gray-400 hover:text-white transition-colors border border-gray-600 rounded px-2 py-0.5"
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      {/* Editable URL bar — click to edit directly like Postman */}
      <div className="flex items-start gap-2 mb-4">
        <span className={`text-xs font-bold px-2 py-1.5 rounded flex-shrink-0 ${METHOD_BADGE[method] || 'bg-gray-600 text-white'}`}>
          {method}
        </span>
        <textarea
          value={displayUrl}
          onChange={e => onUrlChange(e.target.value)}
          rows={displayUrl.length > 80 ? 3 : 1}
          spellCheck={false}
          placeholder="URL will appear here — click to edit"
          className="flex-1 bg-gray-800 text-gray-100 text-sm font-mono px-3 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
        />
      </div>

      {/* Headers (read-only display, masked) */}
      <div className="border-t border-gray-800 pt-2 space-y-1.5">
        <p className="text-xs text-gray-600 mb-1">Headers</p>
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="flex gap-2 text-xs font-mono flex-wrap">
            <span className="text-gray-500 flex-shrink-0">{key}:</span>
            <span className="text-amber-300 break-all">
              {key.toLowerCase() === 'authorization'
                ? `Bearer ${maskToken(value)}`
                : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
