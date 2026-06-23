import React from 'react';

export default function Loader() {
  return (
    <div className="bubble-ai inline-flex items-center gap-3 px-5 py-3.5">
      <div className="flex items-center gap-1.5">
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-purple-400"
            style={{ animation: `blink 1.4s ${delay}ms ease-in-out infinite` }}
          />
        ))}
      </div>
      <span className="text-xs text-[#9CA3AF] font-medium tracking-wide">AI is thinking…</span>
    </div>
  );
}
