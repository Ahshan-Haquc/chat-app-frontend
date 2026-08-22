import { Send } from "lucide-react";
import { useEffect, useState } from "react";

export function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// Data Constants
const HERO_SCRIPT = [
  { from: 'them', text: 'Did the client sign off on the mockups?', delay: 600 },
  { from: 'me', text: 'Yes — just sent over the final files', delay: 1400 },
  { from: 'them', text: 'Amazing, that was fast', delay: 1100 },
  { from: 'me', text: 'Chatly makes it hard not to be', delay: 1300 }
];

export default function HeroMockup() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState<'them' | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    function playScript() {
      setVisibleCount(0);
      setTyping(null);
      let elapsed = 0;

      HERO_SCRIPT.forEach((line, index) => {
        elapsed += line.delay;
        if (line.from === 'them') {
          const typingStart = elapsed - Math.min(500, line.delay - 100);
          timeouts.push(
            setTimeout(() => {
              if (!cancelled) setTyping('them');
            }, typingStart)
          );
        }
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            setTyping(null);
            setVisibleCount(index + 1);
          }, elapsed)
        );
      });

      timeouts.push(setTimeout(playScript, elapsed + 3000));
    }

    playScript();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-accent/20 to-indigo-50/10 opacity-60 blur-2xl" />
      
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-white/50 px-5 py-4 backdrop-blur-md">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-light to-accent text-sm font-semibold text-white shadow-sm">
            RM
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Rima</p>
            <p className="text-xs font-medium text-slate-500">Active now</p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex h-[340px] flex-col justify-end gap-3 bg-slate-50/50 px-5 py-5">
          {HERO_SCRIPT.slice(0, visibleCount).map((line, i) => (
            <div key={i} className={`flex ${line.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  line.from === 'me'
                    ? 'rounded-2xl rounded-br-sm bg-accent text-white'
                    : 'rounded-2xl rounded-bl-sm border border-slate-100 bg-white text-slate-800'
                }`}
              >
                {line.text}
              </div>
            </div>
          ))}

          {typing === 'them' && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm">
                <Dot delay={0} />
                <Dot delay={150} />
                <Dot delay={300} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex items-center gap-3 border-t border-slate-100 bg-white px-4 py-4">
          <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400">
            Write a message…
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm">
            <Send className="h-4 w-4 ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}