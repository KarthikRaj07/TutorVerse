import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClassPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f172a] px-6">

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 animate-scale-in">

        {/* Breadcrumb */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Grade Selection
          </div>
        </div>

        {/* Glass Card */}
        <div className="glass rounded-3xl p-8 space-y-8 shadow-2xl"
          style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.2), 0 20px 60px rgba(0,0,0,0.4)' }}>

          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
            🏫
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">12th Standard</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your learning session is configured for Grade 12. Access curated AI-assisted study modules.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* CTA Button */}
          <button
            onClick={() => navigate('/subjects')}
            className="btn-primary w-full py-4 rounded-2xl text-white font-bold text-base cursor-pointer"
          >
            Continue to Subjects →
          </button>
        </div>

        {/* Back */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
