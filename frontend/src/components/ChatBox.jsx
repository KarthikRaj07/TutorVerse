import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';

export default function ChatBox({ messages, input, setInput, onSend, loading, subject }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const subjectDisplayName = subject === 'computer_science' ? 'Computer Science' : 'English';

  return (
    <div className="flex flex-col h-full bg-slate-900/25 border border-slate-850 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-3xl">
      {/* Header Info Panel (inside ChatBox) */}
      <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-850 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          Retrieval Mode: Active RAG Pipeline
        </span>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-4xl animate-bounce shadow-inner">
              🎓
            </div>
            <h3 className="text-xl font-bold text-slate-100">Welcome to TutorVerse</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Your AI Assistant is ready. Ask any questions about <span className="text-cyan-400 font-semibold">{subjectDisplayName}</span>!
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        
        {loading && (
          <div className="flex justify-start items-center pl-2 animate-fade-up">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base mr-3.5 shrink-0 bg-gradient-to-br from-indigo-550 to-cyan-450 border border-indigo-400/20 shadow-md">
              🎓
            </div>
            <Loader />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-5 bg-slate-950/50 border-t border-slate-850/80 backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative bg-slate-900/60 rounded-2xl border border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={`Ask a question about ${subjectDisplayName}...`}
              className="w-full px-5 py-4 bg-transparent text-slate-100 placeholder-slate-500 text-sm outline-none resize-none max-h-32 overflow-y-auto leading-relaxed"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`h-[52px] px-6 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg shrink-0 ${
              loading || !input.trim()
                ? 'bg-slate-850 text-slate-550 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-500 hover:to-purple-600 text-white shadow-indigo-600/10 hover:shadow-indigo-600/25 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-95 cursor-pointer border border-indigo-500/25'
            }`}
          >
            Send Question
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-550 mt-3 select-none tracking-wide">
          Press <span className="font-bold text-slate-450">Enter</span> to send · <span className="font-bold text-slate-450">Shift + Enter</span> for new line
        </p>
      </div>
    </div>
  );
}
