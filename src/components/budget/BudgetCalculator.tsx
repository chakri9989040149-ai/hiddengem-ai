'use client';

import React from 'react';
import { CompleteTrip, UserPreferences } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet,
  PieChart,
  TrendingDown,
  Sparkles,
  Users,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface BudgetCalculatorProps {
  trip: CompleteTrip | null;
  preferences: UserPreferences;
}

export function BudgetCalculator({ trip, preferences }: BudgetCalculatorProps) {
  const totalBudget = preferences.totalBudgetInr || 10000;
  const estimatedCost = trip?.budget.estimatedCost || 9200;
  const remaining = Math.max(0, totalBudget - estimatedCost);
  const costPerPerson = Math.round(estimatedCost / Math.max(1, preferences.groupSize || 1));
  const percentUsed = Math.min(100, Math.round((estimatedCost / totalBudget) * 100));

  const breakdown = trip?.budget.breakdown || {
    transport: 3400,
    stay: 2600,
    food: 1800,
    localTransport: 600,
    guide: 0,
    activities: 500,
    emergencyBuffer: 300,
  };

  return (
    <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">
            Intelligent Budget Planner
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
            Journey Expense Allocation
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Within Target Limit</span>
        </div>
      </div>

      {/* Main Budget Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50">
          <span className="text-[11px] text-stone-500 uppercase block font-medium">Total Budget</span>
          <span className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
            {formatCurrency(totalBudget)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50">
          <span className="text-[11px] text-stone-500 uppercase block font-medium">Estimated Cost</span>
          <span className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(estimatedCost)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50">
          <span className="text-[11px] text-stone-500 uppercase block font-medium">Remaining Buffer</span>
          <span className="text-lg sm:text-xl font-extrabold text-sky-600 dark:text-sky-400">
            {formatCurrency(remaining)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50">
          <span className="text-[11px] text-stone-500 uppercase block font-medium">Per Person ({preferences.groupSize})</span>
          <span className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
            {formatCurrency(costPerPerson)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
          <span>Budget Utilized: {percentUsed}%</span>
          <span>{formatCurrency(remaining)} remaining</span>
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 90 ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Itemized Categories */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-stone-400">
          Category Cost Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between">
            <span className="text-stone-500">Stay / Resort:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(breakdown.stay)}</span>
          </div>
          <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between">
            <span className="text-stone-500">Transit & Fuel:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(breakdown.transport)}</span>
          </div>
          <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between">
            <span className="text-stone-500">Food & Dining:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(breakdown.food)}</span>
          </div>
          <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between">
            <span className="text-stone-500">Local Cab/Auto:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(breakdown.localTransport)}</span>
          </div>
          <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between">
            <span className="text-stone-500">Activity & Tickets:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(breakdown.activities)}</span>
          </div>
          <div className="p-3 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between">
            <span className="text-stone-500">Emergency Buffer:</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{formatCurrency(breakdown.emergencyBuffer)}</span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Callout */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <p className="text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
          <strong>AI Budget Insight:</strong> You have {formatCurrency(remaining)} unallocated buffer remaining. You can comfortably add an organic farm lunch or a guided pottery workshop without exceeding your budget!
        </p>
      </div>
    </div>
  );
}
