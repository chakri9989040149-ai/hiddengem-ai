'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  SUPPORTED_LANGUAGES,
  translateTravelText,
  speakTranslatedText,
} from '@/lib/translationService';
import { speechService } from '@/lib/speechService';
import {
  Globe,
  Mic,
  MicOff,
  Volume2,
  ArrowRightLeft,
  X,
  Send,
  Sparkles,
  Users,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export function LiveTravelTranslatorModal() {
  const { isTranslatorOpen, setTranslatorOpen } = useAppStore();

  const [mode, setMode] = useState<'quick' | 'conversation'>('conversation');
  const [sourceLang, setSourceLang] = useState('te'); // Default: Telugu
  const [targetLang, setTargetLang] = useState('ml'); // Default: Malayalam
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Conversation history
  const [conversation, setConversation] = useState<
    Array<{
      speaker: 'you' | 'local';
      originalText: string;
      translatedText: string;
      sourceLang: string;
      targetLang: string;
      time: string;
    }>
  >([
    {
      speaker: 'you',
      originalText: 'ఈ ప్రదేశానికి ఎలా వెళ్లాలి?',
      translatedText: 'ഈ സ്ഥലത്തേക്ക് എങ്ങനെ പോകാം?',
      sourceLang: 'te',
      targetLang: 'ml',
      time: 'Just now',
    },
    {
      speaker: 'local',
      originalText: 'മുന്നോട്ട് പോയി ഇടത്തോട്ട് തിരിയുക.',
      translatedText: 'ముందుకు వెళ్లి ఎడమవైపు తిరగండి. (Go straight and turn left)',
      sourceLang: 'ml',
      targetLang: 'te',
      time: 'Just now',
    },
  ]);

  if (!isTranslatorOpen) return null;

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText('');
    setTranslatedText('');
  };

  const handleTranslate = async (textToTranslate?: string, speaker: 'you' | 'local' = 'you') => {
    const text = (textToTranslate || inputText).trim();
    if (!text) return;

    setIsTranslating(true);
    const src = speaker === 'you' ? sourceLang : targetLang;
    const tgt = speaker === 'you' ? targetLang : sourceLang;

    try {
      const result = await translateTravelText(text, src, tgt);
      setTranslatedText(result);

      // Add to conversation thread
      setConversation((prev) => [
        ...prev,
        {
          speaker,
          originalText: text,
          translatedText: result,
          sourceLang: src,
          targetLang: tgt,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Automatically speak the translation
      speakTranslatedText(result, tgt);
      setInputText('');
    } catch {
      setStatusMessage('Translation service unavailable. Please check spelling.');
    } finally {
      setIsTranslating(false);
    }
  };

  const startVoiceInput = (speaker: 'you' | 'local' = 'you') => {
    const lang = speaker === 'you' ? sourceLang : targetLang;
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    setStatusMessage(`Listening in ${langObj?.name}... Speak clearly into your mic.`);
    setIsListening(true);

    speechService.startListening(
      langObj?.speechCode || 'en-IN',
      (transcript) => {
        setIsListening(false);
        setStatusMessage(`Captured: "${transcript}"`);
        handleTranslate(transcript, speaker);
      },
      (error) => {
        setIsListening(false);
        setStatusMessage(error);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const stopVoiceInput = () => {
    speechService.stopListening();
    setIsListening(false);
    setStatusMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-emerald-950/20 via-sky-950/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/90 text-white flex items-center justify-center shadow-md">
              <Globe className="w-5 h-5 animate-spin [animation-duration:12s]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  🌐 Live Travel Translator
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                  Interstate Mode
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Bidirectional Speech &amp; Text translation for travellers exploring Indian states
              </p>
            </div>
          </div>

          <button
            onClick={() => setTranslatorOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selectors Bar */}
        <div className="p-3 sm:p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between gap-2 text-xs font-bold">
          <div className="flex-1">
            <span className="text-[10px] text-stone-400 uppercase font-extrabold block mb-1">
              I Speak (Traveller)
            </span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-extrabold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="mt-4 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 shadow-sm transition-all"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
          </button>

          <div className="flex-1">
            <span className="text-[10px] text-stone-400 uppercase font-extrabold block mb-1">
              Translate To (Local)
            </span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-extrabold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
          {conversation.map((c, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl text-xs sm:text-sm space-y-1 shadow-sm ${
                c.speaker === 'you'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 ml-4'
                  : 'bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 mr-4'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold opacity-75">
                <span className="uppercase">
                  {c.speaker === 'you' ? '👤 Traveller (You)' : '🧑 Local Resident'}
                </span>
                <span>{c.time}</span>
              </div>
              <div className="font-medium text-stone-900 dark:text-stone-100">{c.originalText}</div>
              <div className="pt-1.5 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {c.translatedText}
                </span>
                <button
                  onClick={() => speakTranslatedText(c.translatedText, c.targetLang)}
                  className="p-1 rounded-lg bg-white/60 dark:bg-stone-800 hover:bg-emerald-100 text-emerald-600 transition-colors"
                  title="Play Audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Two-Person Live Conversation Controls */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850/60 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* YOU Speak Button */}
            <button
              onClick={() => (isListening ? stopVoiceInput() : startVoiceInput('you'))}
              className={`p-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isListening ? 'Listening...' : '👤 YOU Speak'}</span>
            </button>

            {/* LOCAL Speaks Button */}
            <button
              onClick={() => (isListening ? stopVoiceInput() : startVoiceInput('local'))}
              className={`p-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isListening ? 'Listening...' : '🧑 LOCAL Speaks'}</span>
            </button>
          </div>

          {/* Fallback Text Typing Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Or type message in ${SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
              className="flex-1 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleTranslate()}
              disabled={isTranslating}
              className="p-3 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
