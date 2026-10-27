export type TransactionCategory =
  | 'Food'
  | 'Travel'
  | 'Education'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Entertainment'
  | 'Other';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  notes?: string;
}

export interface MonthlyBudget {
  totalLimit: number;
  categoryLimits: Record<TransactionCategory, number>;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  notes?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  savingsRate: number;
  categoryTotals: Record<TransactionCategory, number>;
  incomeCount: number;
  expenseCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model?: string;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'budget' | 'goals' | 'advisor';
