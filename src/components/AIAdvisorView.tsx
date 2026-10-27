import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FinancialSummary, MonthlyBudget, SavingsGoal } from '../types/finance';
import { formatINR } from '../utils/financeCalculations';
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AIAdvisorViewProps {
  summary: FinancialSummary;
  monthlyBudget: MonthlyBudget;
  goals: SavingsGoal[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  initialQuestion?: string;
}

const PRESET_QUESTIONS = [
  'How can I save more money as a day scholar?',
  'Which category has my highest spending and how can I cut back?',
  'Suggest a realistic budget for next month based on my actual spending',
  'How can I reduce my shopping and food expenses?',
  'Give me a weekly saving plan to reach my goals faster',
];

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  summary,
  monthlyBudget,
  goals,
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  initialQuestion,
}) => {
  const [inputText, setInputText] = useState(initialQuestion || '');
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    setInputText('');
    await onSendMessage(text.trim());
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Gemini AI Financial Advisor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Practical student budgeting & personalized saving advice</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContextDrawer(!showContextDrawer)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>{showContextDrawer ? 'Hide Financial Context' : 'Inspect Context Data'}</span>
            {showContextDrawer ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Clear conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Inspect Financial Context Drawer */}
      {showContextDrawer && (
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 text-xs font-mono space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-teal-400 font-sans font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Authoritative Calculated Context Passed to Gemini:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">100% Deterministic (Zero AI Math Hallucination)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block">Total Income:</span>
              <strong className="text-white text-sm">{formatINR(summary.totalIncome)}</strong>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block">Total Expenses:</span>
              <strong className="text-white text-sm">{formatINR(summary.totalExpenses)}</strong>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block">Remaining Balance:</span>
              <strong className="text-teal-300 text-sm">{formatINR(summary.remainingBalance)}</strong>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block">Savings Rate:</span>
              <strong className="text-white text-sm">{summary.savingsRate}%</strong>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-1 font-sans font-semibold">Active Category Spending:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {Object.entries(summary.categoryTotals).map(([cat, amt]) => (
                <div key={cat} className="bg-slate-800/40 px-2 py-1.5 rounded border border-slate-700/60 flex justify-between">
                  <span>{cat}:</span>
                  <span className="text-teal-300 font-bold">{formatINR(amt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
          Suggested Questions for your Day Scholar Budget:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-left text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 transition-all disabled:opacity-50"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col min-h-[460px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-xs font-semibold text-slate-800">
              GO SAVE Intelligent Session
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Educational advice only · Not financial warranty
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[500px]">
          {messages.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Ask GO SAVE Anything About Your Finances
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gemini will inspect your current monthly income (₹10,000), breakdown of commute, canteen, and textbooks expenses, and provide tailored ways to save.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleSend(PRESET_QUESTIONS[0])}
                  className="text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                >
                  "How can I save more money?"
                </button>
                <button
                  onClick={() => handleSend(PRESET_QUESTIONS[1])}
                  className="text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                >
                  "Which category has the highest spending?"
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-teal-500 text-[#0A192F] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs space-y-1.5 ${
                    isAssistant
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                      : 'bg-[#0A192F] text-white'
                  }`}>
                    <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-teal-600">
                        {isAssistant ? 'GO SAVE Assistant (Gemini)' : 'You'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap leading-relaxed text-xs">
                      {msg.text}
                    </div>

                    {isAssistant && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Distinct from calculated financial balances</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-teal-600 transition-colors"
                        >
                          {copiedId === msg.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-[#0A192F] flex items-center justify-center shrink-0 font-bold">
                AI
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-2.5 text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Analyzing your financial records and drafting actionable advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your student budget, food costs, transit passes..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm text-xs"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
