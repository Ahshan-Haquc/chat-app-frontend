import { Github, Linkedin, MessageCircle, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold text-slate-900">
              Chatly
            </span>
          </div>
          <p className="text-center text-sm text-slate-500 max-w-xs">
            The real-time messaging API and UI kit built for speed, scale, and modern web applications.
          </p>
          <div className="mt-2 flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-slate-900 transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" className="hover:text-slate-900 transition-colors"><Linkedin className="h-5 w-5" /></a>
          </div>
        <p className="mt-12 text-center text-sm text-slate-500 max-w-xs">© {new Date().getFullYear()} Chatly Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}