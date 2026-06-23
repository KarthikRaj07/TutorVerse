import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Background Effects ─────────────────────────────── */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      {/* Glow blobs */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.18) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-15%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0F1A]/80 pointer-events-none" />

      {/* ── Content ────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto space-y-8">

        {/* Badge */}
        <div className="fade-up flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px #34d399' }} />
          <span className="text-xs font-medium text-[#9CA3AF]">AI Tutor · Powered by RAG + Llama 3</span>
        </div>

        {/* Logo */}
        <div className="fade-up delay-100 float relative mx-auto">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl
            bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF]"
            style={{ boxShadow: '0 0 60px rgba(124,92,255,0.5), 0 0 120px rgba(0,212,255,0.2)' }}>
            🎓
          </div>
          {/* Outer ring */}
          <div className="absolute -inset-3 rounded-[32px] border border-purple-500/20 pointer-events-none" />
        </div>

        {/* Heading */}
        <div className="fade-up delay-200 space-y-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter gradient-text leading-[0.95]">
            TutorVerse
          </h1>
          <p className="text-xl md:text-2xl text-[#E6EAF2] font-medium">
            AI-Powered Learning Assistant
          </p>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto leading-relaxed">
            Study smarter with real-time AI guidance. RAG-augmented answers grounded in your syllabus.
            Built for 12th-grade students.
          </p>
        </div>

        {/* CTA */}
        <div className="fade-up delay-300 flex flex-col items-center gap-4 w-full max-w-xs">
          <GradientButton
            size="lg"
            onClick={() => navigate('/class')}
            className="w-full glow-pulse"
          >
            Start Learning →
          </GradientButton>
          <p className="text-xs text-[#4B5563]">No sign-up required · Free for students</p>
        </div>

        {/* Feature pills */}
        <div className="fade-up delay-400 flex flex-wrap justify-center gap-3">
          {[
            { icon: '⚡', label: 'Instant Answers' },
            { icon: '📚', label: 'Syllabus Grounded' },
            { icon: '🔒', label: 'Vector Search' },
            { icon: '🧠', label: 'Llama 3 Model' },
          ].map((f) => (
            <div key={f.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-[#9CA3AF] font-medium
                border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
