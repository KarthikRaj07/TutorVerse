import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

export default function ClassPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Glow blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6 scale-in">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-2">
          {['Grade', 'Subject', 'Chat'].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${
                i === 0 ? 'text-purple-400' : 'text-[#4B5563]'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === 0
                    ? 'bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF] text-white'
                    : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#4B5563]'
                }`}>{i + 1}</div>
                {step}
              </div>
              {i < 2 && <div className="w-8 h-px bg-[rgba(255,255,255,0.08)]" />}
            </React.Fragment>
          ))}
        </div>

        {/* Main card */}
        <GlassCard className="p-8 space-y-7"
          style={{ boxShadow: '0 0 0 1px rgba(124,92,255,0.15), 0 24px 64px rgba(0,0,0,0.5)' }}>

          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center text-4xl
            bg-gradient-to-br from-purple-600/20 to-cyan-500/10 border border-purple-500/20">
            🏫
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[#E6EAF2] tracking-tight">12th Standard</h1>
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs mx-auto">
              Your session is configured for Grade 12. Select a subject to begin your AI-guided learning.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />

          <GradientButton size="lg" onClick={() => navigate('/subjects')} className="w-full">
            Continue to Subjects →
          </GradientButton>
        </GlassCard>

        {/* Back link */}
        <div className="text-center">
          <button onClick={() => navigate('/')}
            className="text-xs text-[#4B5563] hover:text-[#9CA3AF] transition-colors duration-200 cursor-pointer">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
