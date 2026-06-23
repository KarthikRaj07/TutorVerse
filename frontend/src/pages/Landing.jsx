import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden font-sans">
      {/* Premium Glow and Aurora Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-700/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/15 rounded-full blur-[120px] -z-10" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

      {/* Decorative Floating Mesh Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70"></div>

      <div className="w-full max-w-lg text-center space-y-10 animate-fade-up relative z-10">
        {/* TutorVerse Header Brand */}
        <div className="space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-5xl shadow-2xl border border-indigo-400/30 shadow-indigo-500/20">
            {/* Spinning orbital glow ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-400 opacity-30 blur-md animate-pulse"></div>
            <span className="relative">🎓</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-cyan-300 drop-shadow-sm">
              TutorVerse
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-semibold tracking-widest uppercase">
              AI-Powered Learning Assistant
            </p>
          </div>
        </div>

        {/* Grade Selection Area */}
        <div className="space-y-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Select Class to Begin</p>
          
          <div 
            onClick={() => navigate('/class')}
            className="group relative bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 hover:border-indigo-500/60 p-8 rounded-[32px] shadow-2xl hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-all duration-500 transform hover:-translate-y-1.5 cursor-pointer overflow-hidden"
          >
            {/* Ambient card inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex flex-col items-center text-center space-y-4">
              {/* Card Icon */}
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                📚
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors duration-300">
                  12th Standard
                </h2>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Interactive AI-guided syllabus companion with active RAG mode context mapping.
                </p>
              </div>

              {/* Action indicators */}
              <div className="pt-2">
                <span className="text-xs text-cyan-400 font-bold tracking-wider uppercase group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  Launch Learning Portal 
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-600 font-bold tracking-wider uppercase select-none">
          SECURE VECTOR SEARCH · PINECONE RAG ENGINE
        </div>
      </div>
    </div>
  );
}
