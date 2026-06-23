import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f172a]">

      {/* ── Ambient Background Blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* ── Grid Texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-10 max-w-2xl w-full">

        {/* Logo */}
        <div className="animate-fade-up animate-float">
          <div className="relative mx-auto w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee)',
              boxShadow: '0 0 60px rgba(99,102,241,0.4), 0 0 20px rgba(34,211,238,0.2)',
            }}>
            🎓
            {/* Orbital ring */}
            <div className="absolute -inset-2 rounded-[28px] border border-indigo-500/30" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight gradient-text leading-none">
            TutorVerse
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium">
            AI-Powered Learning Assistant
          </p>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Harness the power of RAG-augmented AI for a personalized, 
            exam-ready learning experience tailored to your grade.
          </p>
        </div>

        {/* CTA Card */}
        <div className="w-full max-w-sm animate-fade-up" style={{ animationDelay: '160ms' }}>
          <button
            onClick={() => navigate('/class')}
            className="group w-full relative overflow-hidden rounded-2xl p-[1px] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee)',
            }}
          >
            {/* Inner card */}
            <div className="relative w-full bg-[#0f172a] rounded-2xl px-8 py-6 flex flex-col items-center gap-3 group-hover:bg-slate-900 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📚</span>
                <div className="text-left">
                  <div className="text-white font-bold text-lg leading-tight">12th Standard</div>
                  <div className="text-slate-400 text-xs mt-0.5">Board exam syllabus · 2 subjects</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold gradient-text group-hover:gap-3 transition-all duration-300">
                Start Learning
                <span className="text-cyan-400">→</span>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-8 animate-fade-up" style={{ animationDelay: '240ms' }}>
          {[
            { label: 'AI Powered', icon: '⚡' },
            { label: 'Vector RAG', icon: '🔍' },
            { label: 'Real-time', icon: '🚀' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
