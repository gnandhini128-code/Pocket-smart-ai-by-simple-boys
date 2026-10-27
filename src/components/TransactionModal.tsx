import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../types/finance';
import { ALL_CATEGORIES } from '../utils/financeCalculations';
import {
  TrendingDown,
  TrendingUp,
  X,
  AlertCircle,
  Plus,
  Check,
  Calendar,
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (txnData: {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string;
    notes?: string;
  }) => void;
  editingTransaction?: Transaction | null;
}

const QUICK_SUGGESTIONS: Record<TransactionType, string[]> = {
  expense: [
    'Metro Monthly Pass',
    'College Canteen Lunch',
    'Textbooks & Xerox',
    'Mobile Data Recharge',
    'Study Group Chai & Snacks',
    'Course Project Binding',
  ],
  income: [
    'Monthly College Allowance',
    'Pocket Money from Home',
    'Internship Stipend',
    'Merit Scholarship',
    'Freelance Project Credit',
  ],
};

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Synchronize form when editingTransaction or isOpen changes
  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description || '');
      setAmount(String(editingTransaction.amount || ''));
      setType(editingTransaction.type || 'expense');
      setCategory(editingTransaction.category || 'Food');
      setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
      setNotes(editingTransaction.notes || '');
      setError('');
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setError('');
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmountStr = String(amount).replace(/,/g, '').trim();
    const parsedAmount = parseFloat(cleanAmountStr);

    if (!description.trim()) {
      setError('Please provide a short description for the transaction.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount (e.g. ₹250).');
      return;
    }

    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    onSubmit({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const handleSuggestionClick = (sug: string) => {
    setDescription(sug);
    // Auto-pick sensible category
    if (sug.includes('Metro') || sug.includes('Bus') || sug.includes('Transit')) {
      setCategory('Travel');
    } else if (sug.includes('Canteen') || sug.includes('Lunch') || sug.includes('Chai')) {
      setCategory('Food');
    } else if (sug.includes('Textbook') || sug.includes('Xerox') || sug.includes('Project')) {
      setCategory('Education');
    } else if (sug.includes('Recharge') || sug.includes('Data')) {
      setCategory('Bills');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {editingTransaction ? 'Update financial ledger record' : 'Keep your student budget updated in real-time'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  if (category === 'Other') setCategory('Food');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  type === 'expense'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Expense (-)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('Other');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  type === 'income'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Income (+)</span>
              </button>
            </div>
          </div>

          {/* Quick Suggestions Pills */}
          {!editingTransaction && (
            <div>
              <span className="block text-[11px] font-medium text-slate-500 mb-1">
                Quick Student Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS[type].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 border border-slate-200 transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Metro monthly pass, Canteen lunch, Project records..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              required
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount in Indian Rupees (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-base">
                ₹
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="e.g. 450"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-base font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Additional memo, purpose, or receipt details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm"
            >
              {editingTransaction ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
