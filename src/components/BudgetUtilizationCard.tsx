import React from 'react';
import { MonthlyBudget, TransactionCategory } from '../types/finance';
import { evaluateBudget, formatINR } from '../utils/financeCalculations';
import { AlertTriangle, CheckCircle2, ChevronRight, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface BudgetUtilizationCardProps {
  monthlyBudget: MonthlyBudget;
  totalExpenses: number;
  categoryTotals: Record<TransactionCategory, number>;
  onNavigateToBudget: () => void;
}

export const BudgetUtilizationCard: React.FC<BudgetUtilizationCardProps> = ({
  monthlyBudget,
  totalExpenses,
  categoryTotals,
  onNavigateToBudget,
}) => {
  const { totalLimit, categoryLimits } = monthlyBudget;
  const overall = evaluateBudget(totalExpenses, totalLimit);

  // Check category warnings (exceeded or >=80%)
  const categoryAlerts: Array<{
    category: TransactionCategory;
    spent: number;
    limit: number;
    percent: number;
    status: 'warning' | 'danger';
  }> = [];

  for (const [category, limit] of Object.entries(categoryLimits) as [TransactionCategory, number][]) {
    if (limit > 0) {
      const spent = categoryTotals[category] || 0;
      const evalCat = evaluateBudget(spent, limit);
      if (evalCat.status === 'warning' || evalCat.status === 'danger') {
        categoryAlerts.push({
          category,
          spent,
          limit,
          percent: evalCat.percent,
          status: evalCat.status,
        });
      }
    }
  }

  // Bar color based on status
  let barColor = 'bg-teal-500';
  let badgeColor = 'bg-teal-50 text-teal-700 border-teal-200';
  let statusText = 'Well within budget';

  if (overall.status === 'danger') {
    barColor = 'bg-rose-500';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    statusText = 'Budget limit exceeded!';
  } else if (overall.status === 'warning') {
    barColor = 'bg-amber-500';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    statusText = 'Approaching monthly limit';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-lg text-slate-900">
              Monthly Budget Utilization
            </h3>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {statusText}
            </span>
          </div>

          <button
            onClick={onNavigateToBudget}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 group"
          >
            <span>Adjust</span>
            <SlidersHorizontal className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        {/* Progress Bar & Figures */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {formatINR(totalExpenses)}
              </span>
              <span className="text-xs text-slate-500 ml-1.5">
                spent of {formatINR(totalLimit)} limit
              </span>
            </div>
            <span className="text-sm font-bold font-mono text-slate-700">
              {overall.percent}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.min(100, overall.percent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-mono">
            {overall.status === 'danger' ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Over by {formatINR(overall.overAmount)}
              </span>
            ) : (
              <span className="text-teal-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                Remaining: {formatINR(overall.remaining)}
              </span>
            )}
            <span>Limit: {formatINR(totalLimit)}</span>
          </div>
        </div>

        {/* Category Alerts Section */}
        {categoryAlerts.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Category Budget Alerts ({categoryAlerts.length})
            </p>
            <div className="space-y-1.5">
              {categoryAlerts.map((alert) => (
                <div
                  key={alert.category}
                  className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                    alert.status === 'danger'
                      ? 'bg-rose-50 text-rose-800 border border-rose-100'
                      : 'bg-amber-50 text-amber-800 border border-amber-100'
                  }`}
                >
                  <span className="font-medium">
                    {alert.category}: {alert.percent}% cap
                  </span>
                  <span className="font-mono tabular-nums">
                    {formatINR(alert.spent)} / {formatINR(alert.limit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Set category caps in the Budget Planner</span>
        <button
          onClick={onNavigateToBudget}
          className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center gap-0.5"
        >
          View Planner <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
