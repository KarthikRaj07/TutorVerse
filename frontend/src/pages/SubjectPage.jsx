import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubjectPage() {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'computer_science',
      title: 'Computer Science',
      icon: '💻',
      desc: 'Python programming, databases, networking, RAG pipelines, and search concepts.',
      color: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'group-hover:border-indigo-500/50',
      badge: 'Interactive Lab',
    },
    {
      id: 'english',
      title: 'English & Literature',
      icon: '📖',
      desc: 'Comprehension, essays, vocabulary study, text reading, and language structure.',
      color: 'from-purple-500/10 via-pink-500/5 to-transparent',
      borderColor: 'group-hover:border-pink-500/50',
      badge: 'Prose & Poetry',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0b14] relative overflow-hidden">
      {/* Dynamic ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-3xl space-y-8 animate-fade-up">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Grade 12</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-slate-300">Choose Subject</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">Which subject are we studying?</h1>
          <p className="text-xs text-slate-400">Select a course to start a learning session with your AI tutor.</p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/chat/${sub.id}`)}
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Colored gradient backdrop on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 -z-10`}></div>
              
              {/* Dynamic border on hover */}
              <div className={`absolute inset-0 border border-transparent rounded-3xl transition-all duration-300 ${sub.borderColor} -z-10`}></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{sub.icon}</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-450 border border-slate-700/50 font-bold tracking-wide uppercase">
                    {sub.badge}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {sub.title}
                  </h2>
                  <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Start Session &rarr;
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <button
          onClick={() => navigate('/class')}
          className="text-xs text-slate-500 hover:text-slate-350 transition-colors font-medium flex items-center gap-1.5 mx-auto mt-4"
        >
          &larr; Change Grade
        </button>
      </div>
    </div>
  );
}
