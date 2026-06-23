import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';

export default function ChatBox({ messages, input, setInput, onSend, loading, subject }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive or loading status changes
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
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl">
      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-3xl animate-bounce">
              🎓
            </div>
            <h3 className="text-lg font-bold text-slate-100">Welcome to TutorVerse</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Your AI Assistant is ready. Ask any questions about <span className="text-cyan-400 font-semibold">{subjectDisplayName}</span>!
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        
        {loading && (
          <div className="flex justify-start items-center pl-1 md:pl-3 animate-fade-up">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base mr-3 shrink-0 bg-gradient-to-br from-indigo-500 to-cyan-400">
              🎓
            </div>
            <Loader />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative bg-slate-950/80 rounded-2xl border border-slate-800 focus-within:border-indigo-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={`Ask a question about ${subjectDisplayName}...`}
              className="w-full px-4 py-3 bg-transparent text-slate-100 placeholder-slate-500 text-sm outline-none resize-none max-h-32 overflow-y-auto leading-relaxed"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`h-11 px-5 rounded-2xl flex items-center justify-center font-semibold text-sm transition-all shadow-md shrink-0 ${
              loading || !input.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-indigo-500/20 active:scale-95 cursor-pointer'
            }`}
          >
            Send
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-2 select-none">
          Press Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
