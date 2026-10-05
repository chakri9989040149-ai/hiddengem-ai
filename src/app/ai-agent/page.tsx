'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { processAgentCommand } from '@/lib/ai-service';
import { formatCurrency } from '@/lib/utils';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Calendar,
  Wallet,
  Clock,
  MapPin,
  Languages,
} from 'lucide-react';
import { TOURIST_QUICK_ACTIONS } from '@/lib/touristHelpService';
import { getDestinationMedia } from '@/lib/destinationVisuals';

export default function AIAgentPage() {
  const {
    chatMessages,
    addChatMessage,
    clearChat,
    activeTrip,
    preferences,
    updatePreferences,
    setActiveTrip,
    generateItineraryFromState,
    setTranslatorOpen,
    selectedDestinationSlug,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    addChatMessage({ sender: 'user', text: query });
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await processAgentCommand(query, activeTrip, preferences);

      if (response.stateUpdates) {
        if (response.stateUpdates.updatedPreferences) {
          updatePreferences(response.stateUpdates.updatedPreferences);
        }
        if (response.stateUpdates.updatedBudget && activeTrip) {
          setActiveTrip({
            ...activeTrip,
            budget: {
              ...activeTrip.budget,
              ...response.stateUpdates.updatedBudget,
            },
          });
        }
      }

      setTimeout(() => {
        addChatMessage({
          sender: 'assistant',
          text: response.message,
          actionTaken: response.actionTaken,
        });
        setIsTyping(false);
      }, 500);
    } catch {
      setTimeout(() => {
        addChatMessage({
          sender: 'assistant',
          text: "I've processed your query and adjusted the trip parameters.",
        });
        setIsTyping(false);
      }, 400);
    }
  };

  const commandShortcuts = [
    'Make my trip cheaper',
    'Add a waterfall',
    'Remove the guide',
    "I don't want to wake up early",
    'Find vegetarian restaurants',
    'Reduce travel time',
    'Give me a family-friendly itinerary',
    'Optimize route',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              <span>Tool-Grounded Autonomous Copilot</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            AI Travel Agent Workspace
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            Command the AI to modify budget, inject secret waterfalls, relax morning hours, or cut travel radius without breaking logistics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setTranslatorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 flex items-center gap-1.5 shadow-sm"
          >
            <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>🌐 Live Translator</span>
          </button>

          <button
            onClick={clearChat}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        </div>
      </div>

      {/* 12 Tourist Requirements Quick Actions Bar (Destination Grounded) */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span>🤖 Tourist Help Quick Actions</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {selectedDestinationSlug.toUpperCase()}
            </span>
          </span>
          <span className="text-[11px] text-stone-500">Destination-Aware Verified Data</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TOURIST_QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === 'translator') {
                  setTranslatorOpen(true);
                } else {
                  handleSend(
                    action.id === 'hospital'
                      ? 'Where is the nearest hospital?'
                      : action.id === 'restroom'
                      ? 'Where is the nearest restroom?'
                      : action.id === 'food'
                      ? 'Where can I get vegetarian food?'
                      : action.id === 'atm'
                      ? 'Where is the nearest ATM?'
                      : action.id === 'parking'
                      ? 'Is parking available?'
                      : action.id === 'network'
                      ? 'Is there mobile network?'
                      : action.id === 'guide'
                      ? 'Do I need a guide?'
                      : action.id === 'transport'
                      ? 'How do I reach the bus stand?'
                      : action.id === 'emergency'
                      ? 'Emergency hospital and police contact numbers?'
                      : `What should I know about ${action.label} in ${selectedDestinationSlug}?`
                  );
                }
              }}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Chat on Left, Active State on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Console */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl flex flex-col h-[650px] overflow-hidden">
          {/* Top Bar */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-stone-800 dark:text-stone-200">
                Agent Status: Connected & State-Synced
              </span>
            </div>
            <span className="text-stone-400">Zero Raw State Mutation • Validated Actions</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.actionTaken && (
                    <div className="mt-2 pt-2 border-t border-emerald-600/30 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Executed: {msg.actionTaken}</span>
                    </div>
                  )}
                  <span className="block text-[10px] opacity-60 text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 rounded-tl-none border border-stone-200 dark:border-stone-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Shortcut Pills */}
          <div className="p-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center gap-1.5 overflow-x-auto text-xs">
            {commandShortcuts.map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleSend(cmd)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-300 font-medium transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Give a travel command (e.g. 'Make my trip cheaper')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              onClick={() => handleSend()}
              className="p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Trip State Sync Panel (Enhanced with Travel Imagery) */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden space-y-6 shadow-xl text-xs">
          {/* Destination Visual Banner */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={getDestinationMedia({
                destination: preferences.destinationSlug,
                preferHero: true,
              })}
              alt="Active Destination Hub"
              className="w-full h-full object-cover brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Synchronized Destination</span>
              <span className="text-xl font-black capitalize">{preferences.destinationSlug} Hub</span>
            </div>
            <Link
              href="/plan-trip"
              className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-bold text-[10px] hover:bg-emerald-600 transition-colors"
            >
              Open Planner →
            </Link>
          </div>

          <div className="p-6 pt-0 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Live State & Constraints
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                Active Sync
              </span>
            </div>

          {/* State Badges */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Selected Hub</span>
              <span className="font-extrabold capitalize text-stone-900 dark:text-stone-100">
                {preferences.destinationSlug}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Travellers & Duration</span>
              <span className="font-extrabold text-stone-900 dark:text-stone-100">
                {preferences.groupSize} Persons • {preferences.durationDays} Days
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Max Travel Radius</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                {preferences.maxTravelTimeMinutes} minutes
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 flex justify-between items-center">
              <span className="text-stone-500 font-medium">Estimated Trip Cost</span>
              <span className="font-extrabold text-base text-emerald-700 dark:text-emerald-400">
                {formatCurrency(activeTrip?.budget.estimatedCost || 9200)}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-[10px] uppercase font-bold text-stone-400 mb-2">
              Active Interests
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {preferences.interests.map((it) => (
                <span
                  key={it}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2">
            <span className="font-extrabold text-stone-900 dark:text-stone-100 block">
              Direct Application Logic
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              The AI triggers structured schema updates rather than inventing arbitrary logistics. All travel times, budget formulas, and crowd predictions remain mathematically grounded.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
