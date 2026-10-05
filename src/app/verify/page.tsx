'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  ShieldCheck,
  CheckCircle,
  FileCheck,
  ArrowRight,
  Info,
  Globe,
  Flag,
} from 'lucide-react';

export default function IdentityVerifyPage() {
  const router = useRouter();
  const { isIdentityVerified, verifiedDocType, setAuth } = useAppStore();

  const [region, setRegion] = useState<'india' | 'international'>('india');
  const [docType, setDocType] = useState('Aadhaar');
  const [docNumber, setDocNumber] = useState('XXXX-XXXX-8492');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const indiaDocs = [
    'Aadhaar',
    'PAN Card',
    'Passport (India)',
    'Voter ID (EPIC)',
    'Driving Licence',
    'Government Employee ID',
    'e-Shram Card',
    'ABHA Health ID',
  ];

  const intlDocs = [
    'International Passport',
    'National Identity Card',
    'Driver’s License',
    'Residence Permit',
    'Social Insurance Card',
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setAuth(true, true, `${docType} (Sandbox Verified)`);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Traveller Identity Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Compliance architecture demo for verified forest permits, restricted temple queues, and high-altitude trekking.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl space-y-6">
        {/* Compliance Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Hackathon Compliance Guarantee:</strong> Sensitive document numbers are <em>never</em> stored or transmitted. This interface simulates an OAuth DigiLocker / IDSP verification token.
          </p>
        </div>

        {/* Region Selector */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-extrabold tracking-wider text-stone-600 dark:text-stone-400 block">
            Select Jurisdiction
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRegion('india');
                setDocType(indiaDocs[0]);
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                region === 'india'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>India (DigiLocker)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegion('international');
                setDocType(intlDocs[0]);
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                region === 'international'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>International (Passport)</span>
            </button>
          </div>
        </div>

        {/* Document Selection Form */}
        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div>
            <label className="text-xs uppercase font-extrabold tracking-wider text-stone-600 dark:text-stone-400 block mb-1">
              Select Official Document
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
            >
              {(region === 'india' ? indiaDocs : intlDocs).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase font-extrabold tracking-wider text-stone-600 dark:text-stone-400 block mb-1">
              Mock Document Token / Masked Identifier
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
              required
            />
            <span className="text-[10px] text-stone-400 block mt-1">
              Tokens are simulated and cleared on session reset.
            </span>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            <FileCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Authenticating Token...' : 'Simulate Instant Verification'}</span>
          </button>
        </form>

        {/* Success Confirmation */}
        {(verifiedSuccess || isIdentityVerified) && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold text-sm block">Identity Verified ✓</span>
                <span className="text-[11px] opacity-80">
                  {verifiedDocType || `${docType} Verified`} • Permit Access Granted
                </span>
              </div>
            </div>

            <Link
              href="/plan-trip"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 flex items-center gap-1 shadow"
            >
              <span>Go to Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
