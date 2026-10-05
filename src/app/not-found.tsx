import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-3 text-base text-stone-400 max-w-md">
        The hidden path you were looking for doesn't exist or has moved. Let's guide you back to undiscovered sanctuaries.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/hidden-gems"
          className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm border border-stone-700 transition-all"
        >
          Explore Hidden Gems
        </Link>
      </div>
    </div>
  );
}
