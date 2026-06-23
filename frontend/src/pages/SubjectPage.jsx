import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubjectPage() {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'computer_science',
      title: 'Computer Science',
      icon: '💻',
      desc: 'Master Python coding, relational databases, data structures, network security, and AI models.',
      color: 'from-blue-600/10 via-indigo-600/5 to-transparent',
      hoverGlow: 'hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]',
      borderColor: 'group-hover:border-blue-500/50',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badge: 'Interactive Lab',
    },
    {
      id: 'english',
      title: 'English & Literature',
      icon: '📖',
      desc: 'Analyze prose, classical literature, advanced vocabulary, syntax structure, and reading comprehension.',
      color: 'from-fuchsia-600/10 via-pink-600/5 to-transparent',
      hoverGlow: 'hover:shadow-[0_0_50px_rgba(217,70,239,0.15)]',
      borderColor: 'group-hover:border-fuchsia-500/50',
      badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
      badge: 'Prose & Poetry',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden font-sans">
      {/* Background glow filters */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[130px] -z-10"></div>
      
      {/* Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>

      <div className="w-full max-w-4xl space-y-10 animate-fade-up relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Grade 12</span>
            <span className="text-slate-650">&rarr;</span>
            <span className="text-slate-350">Choose Subject</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">Which subject are we studying?</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Select a specialized subject course to initiate a secure vector-assisted learning session.</p>
        </div>

        {/* Subjects Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/chat/${sub.id}`)}
              className={`group relative bg-slate-900/30 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-[32px] shadow-2xl ${sub.hoverGlow} transition-all duration-500 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden`}
            >
              {/* Inner card glow/shade */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity duration-500 -z-10`}></div>
              
              {/* Colored border on hover */}
              <div className={`absolute inset-0 border border-transparent rounded-[32px] transition-all duration-500 ${sub.borderColor} -z-10`}></div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-md">
                    {sub.icon}
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full border font-bold tracking-widest uppercase ${sub.badgeColor} shadow-sm`}>
                    {sub.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors duration-300">
                    {sub.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-850 text-xs font-bold text-indigo-400 tracking-widest uppercase flex items-center gap-1.5 group-hover:text-indigo-300 transition-colors">
                Initialize Learning Portal 
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate('/class')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-semibold flex items-center gap-1.5 mx-auto active:scale-95 cursor-pointer"
        >
          &larr; Change Grade
        </button>
      </div>
    </div>
  );
}
