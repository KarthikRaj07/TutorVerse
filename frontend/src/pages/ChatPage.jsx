import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import ChatBox from '../components/ChatBox';

const SUBJECT_META = {
  computer_science: {
    label: 'Computer Science',
    icon: '💻',
    accent: '#7C5CFF',
    topics: ['Algorithms', 'Data Structures', 'Databases', 'Networks', 'Operating Systems', 'Python'],
  },
  english: {
    label: 'English Literature',
    icon: '📖',
    accent: '#00D4FF',
    topics: ['Prose Analysis', 'Poetry', 'Grammar', 'Comprehension', 'Essay Writing', 'Vocabulary'],
  },
};

export default function ChatPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const meta = SUBJECT_META[subject] ?? SUBJECT_META.computer_science;

  const [messages, setMessages] = useState([{
    id: 'welcome',
    role: 'assistant',
    content: `Hi! I'm your AI tutor for **${meta.label}**.\n\nAsk me anything — concepts, examples, practice questions, or explanations. I'll give you clear, syllabus-grounded answers.`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: [],
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((p) => [...p, {
      id: `u-${Date.now()}`, role: 'user', content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text, subject);
      setMessages((p) => [...p, {
        id: `a-${Date.now()}`, role: 'assistant',
        content: res.answer || res.reply || 'No response.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources || [],
      }]);
    } catch {
      setMessages((p) => [...p, {
        id: `e-${Date.now()}`, role: 'assistant',
        content: '⚠️ Server error. Please ensure the backend is running and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([{
    id: 'welcome', role: 'assistant',
    content: `Session reset! I'm ready to help with **${meta.label}**. What would you like to learn?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: [],
  }]);

  return (
    <div className="flex h-screen bg-[#0B0F1A] overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      {sidebarOpen && (
        <aside className="w-64 shrink-0 flex flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#0d1220]">

          {/* Brand header */}
          <div className="px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-3 w-full group cursor-pointer">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0
                bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF]">
                🎓
              </div>
              <span className="font-bold text-sm text-[#E6EAF2] group-hover:text-purple-400 transition-colors">
                TutorVerse
              </span>
            </button>
          </div>

          {/* Subject badge */}
          <div className="px-3 py-4 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4B5563] px-2">
              Active Subject
            </p>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${meta.accent}18, transparent)`,
                border: `1px solid ${meta.accent}40`,
              }}>
              <span className="text-xl">{meta.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#E6EAF2] truncate">{meta.label}</p>
                <p className="text-[10px] text-[#4B5563]">Grade 12</p>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="px-3 flex-1 overflow-y-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4B5563] px-2 mb-2">
              Topics
            </p>
            <nav className="space-y-0.5">
              {meta.topics.map((t) => (
                <div key={t}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9CA3AF]
                    hover:text-[#E6EAF2] hover:bg-[rgba(255,255,255,0.04)]
                    transition-all duration-150 cursor-default">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: meta.accent }} />
                  {t}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer actions */}
          <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.06)] space-y-1">
            <SidebarAction icon="◀" label="Change Subject" onClick={() => navigate('/subjects')} />
            <SidebarAction icon="↺" label="Reset Session" onClick={resetChat} />
          </div>
        </aside>
      )}

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="shrink-0 flex items-center justify-between
          px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)]
          bg-[#0d1220]/80 backdrop-blur-xl z-10">

          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button onClick={() => setSidebarOpen((p) => !p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm
                text-[#9CA3AF] hover:text-[#E6EAF2] hover:bg-[rgba(255,255,255,0.06)]
                transition-all duration-150 cursor-pointer">
              ☰
            </button>

            {/* Subject + status */}
            <div className="flex items-center gap-3">
              <span className="text-xl">{meta.icon}</span>
              <div>
                <h1 className="text-sm font-semibold text-[#E6EAF2] leading-none">{meta.label}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{ boxShadow: '0 0 6px #34d399' }} />
                  <span className="text-[10px] font-medium text-[#9CA3AF]">AI Tutor Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={resetChat}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#9CA3AF] cursor-pointer
                border border-[rgba(255,255,255,0.08)]
                hover:border-[rgba(255,255,255,0.16)] hover:text-[#E6EAF2]
                hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200">
              New Chat
            </button>
          </div>
        </header>

        {/* Chat content */}
        <div className="flex-1 min-h-0">
          <ChatBox
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
            subject={subject}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar Action Button ──────────────────────────────────── */
function SidebarAction({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
        text-xs font-medium text-[#4B5563] cursor-pointer
        hover:text-[#9CA3AF] hover:bg-[rgba(255,255,255,0.04)]
        transition-all duration-150">
      <span className="text-base leading-none">{icon}</span>
      {label}
    </button>
  );
}
