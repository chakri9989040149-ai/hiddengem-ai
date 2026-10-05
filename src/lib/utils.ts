import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs} hrs`;
}

/**
 * Returns basePath-aware asset URL for GitHub Pages compatibility.
 * On localhost (development): returns original path (e.g. '/images/landing-travel.jpg')
 * On GitHub Pages (production): returns '/hiddengem-ai/images/landing-travel.jpg'
 */
export function getAssetPath(url: string | undefined | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!basePath) return url;
  if (url.startsWith(basePath)) return url;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${basePath}${cleanUrl}`;
}
