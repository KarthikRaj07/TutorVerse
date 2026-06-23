import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';

const QUICK_PROMPTS = [
  'Explain this concept',
  'Give me an example',
  'Quiz me on this topic',
  'Summarize key points',
];

export default function ChatBox({ messages, input, setInput, onSend, loading, subject }) {
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const subjectName = subject === 'computer_science' ? 'Computer Science' : 'English';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-1">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl animate-float"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              🎓
            </div>
            <p className="text-slate-400 text-sm max-w-xs">Ask your first question to begin the learning session.</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-end gap-3 py-2 animate-fade-up">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
              🎓
            </div>
            <Loader />
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      {/* ── Input Area ── */}
      <div className="shrink-0 px-4 md:px-8 py-4 border-t border-white/[0.06]"
        style={{ background: 'rgba(12,19,34,0.8)', backdropFilter: 'blur(20px)' }}>

        {/* Quick Prompts */}
        <div className="flex gap-2 flex-wrap mb-3">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleQuickPrompt(p)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 border border-white/10 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div
          className="flex items-end gap-3 rounded-2xl p-3 transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={`Ask anything about ${subjectName}…`}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
            style={{ maxHeight: '120px', overflowY: 'auto' }}
          />

          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            style={
              !loading && input.trim()
                ? {
                    background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                    boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                  }
                : { background: 'rgba(255,255,255,0.08)' }
            }
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
              : '↑'
            }
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-2">
          Enter to send · Shift+Enter for new line · Powered by Llama 3 + Pinecone RAG
        </p>
      </div>
    </div>
  );
}
