import { useState, useRef, useEffect } from 'react'

// ── Helpers ──────────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── API helpers ──────────────────────────────────────────────────────────────
const API = '/api'

async function apiChat(message, sessionId, subject) {
  const res = await fetch(`${API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId, subject }),
  })
  if (!res.ok) throw new Error(`Chat error ${res.status}`)
  return res.json()
}

async function apiHealth() {
  const res = await fetch(`${API}/health`)
  if (!res.ok) throw new Error('Health check failed')
  return res.json()
}

async function apiIngest(content, subject, title) {
  const res = await fetch(`${API}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, subject, title }),
  })
  if (!res.ok) throw new Error(`Ingest error ${res.status}`)
  return res.json()
}

// ── Status Dot ───────────────────────────────────────────────────────────────
function StatusDot({ label, value }) {
  const ok = value === 'connected'
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: ok ? '#00d4aa' : '#f87171', boxShadow: ok ? '0 0 6px #00d4aa' : 'none' }}
      />
      <span style={{ color: 'var(--text-secondary)' }}>{label}:</span>
      <span style={{ color: ok ? '#4dffd7' : '#f87171', fontWeight: 600 }}>{value || '…'}</span>
    </div>
  )
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingBubble() {
  return (

    
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl w-fit"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="block w-2 h-2 rounded-full"
          style={{
            background: 'var(--accent-light)',
            animation: `typing 1.2s ${d}ms ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal))', fontWeight: 700 }}>
          🎓
        </div>
      )}
      <div
        className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={isUser
          ? { background: 'linear-gradient(135deg, var(--accent), #5a52e8)', color: '#fff', borderRadius: '18px 18px 4px 18px' }
          : { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px 18px 18px 18px', color: 'var(--text-primary)' }
        }
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
        {msg.sources?.length > 0 && (
          <div className="mt-2 pt-2 flex flex-wrap gap-1" style={{ borderTop: '1px solid var(--border)' }}>
            {msg.sources.map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)', border: '1px solid var(--border)' }}>
                📚 {s}

                <h1>Jennkins test</h1>
              </span>
            ))}
          </div>
        )}
        <p className="text-right mt-1 text-xs" style={{ color: isUser ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>
          {msg.time}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm ml-2 shrink-0 mt-1"
          style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', fontWeight: 700 }}>
          👤
        </div>
      )}
    </div>
  )
}

// ── Ingest Modal ─────────────────────────────────────────────────────────────
function IngestModal({ subjects, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', subject: subjects[0], content: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await apiIngest(form.content, form.subject, form.title)
      setResult({ ok: true, msg: data.message })
      onSuccess?.(data)
    } catch (err) {
      setResult({ ok: false, msg: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 animate-fade-up"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-glow)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">📥</span> Ingest Study Material
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Newton's Laws of Motion"
              className="w-full px-3 py-2 rounded-xl text-sm outline-none transition"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Subject</label>
            <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              {subjects.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Content</label>
            <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              rows={5} placeholder="Paste your study material here…"
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          {result && (
            <p className="text-sm px-3 py-2 rounded-lg"
              style={{ background: result.ok ? 'rgba(0,212,170,0.1)' : 'rgba(248,113,113,0.1)',
                color: result.ok ? '#4dffd7' : '#f87171', border: `1px solid ${result.ok ? '#00d4aa44' : '#f8717144'}` }}>
              {result.ok ? '✅' : '❌'} {result.msg}
            </p>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: loading ? 'var(--bg-card)' : 'linear-gradient(135deg, var(--accent), var(--teal))',
              color: '#fff', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? '⏳ Ingesting…' : '📤 Store in Pinecone'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
const SUBJECTS = [
  'general', 'mathematics', 'physics', 'chemistry', 'biology',
  'history', 'geography', 'computer_science', 'literature', 'economics',
]

const SUBJECT_ICONS = {
  general: '🌐', mathematics: '➕', physics: '⚛️', chemistry: '🧪',
  biology: '🧬', history: '📜', geography: '🌍', computer_science: '💻',
  literature: '📖', economics: '📊',
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant', content:
        'Hi! I\'m TutorVerse, your AI tutor powered by Llama 3. Ask me anything — or pick a subject from the sidebar!\n\nYou can also ingest your study materials using the 📥 button so I can reference them.',
      time: now(), sources: [],
    }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [subject, setSubject]   = useState('general')
  const [sessionId, setSessionId] = useState(null)
  const [health, setHealth]     = useState({})
  const [showIngest, setShowIngest] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Fetch health on mount
  useEffect(() => {
    apiHealth().then(setHealth).catch(() => setHealth({ pinecone: 'error', ollama: 'unavailable' }))
    const t = setInterval(() => {
      apiHealth().then(setHealth).catch(() => {})
    }, 15000)
    return () => clearInterval(t)
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: text, time: now(), sources: [] }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const data = await apiChat(text, sessionId, subject)
      if (!sessionId) setSessionId(data.session_id)
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: data.reply, time: now(), sources: data.sources || [],
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: `⚠️ Error: ${err.message}. Make sure the backend is running on port 8000.`,
        time: now(), sources: [],
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function clearChat() {
    setSessionId(null)
    setMessages([{
      id: Date.now(), role: 'assistant',
      content: 'Chat cleared! Start a fresh conversation.',
      time: now(), sources: [],
    }])
  }

  return (
    <div className="h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <aside className="w-64 flex flex-col shrink-0 border-r"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          {/* Logo */}
          <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal))' }}>
                🎓
              </div>
              <div>
                <h1 className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TutorVerse</h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Learning Assistant</p>
              </div>
            </div>
          </div>

          {/* Subject picker */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Subjects</p>
            <div className="space-y-1">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setSubject(s)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left"
                  style={{
                    background: subject === s ? 'var(--accent-glow)' : 'transparent',
                    border: `1px solid ${subject === s ? 'var(--accent)' : 'transparent'}`,
                    color: subject === s ? 'var(--accent-light)' : 'var(--text-secondary)',
                  }}>
                  <span>{SUBJECT_ICONS[s]}</span>
                  <span className="capitalize">{s.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status panel */}
          <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>System Status</p>
            <StatusDot label="Pinecone DB" value={health.pinecone} />
            <StatusDot label="Ollama LLM" value={health.ollama} />
            <StatusDot label="Backend" value={health.status} />
          </div>
        </aside>
      )}

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(p => !p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
              ☰
            </button>
            <div>
              <h2 className="font-semibold text-sm">{SUBJECT_ICONS[subject]} {subject.replace('_', ' ').toUpperCase()}</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {sessionId ? `Session: ${sessionId.slice(0, 8)}…` : 'New session'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowIngest(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={{ background: 'rgba(0,212,170,0.1)', color: '#4dffd7', border: '1px solid rgba(0,212,170,0.3)' }}>
              📥 Add Material
            </button>
            <button onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              🗑️ Clear
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => <Message key={msg.id} msg={msg} />)}
          {loading && (
            <div className="flex justify-start animate-fade-up">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--teal))' }}>
                🎓
              </div>
              <TypingBubble />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="p-4 border-t shrink-0"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          {/* Quick prompts */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {['Explain this concept', 'Give me an example', 'Quiz me', 'Summarize'].map(q => (
              <button key={q} onClick={() => { setInput(q); inputRef.current?.focus() }}
                className="text-xs px-3 py-1 rounded-full transition"
                style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                rows={1}
                placeholder={`Ask TutorVerse about ${subject.replace('_', ' ')}…`}
                className="w-full px-4 py-3 pr-4 rounded-xl text-sm resize-none outline-none transition"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  lineHeight: '1.5',
                }}
              />
            </div>
            <button type="submit" disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all shrink-0"
              style={{
                background: loading || !input.trim()
                  ? 'var(--bg-card)'
                  : 'linear-gradient(135deg, var(--accent), var(--teal))',
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                animation: !loading && input.trim() ? 'pulse-glow 2s infinite' : 'none',
              }}>
              {loading
                ? <span style={{ width: 18, height: 18, border: '2px solid var(--accent-light)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />
                : '➤'}
            </button>
          </form>
          <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Shift+Enter for newline · Powered by Llama 3 via Ollama + Pinecone RAG
          </p>
        </div>
      </div>

      {showIngest && (
        <IngestModal
          subjects={SUBJECTS}
          onClose={() => setShowIngest(false)}
          onSuccess={() => setTimeout(() => setShowIngest(false), 1500)}
        />
      )}
    </div>
  )
}
