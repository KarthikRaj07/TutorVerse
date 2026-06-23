import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const formattedTime = message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-2 animate-fade-up`}>
      {/* AI Tutor Avatar */}
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg mr-4 shrink-0 shadow-lg bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-550 border border-indigo-400/20 shadow-indigo-900/20">
          🎓
        </div>
      )}

      {/* Message Bubble Block */}
      <div
        className={`max-w-[80%] md:max-w-[70%] px-5 py-4 rounded-3xl shadow-xl border text-sm leading-relaxed transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 via-indigo-650 to-purple-650 border-indigo-500/20 text-white rounded-tr-none'
            : 'bg-slate-900/60 backdrop-blur-2xl border-slate-800/80 text-slate-100 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap font-sans text-slate-200 tracking-wide font-medium">{message.content}</p>

        {/* Sources/Citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-850 flex flex-wrap gap-2">
            {message.sources.map((source, index) => (
              <span
                key={index}
                className="text-[10px] px-3 py-1 rounded-full bg-slate-950/80 text-cyan-400 border border-slate-800 flex items-center gap-1.5 font-bold tracking-wide"
              >
                📚 {source}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-right mt-2 text-[9px] font-bold select-none uppercase tracking-wider ${
            isUser ? 'text-indigo-200/50' : 'text-slate-500'
          }`}
        >
          {formattedTime}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg ml-4 shrink-0 shadow-lg bg-gradient-to-br from-fuchsia-600 via-purple-650 to-pink-500 border border-fuchsia-450/20 shadow-fuchsia-900/20">
          👤
        </div>
      )}
    </div>
  );
}
