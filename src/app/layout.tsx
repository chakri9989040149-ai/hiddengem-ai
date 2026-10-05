import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIAgentFloating } from '@/components/ai/AIAgentFloating';
import { DynamicTravelBackground } from '@/components/layout/DynamicTravelBackground';
import { LiveTravelTranslatorModal } from '@/components/translator/LiveTravelTranslatorModal';

export const metadata: Metadata = {
  title: 'HiddenGem AI — Discover Beyond the Destination',
  description:
    'AI-powered tourism discovery and intelligent trip planning platform that promotes lesser-known attractions around major destinations based on interests, travel time, capacity, and crowd levels.',
  keywords: [
    'HiddenGem AI',
    'Offbeat Tourism',
    'Crowd Prediction',
    'Tirupati Hidden Gems',
    'Hampi Bouldering',
    'Munnar Tea Peaks',
    'Travel Planner',
    'Eco Tourism',
  ],
  authors: [{ name: 'HiddenGem AI Team' }],
  openGraph: {
    title: 'HiddenGem AI — Discover Beyond the Destination',
    description:
      'Avoid overcrowded tourist traps. Find breathtaking hidden gems, predict crowds, optimize routes, and split expenses.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white relative">
        <DynamicTravelBackground />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <AIAgentFloating />
        <LiveTravelTranslatorModal />
      </body>
    </html>
  );
}

