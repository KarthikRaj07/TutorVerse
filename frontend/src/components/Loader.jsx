import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center space-x-3 py-3.5 px-5 bg-slate-900/60 backdrop-blur-2xl border border-indigo-500/10 rounded-2xl w-max shadow-lg animate-pulse">
      <div className="flex space-x-1.5 items-center">
        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2.5 h-2.5 bg-indigo-500/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest select-none">
        Generating Answer
      </span>
    </div>
  );
}
