import React from 'react';

export default function Loader() {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-indigo-400"
            style={{ animation: `blink 1.2s ${delay}ms ease-in-out infinite` }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400 font-medium">Generating response…</span>
    </div>
  );
}
