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


const FEATURE_TAGS = [
  'Delivered instantly',
  'Group threads',
  'Smart auto-scroll',
  'No refresh, ever',
  'Admin controls',
  'Search to start',
  'Read while it loads',
  'Built for two or twenty'
];

export default function MarqueeStrip() {
  const loop = [...FEATURE_TAGS, ...FEATURE_TAGS];
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white py-5">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-4">
        {loop.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-50 border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 font-mono"
          >
            <Check className="h-4 w-4 text-blue-600" />
            {tag}
          </span>
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}