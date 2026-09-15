import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AI_URL = '/api/ai/chat';
const API_KEY_STORAGE = 'cah_anthropic_api_key';

// ── Quick prompts shown at start ───────────────────────────────────────────────
const QUICK_PROMPTS = [
  { label: '🔍 Explain this response',      text: 'Explain what the last API response means.' },
  { label: '❌ Why this error?',             text: 'Why did I get this error and how do I fix it?' },
  { label: '➡ What should I call next?',   text: 'Based on the current operation and response, what API should I call next?' },
  { label: '📋 Summarize results',          text: 'Summarize the key data from the last response in a short list.' },
  { label: '🔑 How to get a token?',        text: 'How do I get a Bearer token for the current service?' },
  { label: '⚙ Fix my query string',        text: 'Review my current params and suggest improvements or corrections.' },
];

// ── Simple markdown-like renderer ─────────────────────────────────────────────
function renderText(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Code block (inline)
    line = line.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-purple-700 px-1 rounded text-xs font-mono">$1</code>');
    // Bold
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Bullet point
    if (/^[-•] /.test(line)) {
      return (
        <div key={i} className="flex gap-1.5 items-start">
          <span className="text-blue-400 flex-shrink-0 mt-0.5">•</span>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-•] /, '') }} />
        </div>
      );
    }
    // Numbered list
    if (/^\d+\. /.test(line)) {
      return (
        <div key={i} className="flex gap-1.5 items-start">
          <span className="text-blue-400 font-mono text-xs flex-shrink-0 w-4">{line.match(/^\d+/)[0]}.</span>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\. /, '') }} />
        </div>
      );
    }
    if (line === '') return <div key={i} className="h-1.5" />;
    return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
  });
}

// ── Single message bubble ──────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0 mr-2 mt-0.5">
          ✦
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-0.5 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p>{msg.text}</p>
        ) : (
          <div className="space-y-0.5">{renderText(msg.text)}</div>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AiChat({ service, operation, lastResponse, lastUrl }) {
  const [open,       setOpen]       = useState(false);
  const [input,      setInput]      = useState('');
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [hasNew,     setHasNew]     = useState(false);
  const [apiKey,     setApiKey]     = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [showKeyBox, setShowKeyBox] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  const saveApiKey = (value) => {
    setApiKey(value);
    if (value.trim()) localStorage.setItem(API_KEY_STORAGE, value.trim());
    else localStorage.removeItem(API_KEY_STORAGE);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasNew(false);
    }
  }, [open]);

  // Build conversation history for the API (alternating user/assistant)
  const buildHistory = () =>
    messages.map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build context payload
    const payload = {
      message:  msg,
      history:  buildHistory(),
      service:  service  || '',
      operation: operation?.name || '',
      lastUrl:  lastUrl  || '',
      lastStatus: lastResponse?.status || null,
      lastResponse: lastResponse?.body
        ? JSON.stringify(lastResponse.body).slice(0, 3000)
        : '',
      apiKey: apiKey || '',
    };

    try {
      const res = await axios.post(AI_URL, payload);
      const reply = res.data?.reply || res.data?.error || 'No response.';
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      if (!open) setHasNew(true);
    } catch (err) {
      const errText = err.response?.data?.error || err.message || 'AI request failed.';
      setMessages(prev => [...prev, { role: 'ai', text: `⚠ ${errText}` }]);
    }

    setLoading(false);
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => setMessages([]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating cloud button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Open AI Assistant"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 ${
          open
            ? 'bg-gray-800 scale-95'
            : 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:scale-110 hover:shadow-blue-300/50'
        }`}
      >
        {/* Pulse ring when there's a new AI message */}
        {hasNew && !open && (
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-60" />
        )}

        {open ? (
          // X icon when open
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          // Cloud AI icon when closed
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04A7.49 7.49 0 0012 4a7.5 7.5 0 00-7.35 6.04A5.994 5.994 0 006 22h13a5 5 0 00.35-11.96zM9 16H7v-2h2v2zm4 0h-2v-2h2v2zm0-4h-2V9.5l3 2.5-1 .07V12zm4 4h-2v-2h2v2z"/>
          </svg>
        )}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col bg-white"
             style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">
                ✦
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">AI Assistant</p>
                <p className="text-blue-200 text-xs mt-0.5 truncate max-w-[200px]">
                  {service || 'Cloud API Helper'} · {operation?.name || 'ready'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowKeyBox(v => !v)}
                title="Set your Anthropic API key"
                className={`text-xs transition-colors ${apiKey ? 'text-blue-200 hover:text-white' : 'text-yellow-300 hover:text-yellow-100'}`}
              >
                🔑
              </button>
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="text-blue-200 hover:text-white text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* API key entry */}
          {showKeyBox && (
            <div className="bg-gray-50 border-b border-gray-100 px-3 py-2.5 flex-shrink-0 space-y-1.5">
              <p className="text-xs text-gray-500">
                Your Anthropic API key (stored only in this browser):
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={e => saveApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full text-xs font-mono border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          )}

          {/* Context pill */}
          {(lastResponse?.status || lastUrl) && (
            <div className="bg-gray-50 border-b border-gray-100 px-3 py-1.5 flex items-center gap-2 flex-shrink-0 flex-wrap">
              {lastResponse?.status && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${
                  lastResponse.status < 300
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {lastResponse.status}
                </span>
              )}
              {lastUrl && (
                <span className="text-xs text-gray-400 truncate flex-1 font-mono">
                  {lastUrl.replace(/^https?:\/\//, '').slice(0, 45)}
                </span>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 pt-3 pb-1">
            {messages.length === 0 ? (
              /* Quick prompts */
              <div>
                <p className="text-xs text-gray-400 text-center mb-3">
                  Ask anything about your API calls ↓
                </p>
                <div className="space-y-2">
                  {QUICK_PROMPTS.map(qp => (
                    <button
                      key={qp.text}
                      onClick={() => send(qp.text)}
                      className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 transition-all"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => <Bubble key={i} msg={m} />)}
                {loading && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                      ✦
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex-shrink-0 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything… (Enter to send)"
                rows={1}
                className="flex-1 text-xs border border-gray-300 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-500 max-h-24 leading-relaxed"
                style={{ overflow: 'auto' }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                </svg>
              </button>
            </div>
            <p className="text-gray-300 text-xs mt-1.5 text-center">
              Powered by Claude · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
