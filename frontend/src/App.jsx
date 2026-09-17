import { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceSelector    from './components/ServiceSelector';
import OperationSelector  from './components/OperationSelector';
import RequestPanel       from './components/RequestPanel';
import ResponseViewer     from './components/ResponseViewer';
import HistorySidebar     from './components/HistorySidebar';
import AiChat            from './components/AiChat';
import LoginGate          from './components/LoginGate';
import LoginsPanel        from './components/LoginsPanel';

import { googleMyDriveAPIs }     from './apis/googleMyDrive';
import { googleSharedDriveAPIs } from './apis/googleSharedDrive';
import { gmailAPIs }             from './apis/gmail';
import { googleChatAPIs }        from './apis/googleChat';
import { outlookAPIs }           from './apis/outlook';
import { onedriveAPIs }          from './apis/onedrive';
import { teamsAPIs }             from './apis/teams';
import { slackAPIs }             from './apis/slack';
import { dropboxAPIs }           from './apis/dropbox';
import { boxAPIs }               from './apis/box';
import { egnyteAPIs }            from './apis/egnyte';
import { sharepointAPIs }        from './apis/sharepoint';
import { sharefileAPIs }         from './apis/sharefile';

import { buildNestedBody } from './utils/buildBody';

// ── Constants ─────────────────────────────────────────────────────────────────

const SERVICE_APIS = {
  'google-my-drive':     googleMyDriveAPIs,
  'google-shared-drive': googleSharedDriveAPIs,
  'gmail':               gmailAPIs,
  'google-chat':         googleChatAPIs,
  'outlook':             outlookAPIs,
  'onedrive':            onedriveAPIs,
  'teams':               teamsAPIs,
  'slack':               slackAPIs,
  'dropbox':             dropboxAPIs,
  'box':                 boxAPIs,
  'egnyte':              egnyteAPIs,
  'sharepoint':          sharepointAPIs,
  'sharefile':           sharefileAPIs,
};

// Read-only mode by default (GET only) — Dropbox also allows POST, since its
// entire API (even reads) is POST-based and it'd otherwise have nothing to show.
const ALLOWED_METHODS = {
  dropbox: ['GET', 'POST'],
};
const getOnly = (ops, service) => {
  const methods = ALLOWED_METHODS[service] || ['GET'];
  return ops.filter(op => methods.includes(op.method));
};

const SERVICE_NAMES = {
  'google-my-drive':     'Google My Drive',
  'google-shared-drive': 'Google Shared Drive',
  'gmail':               'Gmail',
  'google-chat':         'Google Chat',
  'outlook':             'Outlook',
  'onedrive':            'OneDrive',
  'teams':               'Microsoft Teams',
  'slack':               'Slack',
  'dropbox':             'Dropbox',
  'box':                 'Box',
  'egnyte':              'Egnyte',
  'sharepoint':          'SharePoint',
  'sharefile':           'ShareFile',
};

// In dev: Vite proxies /api → localhost:8080  (see vite.config.js)
// In prod: Nginx proxies /api → localhost:8080 on the server
const PROXY_URL = '/api/proxy/execute';
const SIDEBAR_KEY = 'cloud_api_helper_sidebar';
const EMAIL_KEY   = 'cloud_api_helper_user_email';
const SESSION_KEY = 'cloud_api_helper_session_token';
const MAX_HISTORY = 100;
// Only this email can see the login history — must match backend's app.admin.email.
const ADMIN_EMAIL = 'vijendarburgula@gmail.com';

// ── Storage helpers ───────────────────────────────────────────────────────────
// Request history is scoped per logged-in email, so switching users on the
// same browser never shows one person's call history to another.

const historyKey = email => `cloud_api_helper_history_${email}`;

function loadHistory(email) {
  if (!email) return [];
  try { const r = localStorage.getItem(historyKey(email)); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveHistory(email, items) {
  if (!email) return;
  try { localStorage.setItem(historyKey(email), JSON.stringify(items)); } catch {}
}
function loadBool(key, def = true) {
  try { const v = localStorage.getItem(key); return v === null ? def : v !== 'false'; }
  catch { return def; }
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {

  // ── Login gate (real session, not just a typed email) ───────────────────────
  const [userEmail, setUserEmail] = useState(() => {
    try { return localStorage.getItem(EMAIL_KEY) || ''; } catch { return ''; }
  });
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loginsOpen, setLoginsOpen] = useState(false);

  const applySession = (sessionToken, email) => {
    try {
      localStorage.setItem(SESSION_KEY, sessionToken);
      localStorage.setItem(EMAIL_KEY, email);
    } catch {}
    axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
    setUserEmail(email);
  };

  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(EMAIL_KEY);
    } catch {}
    delete axios.defaults.headers.common['Authorization'];
    setUserEmail('');
  };

  const handleLogin = (sessionToken, email) => applySession(sessionToken, email);

  const handleLogout = () => {
    axios.post('/api/auth/logout').catch(() => {});
    clearSession();
  };

  // Validate any stored session on load — the backend's in-memory sessions
  // don't survive a server restart, so a stale token needs to bounce back
  // to the login screen rather than silently pretending to be logged in.
  useEffect(() => {
    const stored = (() => { try { return localStorage.getItem(SESSION_KEY); } catch { return null; } })();
    if (!stored) { setSessionChecked(true); return; }

    axios.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
    axios.get('/api/auth/me')
      .then(res => {
        if (res.data?.email) applySession(stored, res.data.email);
        else clearSession();
      })
      .catch(() => clearSession())
      .finally(() => setSessionChecked(true));
  }, []);

  // ── Core state ──────────────────────────────────────────────────────────────
  const [service,     setService]     = useState('google-my-drive');
  const [operationId, setOperationId] = useState(getOnly(googleMyDriveAPIs, 'google-my-drive')[0]?.id || null);
  const [token,       setToken]       = useState('');
  const [paramValues, setParamValues] = useState({});
  const [response,    setResponse]    = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [manualUrl,   setManualUrl]   = useState('');
  // Custom request headers: [{ key, value, description, enabled }]
  const [customHeaders, setCustomHeaders] = useState([]);

  // ── UI panels ───────────────────────────────────────────────────────────────
  const [sidebarOpen,  setSidebarOpen]  = useState(() => loadBool(SIDEBAR_KEY, true));
  const [lastSentUrl,  setLastSentUrl]  = useState('');

  // ── History state (scoped to the current user) ──────────────────────────────
  const [history,         setHistory]         = useState(() => loadHistory(userEmail));
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const operations = getOnly(SERVICE_APIS[service], service);
  const operation  = operations.find(op => op.id === operationId) || operations[0] || null;

  // Persist panel states
  useEffect(() => { localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen)); }, [sidebarOpen]);

  // Reload history whenever the logged-in user changes (e.g. Switch → new login)
  useEffect(() => {
    setHistory(loadHistory(userEmail));
    setActiveHistoryId(null);
  }, [userEmail]);

  if (!sessionChecked) {
    return <div className="h-screen bg-gray-50" />;
  }

  if (!userEmail) {
    return <LoginGate onLogin={handleLogin} />;
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleServiceChange = newService => {
    setService(newService);
    setOperationId(getOnly(SERVICE_APIS[newService], newService)[0]?.id || null);
    setParamValues({});
    setResponse(null);
    setManualUrl('');
    setActiveHistoryId(null);
  };

  const handleOperationChange = newOpId => {
    setOperationId(newOpId);
    setParamValues({});
    setResponse(null);
    setManualUrl('');
    setActiveHistoryId(null);
  };

  const handleHistorySelect = item => {
    setService(item.service);
    setOperationId(item.operationId);
    setParamValues(item.paramValues || {});
    setToken(item.token || '');
    setManualUrl(item.manualUrl || '');
    setCustomHeaders(item.customHeaders || []);
    setResponse(item.response || null);
    setActiveHistoryId(item.id);
  };

  const handleHistoryDelete = id => {
    const next = history.filter(h => h.id !== id);
    setHistory(next);
    saveHistory(userEmail, next);
    if (activeHistoryId === id) setActiveHistoryId(null);
  };

  const handleHistoryClear = () => {
    setHistory([]);
    saveHistory(userEmail, []);
    setActiveHistoryId(null);
  };

  // ── URL / headers builders ────────────────────────────────────────────────

  const buildPreviewUrl = () => {
    if (!operation) return '';
    let url = operation.baseUrl;
    operation.params
      .filter(p => p.type === 'path')
      .forEach(p => {
        url = url.replace(`{${p.key}}`, paramValues[p.key] || `{${p.key}}`);
      });
    const qp = operation.params.filter(p => p.type === 'query' && paramValues[p.key]);
    if (qp.length > 0) {
      url += '?' + qp.map(p => `${p.key}=${encodeURIComponent(paramValues[p.key])}`).join('&');
    }
    return url;
  };

  const buildPreviewHeaders = () => {
    const h = { Authorization: `Bearer ${token || '<your-token>'}` };
    if (operation && ['POST','PATCH','PUT'].includes(operation.method)) h['Content-Type'] = 'application/json';
    return h;
  };

  // ── Send single request ───────────────────────────────────────────────────

  const sendRequest = async () => {
    if (!operation) return;
    if (!token.trim()) { alert('Please enter your Bearer token first.'); return; }

    setLoading(true);
    setResponse(null);

    const headers = { Authorization: `Bearer ${token}` };
    if (['POST','PATCH','PUT'].includes(operation.method)) headers['Content-Type'] = 'application/json';
    // Apply user-defined custom headers (can override the auto ones)
    customHeaders
      .filter(h => h.enabled && h.key.trim())
      .forEach(h => { headers[h.key.trim()] = h.value; });

    let finalUrl, queryParams, body;

    if (manualUrl.trim()) {
      finalUrl    = manualUrl.trim();
      queryParams = {};
      body        = buildNestedBody(operation.params, paramValues);
    } else {
      finalUrl = operation.baseUrl;
      operation.params.filter(p => p.type === 'path').forEach(p => {
        finalUrl = finalUrl.replace(`{${p.key}}`, encodeURIComponent(paramValues[p.key] || ''));
      });
      queryParams = {};
      operation.params.filter(p => p.type === 'query' && paramValues[p.key]).forEach(p => {
        queryParams[p.key] = paramValues[p.key];
      });
      body = buildNestedBody(operation.params, paramValues);
    }

    let result;
    try {
      const res = await axios.post(PROXY_URL, { url: finalUrl, method: operation.method, headers, queryParams, body });
      result = res.data;
    } catch (err) {
      result = {
        status: err.response?.status || 0,
        body:   err.response?.data   || null,
        error:  err.message || 'Request failed — is the Java backend running on port 8080?',
      };
    }

    setLastSentUrl(finalUrl);
    setResponse(result);

    // Save to history
    const historyItem = {
      id:            String(Date.now()) + Math.random().toString(36).slice(2, 6),
      timestamp:     Date.now(),
      service,
      serviceName:   SERVICE_NAMES[service] || service,
      operationId,
      operationName: operation.name,
      method:        operation.method,
      url:           finalUrl,
      status:        result?.status || 0,
      paramValues:   { ...paramValues },
      token,
      manualUrl,
      customHeaders: [...customHeaders],
      response:      result,
    };

    setActiveHistoryId(historyItem.id);
    setHistory(prev => {
      const next = [historyItem, ...prev].slice(0, MAX_HISTORY);
      saveHistory(userEmail, next);
      return next;
    });

    setLoading(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              API
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">Cloud API Helper</h1>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                My Drive · Shared Drive · Gmail · Google Chat · Outlook · OneDrive · Teams · Slack · Dropbox · Box · Egnyte · SharePoint · ShareFile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
              <button
                onClick={() => setLoginsOpen(true)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
                title="View login history"
              >
                🗂 Logins
              </button>
            )}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <span className="text-xs font-mono text-gray-600 hidden sm:inline">👤 {userEmail}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-400 hover:text-gray-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: History sidebar */}
        <HistorySidebar
          history={history}
          activeId={activeHistoryId}
          onSelect={handleHistorySelect}
          onDelete={handleHistoryDelete}
          onClear={handleHistoryClear}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(v => !v)}
        />

        {/* Centre: Main form */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-5 space-y-4">

            <ServiceSelector service={service} onChange={handleServiceChange} />

            <OperationSelector
              operations={operations}
              operationId={operationId}
              onChange={handleOperationChange}
            />

            {operation ? (
              <RequestPanel
                operation={operation}
                previewUrl={buildPreviewUrl()}
                manualUrl={manualUrl}
                onUrlChange={setManualUrl}
                paramValues={paramValues}
                onParamsChange={setParamValues}
                token={token}
                onTokenChange={setToken}
                customHeaders={customHeaders}
                onCustomHeadersChange={setCustomHeaders}
                loading={loading}
                onSend={sendRequest}
              />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <p className="text-sm text-gray-500">
                  {SERVICE_NAMES[service]} has no GET operations — its API uses POST for reads and writes alike.
                </p>
                <p className="text-xs text-gray-400 mt-1">This tool only exposes read-only (GET) calls.</p>
              </div>
            )}

            {response && <ResponseViewer response={response} />}
            <div className="h-8" />
          </div>
        </main>
      </div>

      {/* ── Floating AI assistant button (bottom-right) ─────────────────── */}
      <AiChat
        service={SERVICE_NAMES[service]}
        operation={operation}
        lastResponse={response}
        lastUrl={lastSentUrl}
      />

      {loginsOpen && <LoginsPanel onClose={() => setLoginsOpen(false)} />}
    </div>
  );
}
