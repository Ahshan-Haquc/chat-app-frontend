"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionRestore } from "@/redux/useSessionRestore";
import { useAppSelector } from "@/redux/hooks";

import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import NavBar from '@/components/landing/NavBar';
import Hero from '@/components/landing/Hero';
import MarqueeStrip from '@/components/landing/MarqueeStrip';
import FeatureGrid from '@/components/landing/FeatureGrid';
import TryItSection from '@/components/landing/TryItSection';
import ClosingCta from '@/components/landing/ClosingCTA';
import Footer from '@/components/landing/Footer';

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



import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function RootPage() {
  const router = useRouter();
  const { hydrated } = useSessionRestore();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(token ? "/chat" : "/");
  }, [hydrated, token, router]);

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-slate-50 text-slate-900 min-h-screen selection:bg-accent/20 selection:text-accent-dark`}>
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

