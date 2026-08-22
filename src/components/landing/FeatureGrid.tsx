import {
  ArrowDown,
  ArrowRight,
  Check,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Users,
  Wifi,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const FEATURES = [
  {
    icon: Wifi,
    title: 'Real, not refreshed',
    body: 'Every message travels over a live socket connection. It appears on the other screen the instant it is sent — no polling, no reload, no lag.'
  },
  {
    icon: Users,
    title: 'Groups that behave',
    body: 'Start a thread with two people or twenty. Admins can add members, hand off the role, or rename the group without breaking the conversation.'
  },
  {
    icon: ArrowDown,
    title: 'Reads where you left it',
    body: 'New messages pull the view down only if you were already at the bottom. Scroll up to read history and Chatly holds still until you ask to jump back.'
  },
  {
    icon: Search,
    title: 'Search, then say hello',
    body: 'Find anyone by name or phone number and open a conversation in one tap. New numbers are simply the start of a new thread.'
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
      <div className="max-w-2xl">
        <span className="text-sm font-bold uppercase tracking-wider text-accent">
          Built for real conversations
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          The parts people actually notice
        </h2>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}