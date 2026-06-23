import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0b14] relative overflow-hidden">
      {/* Background ambient lighting/glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md text-center space-y-8 animate-fade-up">
        {/* Logo/Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-4xl shadow-lg border border-indigo-400/20 shadow-indigo-500/15">
          🎓
        </div>

        {/* Hero Copy */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300">
            TutorVerse
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">
            AI-Powered Learning Assistant
          </p>
        </div>

        {/* Grade Selection Card */}
        <div 
          onClick={() => navigate('/class')}
          className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-indigo-500/50 p-8 rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        >
          {/* Subtle hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300"></div>

          <div className="relative space-y-4">
            <div className="text-3xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">📚</div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                12th Standard
              </h2>
              <p className="text-xs text-slate-450 mt-1">
                Access your specialized high-school tutoring syllabus
              </p>
            </div>
            <div className="text-xs text-indigo-400 font-bold tracking-wider uppercase group-hover:translate-x-1 inline-flex items-center gap-1 transition-all">
              Select Grade &rarr;
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-600 font-medium">
          TutorVerse v1.0 · Secured RAG Pipeline
        </div>
      </div>
    </div>
  );
}
