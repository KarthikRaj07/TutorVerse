import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import ChatBox from '../components/ChatBox';

export default function ChatPage() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const validSubjects = ['computer_science', 'english'];
  if (!validSubjects.includes(subject)) {
    React.useEffect(() => {
      navigate('/subjects');
    }, [subject, navigate]);
    return null;
  }

  const subjectDisplayName = subject === 'computer_science' ? 'Computer Science' : 'English Literature';
  const subjectIcon = subject === 'computer_science' ? '💻' : '📖';
  const subjectColorClass = subject === 'computer_science' ? 'text-blue-400' : 'text-fuchsia-400';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your AI Tutor for ${subjectDisplayName}. Ask me any questions, request clarifications, or ask for examples on any topic!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text, subject);

      const assistantMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.answer || res.reply || 'No response generated.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Server error. Please check that the API is running and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Background ambient lighting/glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-650/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-650/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Main Header Bar */}
      <header className="px-6 py-4 bg-slate-900/40 border-b border-slate-900/60 backdrop-blur-2xl flex items-center justify-between z-10 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-850 transition-all duration-300 active:scale-95 cursor-pointer font-bold tracking-wide"
          >
            &larr; Subjects
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-xl shadow-md">
              {subjectIcon}
            </div>
            <div>
              <h1 className="text-sm md:text-base font-extrabold tracking-tight text-slate-100">
                {subjectDisplayName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                  AI Companion Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: `Hello! I am your AI Tutor for ${subjectDisplayName}. Ask me any questions, request clarifications, or ask for examples on any topic!`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sources: [],
            },
          ])}
          className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-550/20 text-indigo-400 hover:text-indigo-350 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Reset Session
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden max-w-6xl w-full mx-auto flex flex-col justify-between">
        <div className="flex-1 min-h-0 relative">
          <ChatBox
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSendMessage}
            loading={loading}
            subject={subject}
          />
        </div>
      </main>
    </div>
  );
}
