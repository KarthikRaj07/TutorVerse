import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClassPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[-15%] w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[100px] -z-10"></div>
      
      {/* Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>

      <div className="w-full max-w-md text-center space-y-8 animate-fade-up relative z-10">
        {/* Navigation Breadcrumb Indicator */}
        <div className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>Grade Selection</span>
          <span className="text-indigo-400">&rarr;</span>
          <span className="text-indigo-400">Class Config</span>
        </div>

        {/* Card Component */}
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-[32px] shadow-2xl space-y-8 relative overflow-hidden">
          {/* Decorative interior design card element */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl"></div>

          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-4xl mx-auto shadow-inner">
            🏫
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">12th Standard</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              You are accessing high-school curriculum materials. This session is optimized for RAG retrieval on 12th board standards.
            </p>
          </div>

          <button
            onClick={() => navigate('/subjects')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300 transform active:scale-95 cursor-pointer font-sans"
          >
            Continue to Subjects
          </button>
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-semibold flex items-center gap-1.5 mx-auto active:scale-95 cursor-pointer"
        >
          &larr; Back to Landing
        </button>
      </div>
    </div>
  );
}
