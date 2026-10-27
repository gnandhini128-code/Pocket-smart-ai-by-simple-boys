import React, { useState, useEffect } from 'react';
import { MonthlyBudget, TransactionCategory } from '../types/finance';
import { ALL_CATEGORIES, CATEGORY_COLORS, evaluateBudget, formatINR } from '../utils/financeCalculations';
import {
  PieChart,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Info,
  Plus,
  Minus,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface BudgetPlannerViewProps {
  monthlyBudget: MonthlyBudget;
  categoryTotals: Record<TransactionCategory, number>;
  totalExpenses: number;
  totalIncome: number;
  onUpdateBudget: (newBudget: MonthlyBudget) => void;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  monthlyBudget,
  categoryTotals,
  totalExpenses,
  totalIncome,
  onUpdateBudget,
}) => {
  // Local string state for smooth typing without cursor jumping or zero-snapping
  const [totalLimitInput, setTotalLimitInput] = useState<string>(() =>
    String(monthlyBudget.totalLimit || 9000)
  );

  const [categoryInputs, setCategoryInputs] = useState<Record<TransactionCategory, string>>(() => {
    const initial: Record<string, string> = {};
    for (const cat of ALL_CATEGORIES) {
      initial[cat] = String(monthlyBudget.categoryLimits?.[cat] ?? 0);
    }
    return initial as Record<TransactionCategory, string>;
  });

  const [isSaved, setIsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync with prop when external parent changes (e.g. Load Demo Data)
  useEffect(() => {
    setTotalLimitInput(String(monthlyBudget.totalLimit || 9000));
    const nextInputs: Record<string, string> = {};
    for (const cat of ALL_CATEGORIES) {
      nextInputs[cat] = String(monthlyBudget.categoryLimits?.[cat] ?? 0);
    }
    setCategoryInputs(nextInputs as Record<TransactionCategory, string>);
    setHasUnsavedChanges(false);
  }, [monthlyBudget]);

  // Quick total limit adjustments (+/- 500)
  const adjustTotalLimit = (delta: number) => {
    const current = Math.max(0, parseInt(totalLimitInput.replace(/,/g, ''), 10) || 0);
    const updated = Math.max(0, current + delta);
    setTotalLimitInput(String(updated));
    setHasUnsavedChanges(true);
  };

  // Quick category adjustments (+/- 100)
  const adjustCategoryLimit = (cat: TransactionCategory, delta: number) => {
    const current = Math.max(0, parseInt(categoryInputs[cat]?.replace(/,/g, '') || '0', 10) || 0);
    const updated = Math.max(0, current + delta);
    setCategoryInputs((prev) => ({
      ...prev,
      [cat]: String(updated),
    }));
    setHasUnsavedChanges(true);
  };

  const handleTotalChange = (val: string) => {
    setTotalLimitInput(val);
    setHasUnsavedChanges(true);
  };

  const handleCategoryChange = (cat: TransactionCategory, val: string) => {
    setCategoryInputs((prev) => ({
      ...prev,
      [cat]: val,
    }));
    setHasUnsavedChanges(true);
  };

  // Commit & Save
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTotal = Math.max(0, parseInt(totalLimitInput.replace(/,/g, ''), 10) || 0);

    const cleanCategoryLimits: Record<TransactionCategory, number> = {} as any;
    for (const cat of ALL_CATEGORIES) {
      const parsed = Math.max(0, parseInt(categoryInputs[cat]?.replace(/,/g, '') || '0', 10) || 0);
      cleanCategoryLimits[cat] = parsed;
    }

    onUpdateBudget({
      totalLimit: cleanTotal,
      categoryLimits: cleanCategoryLimits,
    });

    setIsSaved(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Presets
  const applyPreset = (presetType: 'dayScholar' | 'frugal') => {
    if (presetType === 'dayScholar') {
      const presetTotal = 9000;
      const presetCats: Record<TransactionCategory, number> = {
        Food: 2800,
        Travel: 2000,
        Education: 2000,
        Shopping: 1200,
        Bills: 1000,
        Health: 500,
        Entertainment: 800,
        Other: 500,
      };
      setTotalLimitInput(String(presetTotal));
      const strMap: Record<string, string> = {};
      for (const [k, v] of Object.entries(presetCats)) strMap[k] = String(v);
      setCategoryInputs(strMap as any);
      onUpdateBudget({ totalLimit: presetTotal, categoryLimits: presetCats });
    } else {
      const presetTotal = 7500;
      const presetCats: Record<TransactionCategory, number> = {
        Food: 2200,
        Travel: 1800,
        Education: 1500,
        Shopping: 600,
        Bills: 800,
        Health: 300,
        Entertainment: 400,
        Other: 300,
      };
      setTotalLimitInput(String(presetTotal));
      const strMap: Record<string, string> = {};
      for (const [k, v] of Object.entries(presetCats)) strMap[k] = String(v);
      setCategoryInputs(strMap as any);
      onUpdateBudget({ totalLimit: presetTotal, categoryLimits: presetCats });
    }
    setIsSaved(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Parsed numerical values for live calculations
  const parsedTotalLimit = Math.max(0, parseInt(totalLimitInput.replace(/,/g, ''), 10) || 0);
  const overall = evaluateBudget(totalExpenses, parsedTotalLimit);

  let sumCategoryLimits = 0;
  for (const cat of ALL_CATEGORIES) {
    sumCategoryLimits += Math.max(0, parseInt(categoryInputs[cat]?.replace(/,/g, '') || '0', 10) || 0);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Monthly Budget Planner
            </h2>
            {hasUnsavedChanges && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Unsaved Edits
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Set total and category-level spending ceilings. Live warning badges trigger at 80% and 100%.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('dayScholar')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Caps (₹9k)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm whitespace-nowrap ${
              hasUnsavedChanges
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Caps Saved!' : hasUnsavedChanges ? 'Save Changes *' : 'Save Budget'}</span>
          </button>
        </div>
      </div>

      {/* Success banner */}
      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your monthly total and category budget caps have been saved and synced across all dashboard charts!</span>
        </div>
      )}

      {/* Presets Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-teal-600" />
          One-Click Student Budget Presets:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('dayScholar')}
            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium border border-teal-200 transition-colors"
          >
            Day Scholar Commuter (₹9,000)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('frugal')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Strict Frugal Saver (₹7,500)
          </button>
        </div>
      </div>

      {/* Overall Budget vs Monthly Income Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Monthly Cap */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Monthly Total Budget Cap
          </span>
          <div className="relative mt-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-base">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={totalLimitInput}
              onChange={(e) => handleTotalChange(e.target.value)}
              className="w-full pl-8 pr-20 py-2.5 text-xl font-bold font-mono text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            {/* Quick Step Buttons */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => adjustTotalLimit(-500)}
                className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs"
                title="-₹500"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => adjustTotalLimit(500)}
                className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-xs"
                title="+₹500"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Total Allowance: <strong className="font-mono text-slate-700">{formatINR(totalIncome)}</strong>
          </p>
        </div>

        {/* Current Total Spending Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Total Spent So Far
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {formatINR(totalExpenses)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className={overall.status === 'danger' ? 'text-rose-600 font-bold' : 'text-slate-600'}>
              {overall.percent}% utilized
            </span>
            <span>
              {overall.status === 'danger' ? (
                <span className="text-rose-600 font-semibold">Exceeded by {formatINR(overall.overAmount)}</span>
              ) : (
                <span className="text-teal-700 font-medium">{formatINR(overall.remaining)} left</span>
              )}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overall.status === 'danger'
                  ? 'bg-rose-500'
                  : overall.status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, overall.percent)}%` }}
            />
          </div>
        </div>

        {/* Category Caps Sum */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Sum of Category Allocations
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
              {formatINR(sumCategoryLimits)}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {sumCategoryLimits > parsedTotalLimit
                ? 'Sum of category caps exceeds your overall monthly ceiling.'
                : 'Allocations are well-balanced within your overall ceiling.'}
            </span>
          </p>
        </div>
      </div>

      {/* Category Budget Limits Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-900">
              Category-Wise Budget Ceilings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set realistic caps for each student expense bucket. Use the +/- buttons or type directly.
            </p>
          </div>
          {hasUnsavedChanges && (
            <button
              onClick={() => handleSave()}
              className="text-xs font-bold px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
            >
              Save Now
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_CATEGORIES.map((cat) => {
            const spent = Number(categoryTotals[cat]) || 0;
            const limit = Math.max(0, parseInt(categoryInputs[cat]?.replace(/,/g, '') || '0', 10) || 0);
            const evalCat = evaluateBudget(spent, limit);
            const catStyle = CATEGORY_COLORS[cat];

            let statusBadge = (
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Nominal ({evalCat.percent}%)
              </span>
            );

            if (evalCat.status === 'danger') {
              statusBadge = (
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Exceeded ({evalCat.percent}%)
                </span>
              );
            } else if (evalCat.status === 'warning') {
              statusBadge = (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Near Limit ({evalCat.percent}%)
                </span>
              );
            }

            return (
              <div
                key={cat}
                className={`p-4 rounded-xl border transition-all ${
                  evalCat.status === 'danger'
                    ? 'border-rose-300 bg-rose-50/10'
                    : evalCat.status === 'warning'
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: catStyle.hex }}
                    />
                    <span className="font-semibold text-slate-900 text-sm">{cat}</span>
                  </div>
                  {statusBadge}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      evalCat.status === 'danger'
                        ? 'bg-rose-500'
                        : evalCat.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min(100, evalCat.percent)}%` }}
                  />
                </div>

                {/* Numbers Row */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-3">
                  <div>
                    <span>Spent: </span>
                    <strong className="text-slate-900 tabular-nums">{formatINR(spent)}</strong>
                  </div>
                  <div>
                    {evalCat.status === 'danger' ? (
                      <span className="text-rose-600 font-bold">
                        +{formatINR(evalCat.overAmount)} over limit
                      </span>
                    ) : (
                      <span className="text-teal-700">
                        {formatINR(evalCat.remaining)} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Limit input with quick increment buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <label className="text-[11px] text-slate-500 font-medium">Budget Cap:</label>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustCategoryLimit(cat, -100)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                      title="-₹100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={categoryInputs[cat] || '0'}
                        onChange={(e) => handleCategoryChange(cat, e.target.value)}
                        className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-right"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => adjustCategoryLimit(cat, 100)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                      title="+₹100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasUnsavedChanges && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleSave()}
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save and Apply All Budget Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
