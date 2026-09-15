const SERVICES = [
  {
    id: 'google-my-drive',
    label: 'Google My Drive',
    sub: 'Drive v2 / v3',
    color: 'blue',
    icon: (
      <svg viewBox="0 0 87.3 78" className="w-4 h-4 flex-shrink-0" fill="none">
        <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H.1c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
        <path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L.1 49.5c0 1.55.4 3.1 1.2 4.5h27.5z" fill="#00ac47"/>
        <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.2 54c.8-1.4 1.2-2.95 1.2-4.5H59.85l5.86 11.5z" fill="#ea4335"/>
        <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
        <path d="M59.85 49.5h27.5c0-1.55-.4-3.1-1.2-4.5L72.7 21.45l-13.7 23.8z" fill="#2684fc"/>
        <path d="M43.65 25L27.5 54H59.8z" fill="#ffba00"/>
      </svg>
    ),
  },
  {
    id: 'google-shared-drive',
    label: 'Google Shared Drive',
    sub: 'Team Drives',
    color: 'teal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none">
        <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="#0F9D58"/>
        <circle cx="9" cy="15" r="1.6" fill="#fff"/>
        <circle cx="14" cy="15" r="1.6" fill="#fff"/>
        <circle cx="18.5" cy="15" r="1.4" fill="#fff" opacity="0.85"/>
      </svg>
    ),
  },
  {
    id: 'gmail',
    label: 'Gmail',
    sub: 'Gmail API v1',
    color: 'rose',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
        <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="#fff" stroke="#EA4335" strokeWidth="0.5"/>
        <path d="M2 6l10 7L22 6" fill="none" stroke="#EA4335" strokeWidth="2"/>
        <path d="M2 6.5V18a2 2 0 002 2h1V8z" fill="#4285F4"/>
        <path d="M22 6.5V18a2 2 0 01-2 2h-1V8z" fill="#34A853"/>
        <path d="M3 6l9 6.5L21 6l1 1.5-10 7.5L2 7.5z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'google-chat',
    label: 'Google Chat',
    sub: 'Chat API v1',
    color: 'green',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
        <path d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H9l-5 4v-4H4a1 1 0 01-1-1V5a1 1 0 011-1z" fill="#00AC47"/>
        <circle cx="8" cy="10.5" r="1.3" fill="#fff"/>
        <circle cx="12" cy="10.5" r="1.3" fill="#fff"/>
        <circle cx="16" cy="10.5" r="1.3" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: 'teams',
    label: 'Microsoft Teams',
    sub: 'Graph API',
    color: 'indigo',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
        <rect x="10" y="9" width="11" height="10" rx="1.5" fill="#5059C9"/>
        <circle cx="16.5" cy="5.5" r="2.3" fill="#5059C9"/>
        <rect x="3" y="10" width="7.5" height="8.5" rx="1.3" fill="#7B83EB"/>
        <circle cx="7" cy="6" r="2.6" fill="#7B83EB"/>
        <rect x="12" y="12" width="6" height="1.4" rx="0.7" fill="#fff"/>
        <rect x="12" y="14.5" width="6" height="1.4" rx="0.7" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: 'slack',
    label: 'Slack',
    sub: 'Web API',
    color: 'fuchsia',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
        <path d="M9.5 2.5a1.5 1.5 0 013 0v4a1.5 1.5 0 01-3 0v-4z" fill="#36C5F0"/>
        <path d="M6 8a1.5 1.5 0 010-3h1.5v3H6z" fill="#36C5F0"/>
        <path d="M15.5 6a1.5 1.5 0 013 0 1.5 1.5 0 01-1.5 1.5h-1.5V6z" fill="#2EB67D"/>
        <path d="M16 9.5a1.5 1.5 0 010 3h-4a1.5 1.5 0 010-3h4z" fill="#2EB67D"/>
        <path d="M18 15.5a1.5 1.5 0 01-3 0v-1.5h1.5A1.5 1.5 0 0118 15.5z" fill="#ECB22E"/>
        <path d="M14.5 18a1.5 1.5 0 010-3v-1.5h1.5V18h-1.5z" fill="#ECB22E"/>
        <path d="M8 16a1.5 1.5 0 01-3 0 1.5 1.5 0 011.5-1.5H8V16z" fill="#E01E5A"/>
        <path d="M6.5 12.5a1.5 1.5 0 010-3h4a1.5 1.5 0 010 3h-4z" fill="#E01E5A"/>
      </svg>
    ),
  },
  {
    id: 'dropbox',
    label: 'Dropbox',
    sub: 'API v2',
    color: 'sky',
    icon: (
      <svg viewBox="0 0 32 32" className="w-4 h-4 flex-shrink-0" fill="#0061FF">
        <path d="M8 2L16 7.5 8 13 0 7.5zM24 2l8 5.5-8 5.5-8-5.5zM0 18.5L8 13l8 5.5-8 5.5zM24 13l8 5.5-8 5.5-8-5.5zM8 25.5l8-5.5 8 5.5-8 5.5z"/>
      </svg>
    ),
  },
  {
    id: 'outlook',
    label: 'Outlook',
    sub: 'Mail / Calendar / Contacts',
    color: 'sky',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#28A8EA"/>
        <path d="M2 6.5l10 6.5 10-6.5" fill="none" stroke="#fff" strokeWidth="1.4"/>
        <rect x="1.5" y="8" width="9" height="10" rx="1.2" fill="#0364B8"/>
        <path d="M6 10.2c-1.5 0-2.7 1.3-2.7 2.9s1.2 2.9 2.7 2.9 2.7-1.3 2.7-2.9-1.2-2.9-2.7-2.9zm0 4.4c-.85 0-1.5-.68-1.5-1.5s.65-1.5 1.5-1.5 1.5.68 1.5 1.5-.65 1.5-1.5 1.5z" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: 'box',
    label: 'Box',
    sub: 'API v2',
    color: 'indigo',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#0061D5">
        <path d="M1 9.5v10A1.5 1.5 0 002.5 21h19a1.5 1.5 0 001.5-1.5v-10a1.5 1.5 0 00-1.5-1.5H2.5A1.5 1.5 0 001 9.5zM12 3L7 8h4v8h2V8h4z"/>
      </svg>
    ),
  },
  {
    id: 'egnyte',
    label: 'Egnyte',
    sub: 'Public API',
    color: 'emerald',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#00A85A">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.24L20 8.5v7.24L12 19.76 4 15.74V8.5L12 4.24z"/>
      </svg>
    ),
  },
  {
    id: 'onedrive',
    label: 'OneDrive',
    sub: 'Graph API',
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#0078D4">
        <path d="M8.5 17.5h9.75a3.25 3.25 0 000-6.5 4.75 4.75 0 00-9.24-1.62A4 4 0 003 13.5a4 4 0 004 4h1.5z"/>
      </svg>
    ),
  },
  {
    id: 'sharepoint',
    label: 'SharePoint',
    sub: 'Graph API',
    color: 'violet',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#0078D4">
        <path d="M10.5 2A5.5 5.5 0 005 7.5c0 .66.12 1.28.33 1.87A4 4 0 004 17h1.17A3.5 3.5 0 1012 13.5V9A5.5 5.5 0 0010.5 2zM18 8a4 4 0 00-3.67 5.6A3.5 3.5 0 1118 20h2a4 4 0 000-8 4 4 0 00-2-7.46z"/>
      </svg>
    ),
  },
  {
    id: 'sharefile',
    label: 'ShareFile',
    sub: 'Citrix API v3',
    color: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#F26522">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.31L18.66 8 12 11.69 5.34 8 12 4.31zM4 9.54l7 3.88v6.3l-7-3.5V9.54zm16 6.68l-7 3.5v-6.3l7-3.88v6.68z"/>
      </svg>
    ),
  },
];

const ACTIVE_STYLES = {
  'google-my-drive':     'border-blue-500 bg-blue-50 text-blue-700',
  'google-shared-drive': 'border-teal-500 bg-teal-50 text-teal-700',
  'gmail':               'border-rose-500 bg-rose-50 text-rose-700',
  'google-chat':         'border-green-500 bg-green-50 text-green-700',
  'outlook':             'border-cyan-500 bg-cyan-50 text-cyan-700',
  'onedrive':            'border-blue-500 bg-blue-50 text-blue-700',
  'teams':               'border-purple-500 bg-purple-50 text-purple-700',
  'slack':               'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700',
  'dropbox':             'border-sky-500 bg-sky-50 text-sky-700',
  'box':                 'border-indigo-500 bg-indigo-50 text-indigo-700',
  'egnyte':              'border-emerald-500 bg-emerald-50 text-emerald-700',
  'sharepoint':          'border-violet-500 bg-violet-50 text-violet-700',
  'sharefile':           'border-orange-500 bg-orange-50 text-orange-700',
};

export default function ServiceSelector({ service, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        1 · Select Service
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SERVICES.map(s => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 font-medium text-xs transition-all text-left ${
              service === s.id
                ? ACTIVE_STYLES[s.id]
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s.icon}
            <span className="truncate leading-tight">
              <span className="block font-semibold">{s.label}</span>
              <span className="block text-gray-400 font-normal">{s.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
