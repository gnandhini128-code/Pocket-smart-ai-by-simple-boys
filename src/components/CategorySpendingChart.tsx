import React, { useState } from 'react';
import { TransactionCategory } from '../types/finance';
import { CATEGORY_COLORS, formatINR } from '../utils/financeCalculations';
import { Tag } from 'lucide-react';

interface CategorySpendingChartProps {
  categoryTotals: Record<TransactionCategory, number>;
  totalExpenses: number;
}

export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({
  categoryTotals,
  totalExpenses,
}) => {
  const [activeCategory, setActiveCategory] = useState<TransactionCategory | null>(null);

  // Filter only categories with > 0 spending
  const activeEntries = (Object.entries(categoryTotals) as [TransactionCategory, number][])
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  if (totalExpenses === 0 || activeEntries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Tag className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">No Expenses Recorded</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          Add an expense transaction to see your category-wise spending distribution.
        </p>
      </div>
    );
  }

  // Calculate SVG Donut arcs
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const slices = activeEntries.map(([category, amount]) => {
    const percent = amount / totalExpenses;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercent * circumference);
    accumulatedPercent += percent;
    return {
      category,
      amount,
      percent: Math.round(percent * 1000) / 10,
      color: CATEGORY_COLORS[category]?.hex || '#64748B',
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-900">
            Category-wise Spending
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown across {activeEntries.length} active spending {activeEntries.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-slate-500">
          Total: {formatINR(totalExpenses)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* SVG Donut Chart */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {slices.map((slice) => (
                <circle
                  key={slice.category}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={activeCategory === slice.category ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveCategory(slice.category)}
                  onMouseLeave={() => setActiveCategory(null)}
                />
              ))}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {activeCategory ? activeCategory : 'Total Spent'}
              </span>
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {activeCategory
                  ? formatINR(categoryTotals[activeCategory] || 0)
                  : formatINR(totalExpenses)}
              </span>
              <span className="text-[10px] text-teal-600 font-semibold">
                {activeCategory
                  ? `${Math.round(((categoryTotals[activeCategory] || 0) / totalExpenses) * 100)}% of total`
                  : `${activeEntries.length} categories`}
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Progress List */}
        <div className="sm:col-span-7 space-y-3">
          {slices.map((slice) => {
            const isHovered = activeCategory === slice.category;
            return (
              <div
                key={slice.category}
                onMouseEnter={() => setActiveCategory(slice.category)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-50 ring-1 ring-slate-200' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="font-medium text-slate-800">{slice.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {formatINR(slice.amount)}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] w-10 text-right">
                      {slice.percent}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${slice.percent}%`,
                      backgroundColor: slice.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
