import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import ChatBox from '../components/ChatBox';

const SUBJECT_META = {
  computer_science: {
    label: 'Computer Science',
    icon: '💻',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
    topics: ['Algorithms', 'Databases', 'Networks', 'Python', 'OS Concepts'],
  },
  english: {
    label: 'English Literature',
    icon: '📖',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.3)',
    topics: ['Prose', 'Poetry', 'Grammar', 'Comprehension', 'Essay Writing'],
  },
};

export default function ChatPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const meta = SUBJECT_META[subject] || SUBJECT_META['computer_science'];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI tutor for **${meta.label}**. Ask me anything — from concepts and examples to practice questions. I'm powered by RAG so my answers are grounded in your syllabus.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text, subject);
      setMessages((prev) => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.answer || res.reply || 'No response.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources || [],
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Server error. Please ensure the backend is running and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([{
    id: 'welcome',
    role: 'assistant',
    content: `Hello! I'm your AI tutor for **${meta.label}**. Ask me anything — from concepts and examples to practice questions.`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: [],
  }]);

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <aside className="w-64 shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0c1322]">

          {/* Brand */}
          <div className="px-5 py-5 border-b border-white/[0.06]">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
                🎓
              </div>
              <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">TutorVerse</span>
            </button>
          </div>

          {/* Subject Badge */}
          <div className="px-4 py-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-3">Current Subject</p>
            <div
              className="flex items-center gap-3 px-3 py-3 rounded-2xl"
              style={{ background: `${meta.glow}20`, border: `1px solid ${meta.glow}` }}
            >
              <span className="text-2xl">{meta.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{meta.label}</p>
                <p className="text-[10px] text-slate-400">12th Standard</p>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="px-4 py-2 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-3">Topics Covered</p>
            <div className="space-y-1">
              {meta.topics.map((t) => (
                <div key={t} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="px-4 py-4 border-t border-white/[0.06] space-y-2">
            <button
              onClick={() => navigate('/subjects')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <span>←</span> Change Subject
            </button>
            <button
              onClick={resetChat}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <span>↺</span> Reset Session
            </button>
          </div>
        </aside>
      )}

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0c1322]/60 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer text-base"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{meta.icon}</span>
              <div>
                <h1 className="text-sm font-bold text-white">{meta.label}</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399' }} />
                  <span className="text-[10px] text-slate-500 font-medium">AI Tutor Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200 cursor-pointer"
            >
              New Chat
            </button>
          </div>
        </header>

        {/* Chat Box */}
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
