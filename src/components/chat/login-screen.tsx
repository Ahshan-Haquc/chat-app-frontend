"use client";

import { useState } from "react";

interface LoginScreenProps {
  onLogin: (user: { name: string; phone: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !name.trim()) {
      setError("Please fill in both phone number and name.");
      return;
    }
    setError("");
    onLogin({ name, phone });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black p-4">
      <div className="w-full max-w-md rounded-2xl border border-brand-navy bg-brand-navy/30 p-8 backdrop-blur-md shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange text-brand-black font-bold text-xl">
            C
          </div>
          <h1 className="text-2xl font-bold text-brand-gray">Welcome to ChatCore</h1>
          <p className="mt-1 text-sm text-brand-gray/60">Enter your details to sign in or register automatically</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-gray/80 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+1 234 567 890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-brand-navy bg-brand-black px-4 py-3 text-sm text-brand-gray placeholder-brand-gray/30 focus:border-brand-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-gray/80 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Ahshanul Haque"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-brand-navy bg-brand-black px-4 py-3 text-sm text-brand-gray placeholder-brand-gray/30 focus:border-brand-orange focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-orange py-3.5 text-sm font-semibold text-brand-black hover:bg-brand-orange/90 transition-all shadow-lg"
          >
            Continue to Workspace
          </button>
        </form>
      </div>
    </div>
  );
}