import React from 'react';

function formatContent(text) {
  // Bold: **text**
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-3 py-2 animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 mb-1"
        style={
          isUser
            ? { background: 'linear-gradient(135deg, #a855f7, #6366f1)' }
            : { background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }
        }
      >
        {isUser ? '👤' : '🎓'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[72%] md:max-w-[65%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-sm text-white'
              : 'rounded-bl-sm text-slate-200'
          }`}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
                }
              : {
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }
          }
        >
          <p className="whitespace-pre-wrap">{formatContent(message.content)}</p>
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-cyan-400"
                style={{
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.2)',
                }}
              >
                📚 {src}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[9px] text-slate-600 px-1 select-none">
          {message.time}
        </span>
      </div>
    </div>
  );
}
