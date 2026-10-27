import React from 'react';
import { ActiveTab } from '../types/finance';
import {
  Wallet,
  LayoutDashboard,
  ReceiptIndianRupee,
  PieChart,
  Target,
  Sparkles,
  RotateCcw,
  Database,
  Users,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onLoadDemo: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onLoadDemo,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A192F] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-[#0A192F] shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  GO SAVE
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  PocketSmart AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 mt-0.5">
                <span>Smart Budget & Recommendations</span>
                <span className="text-slate-600">·</span>
                <span className="text-teal-400 font-medium flex items-center gap-1">
                  <Users className="w-3 h-3 inline" /> Made by simple boys
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Links / Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('transactions')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ReceiptIndianRupee className="w-4 h-4" />
              <span>Transactions</span>
            </button>

            <button
              onClick={() => onTabChange('budget')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Budget Planner</span>
            </button>

            <button
              onClick={() => onTabChange('goals')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'goals'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Savings Goals</span>
            </button>

            <button
              onClick={() => onTabChange('advisor')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'advisor'
                  ? 'bg-teal-500 text-[#0A192F] shadow-sm font-bold'
                  : 'text-teal-300 hover:text-white hover:bg-teal-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Advisor</span>
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onLoadDemo}
              title="Load Day Scholar Commuter ₹10,000 Demo Data"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Load Demo</span>
            </button>

            <button
              onClick={onReset}
              title="Reset all financial data"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/30 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-[#0F2444] px-2 py-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'dashboard' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('transactions')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'transactions' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <ReceiptIndianRupee className="w-4 h-4 mb-0.5" />
          <span>Txns</span>
        </button>

        <button
          onClick={() => onTabChange('budget')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'budget' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <PieChart className="w-4 h-4 mb-0.5" />
          <span>Budget</span>
        </button>

        <button
          onClick={() => onTabChange('goals')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'goals' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Target className="w-4 h-4 mb-0.5" />
          <span>Goals</span>
        </button>

        <button
          onClick={() => onTabChange('advisor')}
          className={`flex flex-col items-center py-1 px-2 rounded ${
            activeTab === 'advisor' ? 'text-teal-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-teal-400" />
          <span>AI Chat</span>
        </button>
      </div>
    </header>
  );
};
