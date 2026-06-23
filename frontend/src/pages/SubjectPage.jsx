import React from 'react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = [
  {
    id: 'computer_science',
    icon: '💻',
    title: 'Computer Science',
    desc: 'Python, data structures, databases, networking, OS concepts and more.',
    tag: 'Programming & Systems',
    gradient: 'from-indigo-600 via-blue-600 to-cyan-500',
    glow: 'rgba(99,102,241,0.3)',
    border: 'rgba(99,102,241,0.4)',
  },
  {
    id: 'english',
    icon: '📖',
    title: 'English Literature',
    desc: 'Prose, poetry, grammar, comprehension, essay writing and vocabulary.',
    tag: 'Language & Literature',
    gradient: 'from-fuchsia-600 via-purple-600 to-indigo-500',
    glow: 'rgba(168,85,247,0.3)',
    border: 'rgba(168,85,247,0.4)',
  },
];

export default function SubjectPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f172a] px-6 py-12">

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-700/15 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-10">

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Grade 12 · Choose a Subject
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            What are we <span className="gradient-text">studying today?</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Select your subject to start an AI-guided learning session with real-time vector search.
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBJECTS.map((sub, i) => (
            <button
              key={sub.id}
              onClick={() => navigate(`/chat/${sub.id}`)}
              className="group relative text-left rounded-3xl p-[1px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-up"
              style={{
                animationDelay: `${i * 100}ms`,
                background: `linear-gradient(135deg, ${sub.border}, rgba(255,255,255,0.05))`,
                boxShadow: `0 0 0 0 ${sub.glow}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 50px ${sub.glow}`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 0 ${sub.glow}`}
            >
              {/* Card body */}
              <div className="w-full h-full bg-[#111827] rounded-[23px] p-7 space-y-6 group-hover:bg-[#131f35] transition-colors duration-300">

                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${sub.glow}, rgba(255,255,255,0.05))`, border: `1px solid ${sub.border}` }}
                  >
                    {sub.icon}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: `${sub.glow}20`, color: '#94a3b8', border: `1px solid ${sub.border}` }}
                  >
                    {sub.tag}
                  </span>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-200">
                    {sub.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{sub.desc}</p>
                </div>

                {/* Footer */}
                <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${sub.gradient} bg-clip-text`}
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Start Session
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 inline-block" style={{ WebkitTextFillColor: '#22d3ee' }}>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Back */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => navigate('/class')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer"
          >
            ← Change Grade
          </button>
        </div>
      </div>
    </div>
  );
}
