"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-50 via-white to-gray-100 select-none">
      {/* Background Subtle Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-6">
        {/* Animated Icon Container */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border border-red-200/60 animate-ping opacity-40 pointer-events-none" />
          <div className="w-24 h-24 rounded-full bg-red-50 border border-red-100 shadow-lg flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-[#D52027]" />
          </div>
        </div>

        {/* Status Code */}
        <div className="space-y-2 mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
        </div>

        {/* Small Red Accent Line */}
        <div className="w-12 h-1 bg-[#D52027] rounded-full" />

        {/* Description */}
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

          <button
            onClick={() => router.back()}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-300 text-slate-700 font-semibold bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

      </div>

    </main>
  );
}