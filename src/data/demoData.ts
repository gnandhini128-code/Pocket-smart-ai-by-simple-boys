import { MonthlyBudget, SavingsGoal, Transaction } from '../types/finance';

// Helper to get formatted dates in current month
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');

function getDate(day: number): string {
  return `${year}-${month}-${String(day).padStart(2, '0')}`;
}

export const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Monthly College Allowance & Pocket Money',
    amount: 10000,
    type: 'income',
    category: 'Other',
    date: getDate(1),
    notes: 'Direct monthly transfer from parents for semester expenses & commute',
  },
  {
    id: 'tx-2',
    description: 'Metro Student Monthly Smart Card Recharge',
    amount: 1450,
    type: 'expense',
    category: 'Travel',
    date: getDate(2),
    notes: 'Daily commute between residence and college campus',
  },
  {
    id: 'tx-3',
    description: 'College Canteen Lunch & Afternoon Chai',
    amount: 1800,
    type: 'expense',
    category: 'Food',
    date: getDate(5),
    notes: 'Subsidized campus meals and student refreshments',
  },
  {
    id: 'tx-4',
    description: 'Engineering Textbooks & Laboratory Manuals',
    amount: 1200,
    type: 'expense',
    category: 'Education',
    date: getDate(8),
    notes: 'Semester textbooks purchased with student bookstore discount',
  },
  {
    id: 'tx-5',
    description: 'Project Printouts, Color Charts & Spiral Binding',
    amount: 450,
    type: 'expense',
    category: 'Education',
    date: getDate(12),
    notes: 'Submission records and seminar documentation xerox',
  },
  {
    id: 'tx-6',
    description: 'Mobile 5G Data Pack & Unlimited Calling',
    amount: 699,
    type: 'expense',
    category: 'Bills',
    date: getDate(14),
    notes: 'Monthly telecommunication connectivity for coursework and research',
  },
  {
    id: 'tx-7',
    description: 'Study Group Evening Snacks & Coffee',
    amount: 650,
    type: 'expense',
    category: 'Food',
    date: getDate(18),
    notes: 'Snacks during mid-term preparation study circle',
  },
  {
    id: 'tx-8',
    description: 'College Backpack & Scientific Calculator Accessories',
    amount: 850,
    type: 'expense',
    category: 'Shopping',
    date: getDate(20),
    notes: 'Stationery refills, replacement graph sheets, and organizer',
  },
  {
    id: 'tx-9',
    description: 'Weekend Movie Ticket & Popcorn with Batchmates',
    amount: 500,
    type: 'expense',
    category: 'Entertainment',
    date: getDate(22),
    notes: 'Recreational student matinee show',
  },
];

export const INITIAL_DEMO_BUDGET: MonthlyBudget = {
  totalLimit: 9000,
  categoryLimits: {
    Food: 2800,
    Travel: 2000,
    Education: 2000,
    Shopping: 1200,
    Bills: 1000,
    Health: 500,
    Entertainment: 800,
    Other: 500,
  },
};

export const INITIAL_DEMO_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Campus Placement & Certification Exam Fee',
    targetAmount: 5000,
    currentAmount: 2400,
    targetDate: `${year}-12-15`,
    notes: 'AWS Certified Cloud Practitioner student voucher',
  },
  {
    id: 'goal-2',
    name: 'Laptop RAM & SSD Upgrade Fund',
    targetAmount: 3500,
    currentAmount: 1800,
    targetDate: `${year}-11-30`,
    notes: 'Boost system speed for coding IDEs and data simulations',
  },
  {
    id: 'goal-3',
    name: 'Emergency Student Contingency Fund',
    targetAmount: 4000,
    currentAmount: 1500,
    targetDate: `${year + 1}-01-20`,
    notes: 'Reserved for unexpected travel or medical expenses',
  },
];
