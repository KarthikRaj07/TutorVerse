import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center space-x-2 py-3 px-4 bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-2xl w-max animate-pulse">
      <div className="flex space-x-1.5">
        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-xs text-slate-400 font-medium ml-2">TutorVerse is thinking...</span>
    </div>
  );
}
