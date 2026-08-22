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

const FEATURE_TAGS = [
  'Delivered instantly',
  'Group threads',
  'Smart auto-scroll',
  'No refresh, ever',
  'Admin controls',
  'Search to start',
  'Read while it loads',
  'Built for two or twenty'
];

const FEATURES = [
  {
    icon: Wifi,
    title: 'Real, not refreshed',
    body: 'Every message travels over a live socket connection. It appears on the other screen the instant it is sent — no polling, no reload, no lag.'
  },
  {
    icon: Users,
    title: 'Groups that behave',
    body: 'Start a thread with two people or twenty. Admins can add members, hand off the role, or rename the group without breaking the conversation.'
  },
  {
    icon: ArrowDown,
    title: 'Reads where you left it',
    body: 'New messages pull the view down only if you were already at the bottom. Scroll up to read history and Chatly holds still until you ask to jump back.'
  },
  {
    icon: Search,
    title: 'Search, then say hello',
    body: 'Find anyone by name or phone number and open a conversation in one tap. New numbers are simply the start of a new thread.'
  }
];

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

