import React from 'react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = [
  {
    id: 'computer_science',
    icon: '💻',
    title: 'Computer Science',
    desc: 'Python, algorithms, data structures, databases, networking, and OS fundamentals.',
    topics: ['Python', 'DSA', 'Networks', 'DBMS', 'OS'],
    accent: '#7C5CFF',
    gradientFrom: 'rgba(124,92,255,0.2)',
    gradientTo: 'rgba(59,130,246,0.1)',
    borderHover: 'rgba(124,92,255,0.5)',
    glowColor: 'rgba(124,92,255,0.25)',
  },
  {
    id: 'english',
    icon: '📖',
    title: 'English Literature',
    desc: 'Prose, poetry, grammar, reading comprehension, and essay writing techniques.',
    topics: ['Prose', 'Poetry', 'Grammar', 'Essays', 'Vocabulary'],
    accent: '#00D4FF',
    gradientFrom: 'rgba(0,212,255,0.15)',
    gradientTo: 'rgba(6,182,212,0.08)',
    borderHover: 'rgba(0,212,255,0.5)',
    glowColor: 'rgba(0,212,255,0.2)',
  },
];

export default function SubjectPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">

      {/* Glow blobs */}
      <div className="absolute top-[-5%] left-[20%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.14) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-5%] right-[15%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl space-y-12">

        {/* Header */}
        <div className="text-center space-y-4 fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#9CA3AF]
            border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
            Grade 12 · Choose Your Subject
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#E6EAF2]">
            What are we{' '}
            <span className="gradient-text">studying today?</span>
          </h1>
          <p className="text-[#9CA3AF] max-w-md mx-auto text-base leading-relaxed">
            Pick a subject to start your AI-assisted learning session.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBJECTS.map((sub, i) => (
            <button
              key={sub.id}
              onClick={() => navigate(`/chat/${sub.id}`)}
              className={`group text-left rounded-2xl p-px cursor-pointer fade-up transition-all duration-300
                hover:scale-[1.02] hover:-translate-y-1`}
              style={{
                animationDelay: `${i * 120}ms`,
                background: `linear-gradient(135deg, ${sub.borderHover}, rgba(255,255,255,0.06))`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 50px ${sub.glowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Inner card */}
              <div className="w-full h-full rounded-[15px] p-7 flex flex-col gap-6 transition-colors duration-300"
                style={{
                  background: 'linear-gradient(135deg, #111827 0%, #0f1a2e 100%)',
                }}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0
                    transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${sub.gradientFrom}, ${sub.gradientTo})`,
                      border: `1px solid ${sub.borderHover}`,
                    }}>
                    {sub.icon}
                  </div>

                  {/* Topic pills */}
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {sub.topics.slice(0, 3).map((t) => (
                      <span key={t} className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{
                          background: `${sub.gradientFrom}`,
                          color: sub.accent,
                          border: `1px solid ${sub.borderHover}`,
                        }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-[#E6EAF2] tracking-tight
                    group-hover:gradient-text transition-all duration-200">
                    {sub.title}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">{sub.desc}</p>
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between mt-auto pt-2
                  border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-xs font-semibold tracking-wide" style={{ color: sub.accent }}>
                    Start Session
                  </span>
                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: sub.accent }}>→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Back */}
        <div className="text-center fade-up delay-300">
          <button onClick={() => navigate('/class')}
            className="text-xs text-[#4B5563] hover:text-[#9CA3AF] transition-colors duration-200 cursor-pointer">
            ← Change Grade
          </button>
        </div>
      </div>
    </div>
  );
}
