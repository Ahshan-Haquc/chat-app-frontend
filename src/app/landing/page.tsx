'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import {
  ArrowDown,
  ArrowRight,
  Check,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Users,
  Wifi,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import NavBar from '@/components/landing/NavBar';
import Hero from '@/components/landing/Hero';
import MarqueeStrip from '@/components/landing/MarqueeStrip';

// Font Setup
const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

// Types
interface HeroLine {
  from: 'them' | 'me';
  text: string;
  delay: number;
}

interface DemoMessage {
  id: number;
  from: 'me' | 'them';
  text: string;
}




const AUTO_REPLIES = [
  'Got it, loud and clear.',
  'Nice — that arrived instantly.',
  'No refresh, no delay. Just like that.',
  'This is the live version, by the way.'
];

// Main Page Component
export default function LandingPage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-slate-50 text-slate-900 min-h-screen selection:bg-blue-200 selection:text-blue-900`}>
      <NavBar />
      <main>
        <Hero />
        <MarqueeStrip />
        <FeatureGrid />
        <TryItSection />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}

