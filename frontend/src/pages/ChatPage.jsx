import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';
import ChatBox from '../components/ChatBox';

export default function ChatPage() {
  const { subject } = useParams();
  const navigate = useNavigate();

  // Validate the route parameter and determine the display subject
  const validSubjects = ['computer_science', 'english'];
  if (!validSubjects.includes(subject)) {
    // Redirect if an invalid subject parameter is given
    React.useEffect(() => {
      navigate('/subjects');
    }, [subject, navigate]);
    return null;
  }

  const subjectDisplayName = subject === 'computer_science' ? 'Computer Science' : 'English Literature';
  const subjectIcon = subject === 'computer_science' ? '💻' : '📖';

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

    // Add user message to history
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
      // API call to the backend RAG pipeline with subject binding
      const res = await sendChatMessage(text, subject);

      // Add AI response to history
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
      
      // Error handling: Show "Server error" as a message bubble
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
    <div className="h-screen flex flex-col bg-[#0a0b14] overflow-hidden">
      {/* Header bar */}
      <header className="px-6 py-4 bg-slate-950/60 border-b border-slate-900 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-350 hover:text-slate-100 hover:border-slate-700 transition active:scale-95 cursor-pointer font-semibold"
          >
            &larr; Subjects
          </button>
          <div>
            <h1 className="text-sm md:text-base font-bold text-slate-150 flex items-center gap-2">
              <span>{subjectIcon}</span> {subjectDisplayName}
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              AI Tutor Active
            </p>
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
          className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/15 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer"
        >
          Reset Session
        </button>
      </header>

      {/* Main chat window content */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden max-w-6xl w-full mx-auto">
        <ChatBox
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          loading={loading}
          subject={subject}
        />
      </main>
    </div>
  );
}
