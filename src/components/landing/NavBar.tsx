import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-sm shadow-accent/20">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Chatly
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#try-it" className="hover:text-accent transition-colors">Interactive Demo</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block transition-colors">
            Log in
          </Link>
          <Link href="/login" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-md">
            Start Chatting
          </Link>
        </div>
      </div>
    </header>
  );
}