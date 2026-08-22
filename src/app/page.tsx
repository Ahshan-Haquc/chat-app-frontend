"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionRestore } from "@/redux/useSessionRestore";
import { useAppSelector } from "@/redux/hooks";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function RootPage() {
  const router = useRouter();
  const { hydrated } = useSessionRestore();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(token ? "/chat" : "/login");
  }, [hydrated, token, router]);

  return (
    <main className="flex h-screen items-center justify-center bg-surface">
      <LoadingSpinner label="Loading Chatly" />
    </main>
  );
}
