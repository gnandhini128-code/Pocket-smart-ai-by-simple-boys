import React from 'react';
import { ActiveTab, FinancialSummary, MonthlyBudget, SavingsGoal, Transaction } from '../types/finance';
import { formatINR } from '../utils/financeCalculations';
import { CategorySpendingChart } from './CategorySpendingChart';
import { BudgetUtilizationCard } from './BudgetUtilizationCard';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  Plus,
  ArrowRight,
  Target,
  Sparkles,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface DashboardViewProps {
  summary: FinancialSummary;
  monthlyBudget: MonthlyBudget;
  goals: SavingsGoal[];
  recentTransactions: Transaction[];
  onOpenAddTransaction: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onAskAIQuestion: (question: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  monthlyBudget,
  goals,
  recentTransactions,
  onOpenAddTransaction,
  onNavigateTab,
  onAskAIQuestion,
}) => {
  const isBalanceNegative = summary.remainingBalance < 0;

  // Goals summary math
  const totalTargetGoals = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  const totalSavedGoals = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);
  const overallGoalsPercent = totalTargetGoals > 0
    ? Math.min(100, Math.round((totalSavedGoals / totalTargetGoals) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Day Scholar Student Financial Overview
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Monthly Allowance Tracker & Smart Budget</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-600 font-medium">Academic Year 2026</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onAskAIQuestion('Analyze my current spending and suggest where I can cut back')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Quick Analysis</span>
          </button>

          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm hover:shadow whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Negative Balance Emergency Alert (if applicable) */}
      {isBalanceNegative && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-sm text-rose-800">
              Negative Balance Warning: Expenses Exceed Total Income
            </p>
            <p className="mt-0.5 text-rose-700">
              Your expenses surpass your recorded income by{' '}
              <strong className="font-mono">{formatINR(Math.abs(summary.remainingBalance))}</strong>.
              Review your recent expenditures or ask the AI Advisor for an immediate budget adjustment plan.
            </p>
          </div>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Income */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Income</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {formatINR(summary.totalIncome)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{summary.incomeCount} credits</span>
            <span>·</span>
            <span>Monthly allowance & stipends</span>
          </p>
        </div>

        {/* Total Monthly Expenses */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {formatINR(summary.totalExpenses)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="text-rose-600 font-semibold">{summary.expenseCount} debits</span>
            <span>·</span>
            <span>Commute, food, books & bills</span>
          </p>
        </div>

        {/* Remaining Balance */}
        <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
          isBalanceNegative ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80 hover:border-slate-300'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Remaining Balance</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isBalanceNegative ? 'bg-rose-100 text-rose-700' : 'bg-teal-50 text-teal-600'
            }`}>
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            isBalanceNegative ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {formatINR(summary.remainingBalance)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isBalanceNegative ? (
              <span className="text-rose-600 font-semibold">Deficit mode</span>
            ) : (
              <span className="text-teal-700 font-semibold">Available disposable funds</span>
            )}
          </p>
        </div>

        {/* Savings Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Savings Rate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {summary.totalIncome > 0 ? `${summary.savingsRate}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {summary.totalIncome === 0 ? (
              'Add income to calculate rate'
            ) : summary.savingsRate >= 20 ? (
              <span className="text-emerald-600 font-semibold">Healthy student savings tier</span>
            ) : summary.savingsRate > 0 ? (
              <span className="text-amber-600 font-semibold">Moderate savings rate</span>
            ) : (
              <span className="text-rose-600 font-semibold">Zero savings buffer</span>
            )}
          </p>
        </div>
      </div>

      {/* Mid-Row: Category Spending Chart + Monthly Budget Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySpendingChart
          categoryTotals={summary.categoryTotals}
          totalExpenses={summary.totalExpenses}
        />

        <BudgetUtilizationCard
          monthlyBudget={monthlyBudget}
          totalExpenses={summary.totalExpenses}
          categoryTotals={summary.categoryTotals}
          onNavigateToBudget={() => onNavigateTab('budget')}
        />
      </div>

      {/* Bottom Grid: Recent Transactions + Savings Goals Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-900">
                Recent Transactions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {Math.min(5, recentTransactions.length)} of {recentTransactions.length} recorded entries
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-medium text-teal-600 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No transactions found. Click "Add Transaction" to record your first entry.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.slice(0, 5).map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isIncome ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t.description}</p>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          <span className="font-medium text-slate-600">{t.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-mono font-bold text-sm tabular-nums ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {isIncome ? `+${formatINR(t.amount)}` : `-${formatINR(t.amount)}`}
                      </p>
                      <span className="text-[10px] text-slate-400 capitalize">{t.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Savings Goals Snapshot (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-lg text-slate-900">
                  Savings Goals
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {goals.length} active target milestones
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('goals')}
                className="text-xs font-medium text-teal-600 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Overall Goals Progress Meter */}
            <div className="p-3.5 bg-slate-50 rounded-xl mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Combined Progress</span>
                <span className="font-mono font-bold text-teal-700">{overallGoalsPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallGoalsPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>Saved: {formatINR(totalSavedGoals)}</span>
                <span>Target: {formatINR(totalTargetGoals)}</span>
              </div>
            </div>

            {/* Top 2 Goals Mini Cards */}
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => {
                const percent = goal.targetAmount > 0
                  ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                  : 0;
                return (
                  <div key={goal.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800 truncate max-w-[180px]">{goal.name}</span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {formatINR(goal.currentAmount)} / {formatINR(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>{percent}% completed</span>
                      {goal.targetDate && <span>Target: {goal.targetDate}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('goals')}
              className="w-full py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Create / Add Funds to Goals</span>
            </button>
          </div>
        </div>

      </div>

      {/* Gemini AI Recommendation Prompt Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] to-[#0F2444] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
              Gemini 3.8 Flash Financial Intelligence
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            Need customized recommendations for your Day Scholar spending?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Get practical advice on optimizing your daily transit budget, campus canteen meals, and textbook costs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center shrink-0">
          <button
            onClick={() => onAskAIQuestion('How can I save more money as a day scholar?')}
            className="px-3 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-teal-300 rounded-lg border border-slate-700 transition-colors"
          >
            "How can I save more money?"
          </button>
          <button
            onClick={() => onAskAIQuestion('Suggest a realistic budget for next month based on my spending')}
            className="px-3 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-teal-300 rounded-lg border border-slate-700 transition-colors"
          >
            "Suggest next month's budget"
          </button>
          <button
            onClick={() => onNavigateTab('advisor')}
            className="px-4 py-2 text-xs font-bold text-[#0A192F] bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-sm"
          >
            Open AI Advisor
          </button>
        </div>
      </div>
    </div>
  );
};
