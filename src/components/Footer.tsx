import React from 'react';
import { Heart, ShieldCheck, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 text-sm">
              GO SAVE
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">
              PocketSmart AI: Your Smart Budget & Recommendation Assistant
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Made with pride by <strong className="text-teal-700 font-semibold">simple boys</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] text-center md:text-right">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Deterministic financial math · Educational prototype for College Viva</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Disclaimer: Recommendations provided by the Gemini AI assistant are for educational planning purposes only and do not constitute formal certified financial advice.
        </div>
      </div>
    </footer>
  );
};
