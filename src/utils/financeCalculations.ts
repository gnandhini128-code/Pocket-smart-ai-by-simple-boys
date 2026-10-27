import { FinancialSummary, Transaction, TransactionCategory } from '../types/finance';

export const ALL_CATEGORIES: TransactionCategory[] = [
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
];

export const CATEGORY_COLORS: Record<TransactionCategory, { bg: string; text: string; hex: string; lightBg: string }> = {
  Food: { bg: 'bg-amber-500', text: 'text-amber-700', hex: '#F59E0B', lightBg: 'bg-amber-50' },
  Travel: { bg: 'bg-teal-500', text: 'text-teal-700', hex: '#0D9488', lightBg: 'bg-teal-50' },
  Education: { bg: 'bg-blue-600', text: 'text-blue-700', hex: '#2563EB', lightBg: 'bg-blue-50' },
  Shopping: { bg: 'bg-purple-500', text: 'text-purple-700', hex: '#8B5CF6', lightBg: 'bg-purple-50' },
  Bills: { bg: 'bg-indigo-500', text: 'text-indigo-700', hex: '#6366F1', lightBg: 'bg-indigo-50' },
  Health: { bg: 'bg-emerald-500', text: 'text-emerald-700', hex: '#10B981', lightBg: 'bg-emerald-50' },
  Entertainment: { bg: 'bg-rose-500', text: 'text-rose-700', hex: '#F43F5E', lightBg: 'bg-rose-50' },
  Other: { bg: 'bg-slate-500', text: 'text-slate-700', hex: '#64748B', lightBg: 'bg-slate-100' },
};

/**
 * Deterministically computes the financial summary from transaction records.
 * Robust against case-insensitivity ('income' vs 'Income') and string vs number amounts.
 */
export function calculateFinancialSummary(transactions: Transaction[]): FinancialSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  const categoryTotals: Record<TransactionCategory, number> = {
    Food: 0,
    Travel: 0,
    Education: 0,
    Shopping: 0,
    Bills: 0,
    Health: 0,
    Entertainment: 0,
    Other: 0,
  };

  if (Array.isArray(transactions)) {
    for (const t of transactions) {
      if (!t) continue;
      // Handle numeric and string amounts safely (e.g. "1000", "10,000", 1000)
      const rawAmt = typeof t.amount === 'string' ? String(t.amount).replace(/,/g, '') : t.amount;
      const val = Math.max(0, Number(rawAmt) || 0);

      // Robust check for income regardless of capitalization
      const isIncome = String(t.type || '').trim().toLowerCase() === 'income';

      if (isIncome) {
        totalIncome += val;
        incomeCount++;
      } else {
        totalExpenses += val;
        expenseCount++;

        // Robust category matching
        const matchedCategory = ALL_CATEGORIES.find(
          (c) => c.toLowerCase() === String(t.category || '').trim().toLowerCase()
        ) || 'Other';

        categoryTotals[matchedCategory] += val;
      }
    }
  }

  const remainingBalance = totalIncome - totalExpenses;
  let savingsRate = 0;
  if (totalIncome > 0) {
    // When remaining balance is positive, calculate positive savings rate
    // When remaining balance is negative, savings rate is 0 (or negative rate)
    const rawRate = (remainingBalance / totalIncome) * 100;
    savingsRate = Math.round(rawRate * 10) / 10;
  }

  return {
    totalIncome,
    totalExpenses,
    remainingBalance,
    savingsRate,
    categoryTotals,
    incomeCount,
    expenseCount,
  };
}

/**
 * Formats a number into Indian Rupee representation (e.g. ₹10,000, -₹2,450)
 */
export function formatINR(amount: number): string {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const absAmount = Math.abs(num);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

/**
 * Evaluates budget status and utilization percentage
 */
export function evaluateBudget(spent: number, limit: number): {
  percent: number;
  status: 'nominal' | 'warning' | 'danger';
  remaining: number;
  overAmount: number;
} {
  const numSpent = Math.max(0, Number(spent) || 0);
  const numLimit = Math.max(0, Number(limit) || 0);

  if (numLimit <= 0) {
    if (numSpent > 0) {
      return { percent: 100, status: 'danger', remaining: 0, overAmount: numSpent };
    }
    return { percent: 0, status: 'nominal', remaining: 0, overAmount: 0 };
  }

  const rawPercent = (numSpent / numLimit) * 100;
  const percent = Math.round(rawPercent * 10) / 10;
  const remaining = Math.max(0, numLimit - numSpent);
  const overAmount = Math.max(0, numSpent - numLimit);

  let status: 'nominal' | 'warning' | 'danger' = 'nominal';
  if (percent >= 100) {
    status = 'danger';
  } else if (percent >= 80) {
    status = 'warning';
  }

  return { percent, status, remaining, overAmount };
}

/**
 * Evaluates savings goal completion progress
 */
export function evaluateGoal(current: number, target: number): {
  percent: number;
  remaining: number;
  isCompleted: boolean;
} {
  const numCurrent = Math.max(0, Number(current) || 0);
  const numTarget = Math.max(0, Number(target) || 0);

  if (numTarget <= 0) {
    return { percent: 100, remaining: 0, isCompleted: true };
  }
  const rawPercent = (numCurrent / numTarget) * 100;
  const percent = Math.min(100, Math.max(0, Math.round(rawPercent * 10) / 10));
  const remaining = Math.max(0, numTarget - numCurrent);
  const isCompleted = numCurrent >= numTarget;

  return { percent, remaining, isCompleted };
}
