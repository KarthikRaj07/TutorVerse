import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const formattedTime = message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-up`}>
      {/* AI Tutor Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base mr-3 shrink-0 shadow-md bg-gradient-to-br from-indigo-500 to-cyan-400 border border-indigo-400/30">
          🎓
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-lg border text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-500/30 text-white rounded-br-none'
            : 'bg-slate-900/80 backdrop-blur-md border-slate-800 text-slate-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap font-medium">{message.content}</p>

        {/* Citations/Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
            {message.sources.map((source, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 text-cyan-400 border border-slate-700/50 flex items-center gap-1 font-semibold"
              >
                📚 {source}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-right mt-1.5 text-[10px] select-none ${
            isUser ? 'text-white/60' : 'text-slate-400/60'
          }`}
        >
          {formattedTime}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base ml-3 shrink-0 shadow-md bg-gradient-to-br from-pink-500 to-rose-400 border border-pink-400/30">
          👤
        </div>
      )}
    </div>
  );
}
