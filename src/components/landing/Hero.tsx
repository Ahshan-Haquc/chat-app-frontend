import { ArrowRight } from "lucide-react";
import HeroMockup from "./HeroMockup";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-36">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-20rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
        <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-accent opacity-10" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent-dark font-mono mb-8">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            // zero latency messaging
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            Say it. <br />
            It's already <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-600">there.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Chatly delivers every message the exact moment you press send. One-to-one or in a group, live over a seamless socket connection with absolutely zero page refreshes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-accent/40">
              Open Chatly
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              See how it works
            </a>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}