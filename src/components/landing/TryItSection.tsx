import { Send, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Dot } from './HeroMockup';

interface DemoMessage {
  id: number;
  from: 'me' | 'them';
  text: string;
}




const AUTO_REPLIES = [
  'Got it, loud and clear.',
  'Nice — that arrived instantly.',
  'No refresh, no delay. Just like that.',
  'This is the live version, by the way.'
];

export default function TryItSection() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    { id: 1, from: 'them', text: 'This box is wired up — go ahead and type something.' }
  ]);
  const [draft, setDraft] = useState('');
  const [replying, setReplying] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, replying]);

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const mine: DemoMessage = { id: Date.now(), from: 'me', text };
    setMessages((prev) => [...prev, mine]);
    setDraft('');
    setReplying(true);

    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'them', text: reply }]);
      setReplying(false);
    }, 900 + Math.random() * 500);
  };

  return (
    <section id="try-it" className="relative border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-accent">
              No account needed
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Send one and watch it land
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-md">
              This is a stand-in for the real thing. Type a message below and this thread replies the way a live one would: instantly, with absolutely nothing to refresh.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-accent/5 p-4 text-sm font-medium text-slate-700 border border-accent/10">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Nothing you type here leaves this browser tab.
            </div>
          </div>

          <div className="mx-auto flex h-[480px] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/5">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-sm font-semibold text-slate-900">Live Demo Thread</span>
            </div>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-white px-5 py-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                      message.from === 'me'
                        ? 'rounded-2xl rounded-br-sm bg-accent text-white'
                        : 'rounded-2xl rounded-bl-sm border border-slate-100 bg-slate-50 text-slate-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {replying && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm">
                    <Dot delay={0} />
                    <Dot delay={150} />
                    <Dot delay={300} />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-[15px] text-slate-900 shadow-sm outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-5 w-5 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}