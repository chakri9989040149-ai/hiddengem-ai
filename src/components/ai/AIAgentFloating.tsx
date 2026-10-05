'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { processAgentCommand } from '@/lib/ai-service';
import { Bot, Send, X, Sparkles, MessageSquare, Minimize2, Maximize2 } from 'lucide-react';

export function AIAgentFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chatMessages,
    addChatMessage,
    activeTrip,
    preferences,
    updatePreferences,
    setActiveTrip,
  } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    addChatMessage({ sender: 'user', text: query });
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await processAgentCommand(query, activeTrip, preferences);

      // Apply state updates if requested by AI
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
          text: "I've reviewed your request. You can refine your itinerary by asking to reduce budget, add waterfalls, or shorten travel times.",
        });
        setIsTyping(false);
      }, 400);
    }
  };

  const samplePrompts = [
    'Make my trip cheaper',
    'Add a waterfall',
    'Reduce travel time',
    'Find vegetarian restaurants',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xl shadow-emerald-700/40 flex items-center gap-2.5 group hover:scale-105 active:scale-95 transition-all"
          title="Open HiddenGem AI Travel Assistant"
          aria-label="Open AI Travel Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-emerald-700 animate-pulse" />
          </div>
          <span className="font-extrabold text-xs hidden sm:inline tracking-wide">
            AI Travel Agent
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[600px] h-[550px] rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">HiddenGem AI Assistant</h3>
                <span className="text-[10px] text-emerald-200 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Itinerary & Logistics Copilot</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.actionTaken && (
                    <span className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      ✓ Action Executed: {msg.actionTaken}
                    </span>
                  )}
                  <span className="block text-[9px] opacity-60 text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 rounded-tl-none border border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Pills */}
          <div className="p-2 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-300 transition-colors font-medium"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI (e.g. 'Make my trip cheaper')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
