import { useState } from 'react';

export default function TokenInput({ token, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        3 · Bearer Token
      </p>
      <div className="flex gap-2">
        <div className={`flex-1 flex items-center border rounded-lg overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
          token ? 'border-gray-300' : 'border-orange-300 bg-orange-50'
        }`}>
          <span className="px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-xs font-mono text-gray-500 whitespace-nowrap select-none">
            Bearer
          </span>
          <input
            type={show ? 'text' : 'password'}
            value={token}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste your access token here"
            className="flex-1 px-3 py-2.5 text-sm font-mono text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors whitespace-nowrap"
        >
          {show ? '🙈 Hide' : '👁 Show'}
        </button>
      </div>
      {!token && (
        <p className="mt-1.5 text-xs text-orange-500">Token required to send a request.</p>
      )}
    </div>
  );
}
