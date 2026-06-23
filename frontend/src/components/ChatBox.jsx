import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';

const QUICK_PROMPTS = [
  'Explain with an example',
  'Quiz me on this',
  'Summarize key points',
  'Show step-by-step',
];

export default function ChatBox({ messages, input, setInput, onSend, loading, subject }) {
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const subjectName = subject === 'computer_science' ? 'Computer Science' : 'English';

  /* Auto-scroll on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Messages ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 lg:px-16 py-8 space-y-1">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 fade-in">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl float
              bg-gradient-to-br from-purple-600/20 to-cyan-500/10 border border-purple-500/20">
              🎓
            </div>
            <p className="text-[#9CA3AF] text-sm">Ask your first question to start learning.</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-end gap-3 fade-in">
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm
              bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF]">✦</div>
            <Loader />
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* ── Bottom Input Bar ─────────────────────────────────── */}
      <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] bg-[#0B0F1A]/80 backdrop-blur-xl px-6 lg:px-16 py-4">

        {/* Quick Prompts */}
        <div className="flex gap-2 flex-wrap mb-3">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { setInput(p); textareaRef.current?.focus(); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#9CA3AF] cursor-pointer
                border border-[rgba(255,255,255,0.08)]
                hover:border-purple-500/40 hover:text-purple-300 hover:bg-purple-500/10
                transition-all duration-200"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Row */}
        <div className="input-ring flex items-end gap-3 rounded-2xl bg-[rgba(255,255,255,0.04)] px-4 py-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={`Ask anything about ${subjectName}…`}
            className="flex-1 bg-transparent text-sm text-[#E6EAF2] placeholder-[#4B5563]
              outline-none resize-none leading-relaxed"
            style={{ maxHeight: '140px', overflowY: 'auto' }}
          />

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white
              transition-all duration-200 font-bold text-lg
              ${!loading && input.trim()
                ? 'btn-gradient cursor-pointer'
                : 'bg-[rgba(255,255,255,0.06)] text-[#4B5563] cursor-not-allowed'
              }`}
          >
            {loading
              ? <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white"
                  style={{ animation: 'spin 0.8s linear infinite' }} />
              : <span className="text-base">↑</span>
            }
          </button>
        </div>

        <p className="text-center text-[10px] text-[#4B5563] mt-2.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
