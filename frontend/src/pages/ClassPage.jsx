import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClassPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0b14] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="w-full max-w-md text-center space-y-8 animate-fade-up">
        {/* Navigation / Header info */}
        <div className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Grade</span>
          <span className="text-indigo-400">&rarr;</span>
          <span className="text-slate-300">Class Select</span>
        </div>

        {/* Info card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-2xl mx-auto">
            🏫
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">12th Standard Selected</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your profile is configured for Grade 12 subjects. Continue to view available courses.
            </p>
          </div>

          <button
            onClick={() => navigate('/subjects')}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            Continue to Subjects
          </button>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-500 hover:text-slate-350 transition-colors font-medium flex items-center gap-1.5 mx-auto"
        >
          &larr; Go Back
        </button>
      </div>
    </div>
  );
}
