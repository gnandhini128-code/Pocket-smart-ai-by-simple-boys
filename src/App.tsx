import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  ChatMessage,
  MonthlyBudget,
  SavingsGoal,
  Transaction,
  TransactionCategory,
  TransactionType,
} from './types/finance';
import {
  INITIAL_DEMO_BUDGET,
  INITIAL_DEMO_GOALS,
  INITIAL_DEMO_TRANSACTIONS,
} from './data/demoData';
import { calculateFinancialSummary } from './utils/financeCalculations';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { SavingsGoalsView } from './components/SavingsGoalsView';
import { AIAdvisorView } from './components/AIAdvisorView';
import { TransactionModal } from './components/TransactionModal';
import { Footer } from './components/Footer';
import { RotateCcw, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'gosave_student_finance_v1';

export default function App() {
  // Primary State loaded from localStorage with initial demo fallback
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_txns`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return INITIAL_DEMO_TRANSACTIONS;
  });

  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Number(parsed.totalLimit) > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load budget from localStorage', e);
    }
    return INITIAL_DEMO_BUDGET;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load goals from localStorage', e);
    }
    return INITIAL_DEMO_GOALS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_chat`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load chat from localStorage', e);
    }
    return [];
  });

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [pendingAIQuestion, setPendingAIQuestion] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_txns`, JSON.stringify(transactions));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_budget`, JSON.stringify(monthlyBudget));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [monthlyBudget]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_chat`, JSON.stringify(chatMessages));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [chatMessages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Authoritative financial calculations
  const financialSummary = useMemo(() => {
    return calculateFinancialSummary(transactions);
  }, [transactions]);

  // Modal Openers
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleOpenEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsTransactionModalOpen(true);
  };

  // Unified Save / Add Handler
  const handleSaveTransactionFromModal = (data: {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string;
    notes?: string;
  }) => {
    if (editingTransaction) {
      const updated: Transaction = {
        ...editingTransaction,
        ...data,
      };
      setTransactions((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      showToast(`Updated "${data.description}"`);
    } else {
      const newTxn: Transaction = {
        ...data,
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setTransactions((prev) => [newTxn, ...prev]);
      showToast(`Recorded "${data.description}" (₹${data.amount})`);
    }

    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed.');
  };

  // Budget Actions
  const handleUpdateBudget = (newBudget: MonthlyBudget) => {
    setMonthlyBudget(newBudget);
    showToast('Budget ceilings updated.');
  };

  // Savings Goals Actions
  const handleAddGoal = (newGoalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast(`Goal "${newGoal.name}" created!`);
  };

  const handleEditGoal = (updatedGoal: SavingsGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );
    showToast(`Goal "${updatedGoal.name}" updated.`);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal removed.');
  };

  const handleUpdateGoalAmount = (id: string, newAmount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentAmount: newAmount } : g))
    );
    showToast('Goal balance updated.');
  };

  // AI Advisor Action (Calls server-side `/api/ai/advisor`)
  const handleSendAIMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAILoading(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          financialSummary,
          categoryTotals: financialSummary.categoryTotals,
          budgetLimits: monthlyBudget.categoryLimits,
          savingsGoals: goals,
          advisorStyle: 'Practical Advisor with category breakdown and smart cutbacks',
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        text: data.answer || data.fallbackAnswer || 'No response returned from the advisory engine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || 'gemini-3.5-flash-lite',
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Advisor network error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        text: `Unable to reach the Gemini advisory service: ${err?.message || 'Network error'}. Please verify your connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAILoading(false);
    }
  };

  // Quick prompt trigger from Dashboard
  const handleAskAIQuestion = (question: string) => {
    setActiveTab('advisor');
    setPendingAIQuestion(question);
    handleSendAIMessage(question);
  };

  // Reset to Demo Data
  const handleLoadDemoData = () => {
    setTransactions(INITIAL_DEMO_TRANSACTIONS);
    setMonthlyBudget(INITIAL_DEMO_BUDGET);
    setGoals(INITIAL_DEMO_GOALS);
    setChatMessages([]);
    showToast('Day Scholar Commuter ₹10,000 demo data loaded!');
  };

  // Clear all data
  const handleResetAllData = () => {
    setTransactions([]);
    setMonthlyBudget({
      totalLimit: 5000,
      categoryLimits: {
        Food: 1500,
        Travel: 1000,
        Education: 1000,
        Shopping: 500,
        Bills: 500,
        Health: 250,
        Entertainment: 250,
        Other: 0,
      },
    });
    setGoals([]);
    setChatMessages([]);
    setIsResetConfirmOpen(false);
    showToast('All financial data reset to empty canvas.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Add/Edit Transaction Modal (accessible everywhere) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSaveTransactionFromModal}
        editingTransaction={editingTransaction}
      />

      {/* Primary Top Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoadDemo={handleLoadDemoData}
        onReset={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={financialSummary}
            monthlyBudget={monthlyBudget}
            goals={goals}
            recentTransactions={transactions}
            onOpenAddTransaction={handleOpenAddModal}
            onNavigateTab={setActiveTab}
            onAskAIQuestion={handleAskAIQuestion}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            onOpenAddTransaction={handleOpenAddModal}
            onOpenEditTransaction={handleOpenEditModal}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlannerView
            monthlyBudget={monthlyBudget}
            categoryTotals={financialSummary.categoryTotals}
            totalExpenses={financialSummary.totalExpenses}
            totalIncome={financialSummary.totalIncome}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {activeTab === 'goals' && (
          <SavingsGoalsView
            goals={goals}
            onAddGoal={handleAddGoal}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onUpdateGoalAmount={handleUpdateGoalAmount}
          />
        )}

        {activeTab === 'advisor' && (
          <AIAdvisorView
            summary={financialSummary}
            monthlyBudget={monthlyBudget}
            goals={goals}
            messages={chatMessages}
            onSendMessage={handleSendAIMessage}
            isLoading={isAILoading}
            onClearChat={() => {
              setChatMessages([]);
              showToast('Chat history cleared.');
            }}
            initialQuestion={pendingAIQuestion}
          />
        )}
      </main>

      {/* Global Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">
              Reset Application Data?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Choose whether to reset to an empty state or reload the Day Scholar Commuter (₹10,000) sample dataset for your viva demonstration.
            </p>
            <div className="flex flex-col gap-2 mt-5">
              <button
                onClick={handleLoadDemoData}
                className="w-full py-2.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors"
              >
                Reload Day Scholar Demo Data (₹10k)
              </button>
              <button
                onClick={handleResetAllData}
                className="w-full py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Clear Everything (Empty Slate)
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Simple Boys Attribution */}
      <Footer />
    </div>
  );
}
