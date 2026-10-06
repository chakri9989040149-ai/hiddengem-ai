'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Users, Plus, Trash2, ArrowRightLeft, DollarSign } from 'lucide-react';

export function ExpenseSplitter() {
  const { expenses, addExpense, removeExpense, preferences } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Rohan');
  const [category, setCategory] = useState<'Stay' | 'Food' | 'Transport' | 'Tickets' | 'Misc'>('Food');

  const participants = ['Rohan', 'Priya', 'Ananya', 'Vikram'];
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonShare = Math.round(totalSpent / participants.length);

  // Calculate balances (Amount paid - Share)
  const paidTotals: Record<string, number> = {};
  participants.forEach((p) => (paidTotals[p] = 0));
  expenses.forEach((e) => {
    paidTotals[e.paidBy] = (paidTotals[e.paidBy] || 0) + e.amount;
  });

  const balances = participants.map((p) => ({
    name: p,
    paid: paidTotals[p] || 0,
    net: (paidTotals[p] || 0) - perPersonShare,
  }));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      title,
      amount: parseFloat(amount),
      paidBy,
      category,
      splitAmong: participants,
    });

    setTitle('');
    setAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">
            Group Travel Splitter
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
            Who Owes Whom
          </h3>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs shadow flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add Expense'}</span>
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40">
          <span className="text-[10px] text-stone-500 uppercase block font-medium">Total Group Spend</span>
          <span className="text-base font-extrabold text-stone-900 dark:text-stone-100">
            {formatCurrency(totalSpent)}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40">
          <span className="text-[10px] text-stone-500 uppercase block font-medium">Each Person Share</span>
          <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(perPersonShare)}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40">
          <span className="text-[10px] text-stone-500 uppercase block font-medium">Travel Crew</span>
          <span className="text-base font-extrabold text-stone-900 dark:text-stone-100">
            {participants.length} Travellers
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40">
          <span className="text-[10px] text-stone-500 uppercase block font-medium">Recorded Bills</span>
          <span className="text-base font-extrabold text-stone-900 dark:text-stone-100">
            {expenses.length} Entries
          </span>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
          <h4 className="text-xs font-bold uppercase text-stone-700 dark:text-stone-300">
            Record New Group Expense
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Expense title (e.g. Jeep Safari)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              required
            />
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium"
            >
              {participants.map((p) => (
                <option key={p} value={p}>
                  Paid by: {p}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium"
            >
              <option value="Stay">Stay</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Tickets">Tickets</option>
              <option value="Misc">Misc</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800"
          >
            Save Bill & Recalculate
          </button>
        </form>
      )}

      {/* Net Balances Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
          Individual Balances
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {balances.map((b) => (
            <div
              key={b.name}
              className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100">{b.name}</span>
                <span className="text-[11px] text-stone-400 block">
                  Paid: {formatCurrency(b.paid)}
                </span>
              </div>
              <div className="text-right">
                {b.net > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                    Gets back {formatCurrency(b.net)}
                  </span>
                ) : b.net < 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold text-[11px]">
                    Owes {formatCurrency(Math.abs(b.net))}
                  </span>
                ) : (
                  <span className="text-stone-400 font-medium">Settled Up</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
          Recorded Receipts
        </h4>
        <div className="space-y-2">
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3 rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{exp.title}</span>
                <span className="text-[11px] text-stone-500 block">
                  Paid by <strong>{exp.paidBy}</strong> • Category: {exp.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-stone-900 dark:text-stone-100">
                  {formatCurrency(exp.amount)}
                </span>
                <button
                  onClick={() => removeExpense(exp.id)}
                  className="text-stone-400 hover:text-rose-600 p-1"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
