import React from 'react';

/** Render **bold** markdown inline */
function renderText(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 fade-in mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-blue-500'
            : 'bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF]'
        }`}
      >
        {isUser ? '✦' : '✦'}
      </div>

      {/* Bubble + metadata */}
      <div className={`flex flex-col gap-1.5 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 text-sm leading-relaxed ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
          <p className="whitespace-pre-wrap break-words">{renderText(message.content)}</p>
        </div>

        {/* Source citations */}
        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {message.sources.map((src, i) => (
              <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-cyan-400
                bg-cyan-400/10 border border-cyan-400/20 tracking-wide">
                📎 {src}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-[#4B5563] px-1 select-none">{message.time}</span>
      </div>
    </div>
  );
}
