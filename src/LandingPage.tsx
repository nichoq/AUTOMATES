import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Cpu,
  GitBranch,
  Layers,
  Table2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Zap,
  BookOpen,
  Play,
} from "lucide-react";

// ─── Logo SVG (reused from App.tsx) ─────────────────────────────────────────
const AutomateLogo = ({ className = "h-[36px] w-auto" }: { className?: string }) => (
  <svg viewBox="0 0 1150 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lp-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ac46fc" />
        <stop offset="50%" stopColor="#6716bc" />
        <stop offset="100%" stopColor="#2e0854" />
      </linearGradient>
    </defs>
    <path d="M 155,126 L 75,126" stroke="url(#lp-logo-grad)" strokeWidth="8" strokeLinecap="round" />
    <circle cx="75" cy="126" r="9" stroke="url(#lp-logo-grad)" strokeWidth="7" fill="#ffffff" />
    <path d="M 165,150 L 115,150 L 98,162 L 45,162" stroke="url(#lp-logo-grad)" strokeWidth="8" strokeLinecap="round" />
    <circle cx="45" cy="162" r="9" stroke="url(#lp-logo-grad)" strokeWidth="7" fill="#ffffff" />
    <path d="M 160,174 L 118,174 L 102,198 L 85,198" stroke="url(#lp-logo-grad)" strokeWidth="8" strokeLinecap="round" />
    <circle cx="85" cy="198" r="9" stroke="url(#lp-logo-grad)" strokeWidth="7" fill="#ffffff" />
    <path d="M 112,100 A 105,105 0 0,1 262,90" fill="none" stroke="url(#lp-logo-grad)" strokeWidth="13" strokeLinecap="round" />
    <polygon points="262,75 291,95 258,112" fill="url(#lp-logo-grad)" />
    <path d="M 112,200 A 105,105 0 0,0 265,210" fill="none" stroke="url(#lp-logo-grad)" strokeWidth="13" strokeLinecap="round" />
    <circle cx="195" cy="150" r="50" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(0 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(45 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(90 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(135 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(180 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(225 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(270 195 150)" fill="url(#lp-logo-grad)" />
    <rect x="183" y="85" width="24" height="25" rx="5" transform="rotate(315 195 150)" fill="url(#lp-logo-grad)" />
    <circle cx="195" cy="150" r="29" fill="#ffffff" />
    <text x="320" y="185" fill="url(#lp-logo-grad)" fontSize="135" fontWeight="900"
      fontFamily="Inter, system-ui, -apple-system, sans-serif" letterSpacing="1">
      AUTOMATE
    </text>
  </svg>
);

// ─── Floating DFA state bubble ────────────────────────────────────────────────
interface BubbleProps {
  label: string;
  style?: React.CSSProperties;
  accepting?: boolean;
  dead?: boolean;
  size?: number;
}
const StateBubble = ({ label, style, accepting, dead, size = 64 }: BubbleProps) => {
  const borderColor = accepting ? "#22c55e" : dead ? "#ef4444" : "#a78bfa";
  const bg = accepting
    ? "rgba(220,252,231,0.55)"
    : dead
    ? "rgba(254,226,226,0.55)"
    : "rgba(237,233,254,0.55)";
  const textColor = accepting ? "#15803d" : dead ? "#b91c1c" : "#6d28d9";

  return (
    <div
      className="absolute select-none pointer-events-none"
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `3px solid ${borderColor}`,
          background: bg,
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 24px 0 ${borderColor}33`,
        }}
      >
        {accepting && (
          <div
            style={{
              width: "80%",
              height: "80%",
              borderRadius: "50%",
              border: `2px solid ${borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: size * 0.22, color: textColor }}>
              {label}
            </span>
          </div>
        )}
        {!accepting && (
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: size * 0.24, color: textColor }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Animated connection arrow between two points ─────────────────────────────
const Arrow = ({ style }: { style?: React.CSSProperties }) => (
  <div
    className="absolute select-none pointer-events-none"
    style={{
      width: 80,
      height: 2,
      background: "linear-gradient(90deg, #a78bfa44, #a78bfa)",
      borderRadius: 2,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        right: -1,
        top: "50%",
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "8px solid #a78bfa",
      }}
    />
  </div>
);

// ─── Mini DFA preview (static visual) ────────────────────────────────────────
const MiniDfa = () => (
  <div className="relative w-full h-full">
    <StateBubble label="q₀" size={52} style={{ left: 10, top: "50%", transform: "translateY(-50%)" }} />
    <Arrow style={{ left: 72, top: "calc(50% - 1px)" }} />
    <StateBubble label="q₁" size={52} style={{ left: 160, top: "50%", transform: "translateY(-50%)" }} />
    <Arrow style={{ left: 222, top: "calc(50% - 1px)" }} />
    <StateBubble label="q₂" accepting size={52} style={{ left: 310, top: "50%", transform: "translateY(-50%)" }} />
    {/* self-loop arc */}
    <svg className="absolute" style={{ left: 288, top: 2, width: 96, height: 48 }} viewBox="0 0 96 48">
      <path d="M 16,44 C 16,4 80,4 80,44" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5 3" />
      <polygon points="78,40 84,46 72,46" fill="#a78bfa" />
    </svg>
  </div>
);

// ─── Feature card data ────────────────────────────────────────────────────────
const features = [
  {
    icon: Cpu,
    title: "DFA Simulator",
    desc: "Step through each character of your input and watch the Deterministic Finite Automaton traverse states in real time. Autoplay or step manually.",
    accent: "from-indigo-500 to-violet-600",
    tag: "CORE ENGINE",
    tagColor: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: Table2,
    title: "Transition Matrix",
    desc: "Inspect the full state-transition table for both DFAs. Instantly spot where each symbol leads and which states are accepting or trap states.",
    accent: "from-violet-500 to-purple-600",
    tag: "ANALYSIS",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    icon: GitBranch,
    title: "CFG Tracer",
    desc: "Observe Context-Free Grammar derivation step by step. Production rules expand live so you can follow the parse from the start symbol to the terminal string.",
    accent: "from-purple-500 to-fuchsia-600",
    tag: "GRAMMAR",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    icon: Layers,
    title: "PDA Simulator",
    desc: "Visualize a Pushdown Automaton reading your input with a live stack trace. See exactly which nodes are visited and what is pushed or popped at each step.",
    accent: "from-fuchsia-500 to-pink-600",
    tag: "STACK MACHINE",
    tagColor: "bg-fuchsia-100 text-fuchsia-700",
  },
];

// ─── Regex section data ───────────────────────────────────────────────────────
const regexData = [
  {
    id: 1,
    label: "REGEX 1",
    pattern: "(a|b)(a|b)(aa|ab|ba|bb)(a|b)*(aa|bb)",
    alphabet: "{a, b}",
    description:
      "Strings over {a, b} where the first two symbols can be any combination of a and b, followed by a two-character middle block, then zero or more characters, ending in aa or bb.",
    accepted: ["abaaaa", "baabbb", "aabbaa", "bbabbb"],
    rejected: ["ab", "aab", "bab", "aaab"],
    color: "indigo",
    gradient: "from-indigo-500 to-violet-500",
    lightBg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-800",
  },
  {
    id: 2,
    label: "REGEX 2",
    pattern: "(0|1)(0|1)(00|11)(0|1)*(01|10|11)(0|1)*",
    alphabet: "{0, 1}",
    description:
      "Binary strings where the first two bits can be 0 or 1, followed by a two-bit equal pair (00 or 11), then arbitrary bits, a required two-bit sub-pattern, and any trailing bits.",
    accepted: ["010011", "110010", "001100", "11001110"],
    rejected: ["01", "001", "101", "0011"],
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    lightBg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-800",
  },
];

// ─── Theory topic pill ────────────────────────────────────────────────────────
const topics = [
  { label: "Regular Expressions", icon: "✦" },
  { label: "Deterministic Finite Automata", icon: "◉" },
  { label: "Context-Free Grammar", icon: "⟨⟩" },
  { label: "Pushdown Automata", icon: "⬡" },
  { label: "Formal Languages", icon: "∑" },
  { label: "State Transitions", icon: "→" },
  { label: "Derivation Trees", icon: "⊢" },
  { label: "Stack Memory", icon: "⊕" },
];

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    start.current = null;
    const animate = (ts: number) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);

  return count;
}

// ─── Stat item ────────────────────────────────────────────────────────────────
const StatItem = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const count = useCountUp(value, 1400);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-black text-white font-display">
        {count}{suffix}
      </span>
      <span className="text-sm text-white/70 font-medium">{label}</span>
    </div>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────────────
interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeRegex, setActiveRegex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f3ff] text-slate-800 font-sans overflow-x-hidden">
      {/* ── Background grid ──────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-violet-100"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <AutomateLogo className="h-[28px] w-auto" />

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Regexes", "Theory", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-slate-600 hover:text-violet-700 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM READY
            </span>
            <button
              id="launch-app-btn"
              onClick={onLaunch}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-bold px-5 py-2 rounded-full shadow-md shadow-violet-200 hover:shadow-violet-300 transition-all duration-200 cursor-pointer"
            >
              Launch App <ArrowRight size={14} />
            </button>
          </div>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden">

        {/* Floating DFA state bubbles — decorative background */}
        <StateBubble label="q₀" size={80} style={{ top: "14%", left: "5%", opacity: 0.7, animation: "float1 7s ease-in-out infinite" }} />
        <StateBubble label="q₁" size={56} style={{ top: "28%", left: "12%", opacity: 0.5, animation: "float2 9s ease-in-out infinite" }} />
        <StateBubble label="q₂" accepting size={72} style={{ top: "60%", left: "4%", opacity: 0.65, animation: "float3 8s ease-in-out infinite" }} />
        <StateBubble label="qₜ" dead size={50} style={{ top: "75%", left: "14%", opacity: 0.5, animation: "float1 10s ease-in-out infinite" }} />
        <StateBubble label="q₃" size={64} style={{ top: "10%", right: "7%", opacity: 0.6, animation: "float2 11s ease-in-out infinite" }} />
        <StateBubble label="q₄" accepting size={88} style={{ top: "42%", right: "4%", opacity: 0.55, animation: "float3 7.5s ease-in-out infinite" }} />
        <StateBubble label="q₅" size={48} style={{ top: "70%", right: "10%", opacity: 0.5, animation: "float1 9.5s ease-in-out infinite" }} />
        <StateBubble label="q₆" dead size={60} style={{ top: "82%", right: "20%", opacity: 0.4, animation: "float2 8.5s ease-in-out infinite" }} />

        {/* Big radial gradient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
          {/* Eyebrow label */}
          <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-violet-600 uppercase bg-violet-100 border border-violet-200 rounded-full px-4 py-1.5">
            <Zap size={11} className="fill-violet-500 text-violet-500" />
            Automata Theory · Interactive Visualizer
          </div>

          {/* Main title */}
          <h1 className="leading-none">
            <span
              className="block text-[clamp(3.5rem,12vw,8rem)] font-black text-slate-900 font-display tracking-tight"
              style={{ letterSpacing: "-0.03em" }}
            >
              Automate
            </span>
            <span
              className="block text-[clamp(1.6rem,5vw,3.5rem)] font-bold font-display mt-1"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Regex-Based String Validator
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
            An interactive system that demonstrates how input strings are validated using{" "}
            <span className="text-violet-700 font-semibold">Deterministic Finite Automata</span>,{" "}
            <span className="text-indigo-700 font-semibold">Context-Free Grammar</span>, and{" "}
            <span className="text-purple-700 font-semibold">Pushdown Automata</span> — with live step-by-step visualization.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              id="hero-launch-btn"
              onClick={onLaunch}
              className="group flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-violet-200 hover:shadow-violet-300 transition-all duration-200 cursor-pointer text-sm"
            >
              <Play size={16} className="fill-white" />
              Launch the Validator
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 text-slate-600 hover:text-violet-700 font-semibold px-6 py-4 rounded-2xl border border-slate-200 bg-white/60 hover:bg-white transition-all text-sm"
            >
              <BookOpen size={15} />
              Explore Features
            </a>
          </div>

          {/* Mini DFA preview card */}
          <div className="mt-6 w-full max-w-md bg-white/70 backdrop-blur-xl border border-violet-100 rounded-2xl shadow-xl shadow-violet-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black tracking-widest text-violet-500 uppercase">DFA Simulation Preview</div>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              </div>
            </div>
            <div className="relative h-16 flex items-center">
              <MiniDfa />
            </div>
            <div className="mt-3 flex items-center gap-2">
              {["a", "b", "a", "a"].map((ch, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-violet-50 border border-violet-200 font-mono text-xs font-bold text-violet-700"
                >
                  {ch}
                </span>
              ))}
              <ChevronRight size={14} className="text-slate-300" />
              <span className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-300 font-mono text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={11} /> ACCEPT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-violet-200"
          style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6d28d9 100%)" }}>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-10 px-8">
            <StatItem value={2} suffix="" label="Regex Patterns" />
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <StatItem value={4} suffix="+" label="Tools & Views" />
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <StatItem value={18} suffix="" label="DFA States" />
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <StatItem value={100} suffix="%" label="Interactive" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-5">
              ✦ CORE FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-display" style={{ letterSpacing: "-0.02em" }}>
              Everything you need to<br />
              <span style={{ background: "linear-gradient(135deg, #6d28d9, #4338ca)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                understand automata
              </span>
            </h2>
            <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto leading-relaxed">
              Four powerful tools in one seamless interface — built to make formal language theory tangible and intuitive.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col gap-4 overflow-hidden cursor-default"
                >
                  {/* Gradient top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.accent} rounded-t-2xl`} />

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center shadow-md`}>
                    <Icon size={20} className="text-white" strokeWidth={2} />
                  </div>

                  {/* Tag */}
                  <span className={`text-[9.5px] font-black tracking-widest ${f.tagColor} rounded-full px-2.5 py-0.5 w-fit`}>
                    {f.tag}
                  </span>

                  {/* Text */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>

                  {/* Hover arrow */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-auto">
                    Explore <ChevronRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          REGEX SHOWCASE SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="regexes" className="relative z-10 py-20 px-6 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-purple-600 uppercase bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-5">
              ⟨⟩ LANGUAGE DEFINITIONS
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-display" style={{ letterSpacing: "-0.02em" }}>
              Two Regex Patterns,<br />
              <span style={{ background: "linear-gradient(135deg, #9333ea, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Infinitely Testable
              </span>
            </h2>
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {regexData.map((r, i) => (
                <button
                  key={i}
                  id={`regex-tab-${i + 1}`}
                  onClick={() => setActiveRegex(i)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeRegex === i
                      ? r.color === "indigo"
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                        : "bg-white text-purple-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active regex card */}
          {regexData.map((r, i) =>
            activeRegex !== i ? null : (
              <div
                key={i}
                className={`rounded-3xl border ${r.border} overflow-hidden shadow-xl shadow-violet-100`}
              >
                {/* Header gradient */}
                <div className={`bg-gradient-to-r ${r.gradient} p-8 text-white`}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
                        Pattern · Alphabet {r.alphabet}
                      </span>
                      <div className="mt-2 font-mono text-xl md:text-2xl font-bold break-all bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                        {r.pattern}
                      </div>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full border border-white/30">
                      {r.label}
                    </span>
                  </div>
                  <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-2xl">
                    {r.description}
                  </p>
                </div>

                {/* Examples */}
                <div className={`${r.lightBg} p-8 grid md:grid-cols-2 gap-6`}>
                  {/* Accepted strings */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span className="text-sm font-black text-emerald-700 tracking-wide">ACCEPTED STRINGS</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {r.accepted.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-sm px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rejected strings */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle size={16} className="text-rose-500" />
                      <span className="text-sm font-black text-rose-600 tracking-wide">REJECTED STRINGS</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {r.rejected.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-sm px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="bg-white p-5 flex items-center justify-between border-t border-slate-100">
                  <p className="text-sm text-slate-500 font-medium">
                    Test your own strings in the interactive simulator
                  </p>
                  <button
                    id={`test-regex-${i + 1}-btn`}
                    onClick={onLaunch}
                    className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      r.color === "indigo"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
                    }`}
                  >
                    Test {r.label} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          THEORY TOPICS SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="theory" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-fuchsia-600 uppercase bg-fuchsia-50 border border-fuchsia-100 rounded-full px-4 py-1.5 mb-5">
                ∑ THEORETICAL BACKGROUND
              </div>
              <h2 className="text-4xl font-black text-slate-900 font-display mb-4" style={{ letterSpacing: "-0.02em" }}>
                Built on solid<br />
                <span style={{ background: "linear-gradient(135deg, #c026d3, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  formal foundations
                </span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                Automata theory provides the theoretical backbone for understanding how abstract machines process symbols.
                It underpins regular expressions, compiler design, syntax analysis, and more. This system bridges theory
                and practice through live, interactive demonstrations.
              </p>
              <p className="text-slate-500 leading-relaxed text-sm">
                Context-free grammars describe languages through recursive production rules, while pushdown automata extend
                finite automata with a stack memory — enabling them to recognize context-free languages beyond what a simple
                DFA can process.
              </p>
            </div>

            {/* Right: topic pills */}
            <div className="flex-1 flex flex-wrap gap-3 justify-start lg:justify-center">
              {topics.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-200 cursor-default group"
                >
                  <span className="text-base text-violet-500 group-hover:scale-110 transition-transform">{t.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="relative z-10 py-20 px-6 bg-white/40">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-violet-600 uppercase bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5 mb-5">
            → HOW IT WORKS
          </div>
          <h2 className="text-4xl font-black text-slate-900 font-display" style={{ letterSpacing: "-0.02em" }}>
            From string to verdict,{" "}
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              step by step
            </span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Input Your String",
              desc: "Type or select a test string using the allowed alphabet. The system sanitizes and validates the characters automatically.",
              icon: "✎",
              color: "violet",
            },
            {
              step: "02",
              title: "Run the Simulation",
              desc: "Choose DFA or PDA view mode. Hit Autoplay or step through character by character to observe each state transition live.",
              icon: "▶",
              color: "indigo",
            },
            {
              step: "03",
              title: "Read the Verdict",
              desc: "The machine reaches an accepting or rejecting state. Review the CFG derivation trace and full transition breadcrumbs.",
              icon: "✓",
              color: "purple",
            },
          ].map((step, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-slate-100 font-display">{step.step}</span>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                    <ChevronRight size={14} className="text-violet-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl p-12 shadow-2xl shadow-violet-200 overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #6d28d9 0%, #4338ca 50%, #7c3aed 100%)" }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            {/* Floating mini bubbles */}
            <div className="absolute top-6 left-10 w-10 h-10 rounded-full border-2 border-white/20 bg-white/10" />
            <div className="absolute bottom-8 right-12 w-14 h-14 rounded-full border-2 border-white/20 bg-white/10" />
            <div className="absolute top-10 right-8 w-7 h-7 rounded-full border-2 border-white/20 bg-white/10" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white font-display mb-3" style={{ letterSpacing: "-0.02em" }}>
                Ready to explore automata theory?
              </h2>
              <p className="text-white/70 mb-8 text-base max-w-xl mx-auto leading-relaxed">
                Launch the validator, type in a string, and watch the DFA, CFG, and PDA come to life in real time.
              </p>
              <button
                id="final-cta-btn"
                onClick={onLaunch}
                className="group inline-flex items-center gap-3 bg-white hover:bg-violet-50 text-violet-700 font-black px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer text-base"
              >
                <Play size={18} className="fill-violet-600 text-violet-600" />
                Launch Automate
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-violet-100 bg-white/60 backdrop-blur py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <AutomateLogo className="h-[22px] w-auto" />
          <p className="text-xs text-slate-400 text-center">
            © 2026 Automate · Regex-Based String Validator with DFA, CFG, and PDA Representation
          </p>
          <p className="text-xs text-slate-400">
            Built for Automata Theory
          </p>
        </div>
      </footer>

      {/* ── Keyframe animations ────────────────────────────────────────────── */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-14px) rotate(3deg); }
          66% { transform: translateY(6px) rotate(-2deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40% { transform: translateY(12px) rotate(-4deg); }
          70% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          75% { transform: translateY(8px) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
}
