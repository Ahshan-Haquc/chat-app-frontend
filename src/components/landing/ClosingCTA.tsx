import { ArrowRight } from "lucide-react";

export default function ClosingCta() {
  return (
    <section className="px-6 py-24 lg:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-[3rem] bg-slate-900 px-8 py-20 text-center shadow-2xl overflow-hidden relative">
        
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[30rem] w-[30rem] bg-blue-600/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="z-10 flex flex-col items-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to say something?
          </h2>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Sign up in seconds. Enter a phone number and a name — new numbers start a fresh account automatically, no passwords required.
          </p>
          <a
            href="/login"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-blue-500"
          >
            Start using Chatly for free
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}