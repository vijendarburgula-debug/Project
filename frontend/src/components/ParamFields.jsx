const TYPE_BADGE = {
  path:  { label: 'PATH',  className: 'bg-orange-100 text-orange-700' },
  query: { label: 'QUERY', className: 'bg-emerald-100 text-emerald-700' },
  body:  { label: 'BODY',  className: 'bg-purple-100 text-purple-700' },
};

export default function ParamFields({ params, values, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        4 · Parameters
      </p>
      <div className="space-y-4">
        {params.map(param => {
          const badge = TYPE_BADGE[param.type];
          return (
            <div key={param.key} className="flex items-start gap-3">
              {/* Label column */}
              <div className="flex items-center gap-2 w-52 flex-shrink-0 pt-2.5">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
                  {badge.label}
                </span>
                <span className="text-sm font-mono text-gray-800 truncate">
                  {param.key.split('.').pop()}
                  {param.required && <span className="text-red-500 ml-0.5">*</span>}
                </span>
              </div>

              {/* Input column */}
              <div className="flex-1">
                <input
                  type="text"
                  value={values[param.key] || ''}
                  onChange={e => handleChange(param.key, e.target.value)}
                  placeholder={param.hint}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  spellCheck={false}
                />
                <p className="mt-1 text-xs text-gray-400">{param.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
