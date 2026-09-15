const METHOD_COLORS = {
  GET:  'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
};

export default function OperationSelector({ operations, operationId, onChange }) {
  const selected = operations.find(op => op.id === operationId);
  const hasGroups = operations.some(op => op.group);

  if (operations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          2 · Select Operation
        </p>
        <p className="text-sm text-gray-400 text-center py-2">
          No GET operations available for this service.
        </p>
      </div>
    );
  }

  // Build ordered group list preserving first-appearance order
  const groups = hasGroups
    ? [...new Map(operations.map(op => [op.group || 'Other', true])).keys()]
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        2 · Select Operation
      </p>

      <select
        value={operationId}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {hasGroups
          ? groups.map(group => (
              <optgroup key={group} label={`── ${group} ──`}>
                {operations
                  .filter(op => (op.group || 'Other') === group)
                  .map(op => (
                    <option key={op.id} value={op.id}>
                      [{op.method}]  {op.name}
                    </option>
                  ))}
              </optgroup>
            ))
          : operations.map(op => (
              <option key={op.id} value={op.id}>
                [{op.method}]  {op.name}
              </option>
            ))
        }
      </select>

      {selected && (
        <div className="mt-2.5 flex items-start gap-2">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${METHOD_COLORS[selected.method] || 'bg-gray-100 text-gray-600'}`}>
            {selected.method}
          </span>
          <p className="text-xs text-gray-500 leading-relaxed">{selected.description}</p>
        </div>
      )}
    </div>
  );
}
