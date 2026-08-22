"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { credentialsSet } from "@/redux/slice/authSlice";
import { useSessionRestore } from "@/redux/useSessionRestore";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { hydrated } = useSessionRestore();
  const token = useAppSelector((state) => state.auth.token);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/chat");
    }
  }, [hydrated, token, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!phone.trim() || !name.trim()) return;
    try {
      const result = await login({ phone: phone.trim(), name: name.trim() }).unwrap();
      dispatch(credentialsSet(result));
      router.replace("/chat");
    } catch {
      return;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink">Welcome to Chatly</h1>
            <p className="text-sm text-ink/50">Enter your phone number and name to continue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-medium text-ink/60">
              Phone number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+15551234367"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-ink/60">
              Your name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Ahsan"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              Couldn't log you in. Check your details and try again.
            </p>
          ) : null}

          <Button type="submit" className="w-full py-1! bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors duration-200" disabled={isLoading || !phone.trim() || !name.trim()}>
            {isLoading ? "Signing in..." : "Continue"}
          </Button>

          <p className="text-center text-xs text-ink/40">
            New number? You'll be registered automatically, no separate sign up needed.
          </p>
        </form>
      </div>
    </main>
  );
}
