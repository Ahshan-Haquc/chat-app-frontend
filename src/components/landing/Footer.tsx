import { Github, Linkedin, MessageCircle, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-slate-900">
                Chatly
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              The real-time messaging API and UI kit built for speed, scale, and modern web applications.
            </p>
            <div className="mt-2 flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-slate-900 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-slate-900 transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-slate-900 transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>


        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Chatly Inc. All rights reserved.</p>
          <div className="font-mono text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            Built with Next.js · TypeScript · Tailwind CSS · Socket.io
          </div>
        </div>
      </div>
    </footer>
  );
}