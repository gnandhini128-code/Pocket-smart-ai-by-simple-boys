import React, { useState } from 'react';
import { SavingsGoal } from '../types/finance';
import { evaluateGoal, formatINR } from '../utils/financeCalculations';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  Coins,
  X,
  AlertCircle,
  PiggyBank,
  ArrowUpRight,
} from 'lucide-react';

interface SavingsGoalsViewProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalAmount: (id: string, newAmount: number) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  goals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onUpdateGoalAmount,
}) => {
  // Modal states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formCurrent, setFormCurrent] = useState('0');
  const [formDate, setFormDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Quick Deposit/Withdraw modal
  const [fundGoal, setFundGoal] = useState<SavingsGoal | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundAction, setFundAction] = useState<'add' | 'withdraw'>('add');
  const [fundError, setFundError] = useState('');

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetGoalForm = () => {
    setFormName('');
    setFormTarget('');
    setFormCurrent('0');
    setFormDate('');
    setFormNotes('');
    setFormError('');
    setEditingGoal(null);
  };

  const openCreateModal = () => {
    resetGoalForm();
    setIsGoalModalOpen(true);
  };

  const openEditModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setFormName(goal.name);
    setFormTarget(String(goal.targetAmount));
    setFormCurrent(String(goal.currentAmount));
    setFormDate(goal.targetDate || '');
    setFormNotes(goal.notes || '');
    setFormError('');
    setIsGoalModalOpen(true);
  };

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(formTarget);
    const current = parseFloat(formCurrent) || 0;

    if (!formName.trim()) {
      setFormError('Please enter a goal name.');
      return;
    }
    if (isNaN(target) || target <= 0) {
      setFormError('Target amount must be a positive number.');
      return;
    }
    if (current < 0) {
      setFormError('Current saved amount cannot be negative.');
      return;
    }

    if (editingGoal) {
      onEditGoal({
        ...editingGoal,
        name: formName.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: formDate,
        notes: formNotes.trim() || undefined,
      });
    } else {
      onAddGoal({
        name: formName.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: formDate,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsGoalModalOpen(false);
    resetGoalForm();
  };

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundGoal) return;

    const cleanStr = String(fundAmount).replace(/,/g, '').trim();
    const amount = parseFloat(cleanStr);
    if (isNaN(amount) || amount <= 0) {
      setFundError('Please enter a valid positive contribution amount.');
      return;
    }

    const currentSaved = Number(fundGoal.currentAmount) || 0;
    let newAmount = currentSaved;
    if (fundAction === 'add') {
      newAmount += amount;
    } else {
      if (amount > currentSaved) {
        setFundError(`Cannot withdraw more than current saved amount (${formatINR(currentSaved)}).`);
        return;
      }
      newAmount -= amount;
    }

    onUpdateGoalAmount(fundGoal.id, newAmount);
    setFundGoal(null);
    setFundAmount('');
    setFundError('');
  };

  const totalTargetAll = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  const totalSavedAll = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);
  const totalRemainingAll = Math.max(0, totalTargetAll - totalSavedAll);
  const overallPercent = totalTargetAll > 0 ? Math.round((totalSavedAll / totalTargetAll) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Savings Goals Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Build funds for semester certifications, system upgrades, and student emergency buffers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm hover:shadow whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Aggregate Overview Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] to-[#0F2444] rounded-2xl p-6 text-white shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider">
              Total Saved Towards Goals
            </span>
            <div className="text-3xl font-bold font-mono mt-1 text-white tabular-nums">
              {formatINR(totalSavedAll)}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Across {goals.length} target milestones
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Remaining to Reach Targets
            </span>
            <div className="text-2xl font-bold font-mono mt-1 text-teal-200 tabular-nums">
              {formatINR(totalRemainingAll)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total Target: {formatINR(totalTargetAll)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">Overall Milestone Progress</span>
              <span className="font-mono font-bold text-teal-300">{overallPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Goals Cards Grid */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-800">No Savings Goals Yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first savings target—such as a semester certification fee, hardware purchase, or travel budget.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const evalG = evaluateGoal(goal.currentAmount, goal.targetAmount);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        evalG.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-50 text-teal-700'
                      }`}>
                        {evalG.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm leading-tight">{goal.name}</h4>
                        {goal.targetDate && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> Target: {goal.targetDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100"
                        title="Edit goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(goal.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Saved vs Target Figures */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <div>
                        <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                          {formatINR(goal.currentAmount)}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          of {formatINR(goal.targetAmount)}
                        </span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${
                        evalG.isCompleted ? 'text-emerald-600' : 'text-teal-700'
                      }`}>
                        {evalG.percent}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          evalG.isCompleted ? 'bg-emerald-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${evalG.percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
                      {evalG.isCompleted ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Milestone Achieved!
                        </span>
                      ) : (
                        <span>Remaining: {formatINR(evalG.remaining)}</span>
                      )}
                    </div>
                  </div>

                  {goal.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl mt-3 line-clamp-2">
                      {goal.notes}
                    </p>
                  )}
                </div>

                {/* Quick Add / Withdraw Funds Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setFundGoal(goal);
                      setFundAmount('');
                      setFundAction('add');
                      setFundError('');
                    }}
                    className="w-full py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Deposit / Withdraw Funds</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Goal Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-center text-slate-900">Delete Goal?</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Are you sure you want to delete this savings goal? Any saved funds progress will be removed from your dashboard.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setDeletingId(null)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deletingId) {
                    onDeleteGoal(deletingId);
                    setDeletingId(null);
                  }
                }}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit / Withdraw Funds Modal */}
      {fundGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Update Goal Savings</h3>
                <p className="text-xs text-slate-500">{fundGoal.name}</p>
              </div>
              <button
                onClick={() => setFundGoal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {fundError && (
              <div className="mb-3 p-2 bg-rose-50 text-rose-700 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fundError}</span>
              </div>
            )}

            <form onSubmit={handleFundSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFundAction('add')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    fundAction === 'add' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setFundAction('withdraw')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    fundAction === 'withdraw' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Withdraw (-)
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Amount in ₹
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="50"
                    min="1"
                    placeholder="e.g. 500"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Current Saved: {formatINR(fundGoal.currentAmount)}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFundGoal(null)}
                  className="w-1/2 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  {fundAction === 'add' ? 'Add Deposit' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
              </h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Goal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Certification Voucher, Laptop RAM Upgrade"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="100"
                      min="1"
                      placeholder="e.g. 5000"
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Current Saved (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      placeholder="e.g. 1500"
                      value={formCurrent}
                      onChange={(e) => setFormCurrent(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Purpose / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Why is this goal important? Any milestones or deadline details..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
