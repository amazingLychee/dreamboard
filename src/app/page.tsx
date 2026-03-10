// src/app/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const STEPS = [
  {
    num: "01",
    icon: "💭",
    title: "Tell us your dreams",
    desc: "Pick categories and fill in what you want — dream car, travel destinations, career goals...",
  },
  {
    num: "02",
    icon: "✍️",
    title: "Add a personal touch",
    desc: "Add your name and a personal motto to make the board uniquely yours",
  },
  {
    num: "03",
    icon: "✨",
    title: "AI creates your board",
    desc: "Our AI generates a stunning watercolor vision board packed with your dreams",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-db-cream via-db-cream-dark to-db-cream">
      {/* Navbar */}
      <Navbar
        action={
          <Link
            href="/create"
            className="px-5 py-2 rounded-full border-[1.5px] border-db-amber text-text-label font-semibold text-sm hover:bg-surface-warm transition-colors"
          >
            Get Started
          </Link>
        }
      />

      {/* Hero */}
      <div className="text-center pt-20 pb-16 px-6 max-w-[700px] mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white border-[1.5px] border-border text-xs text-text-muted font-medium mb-6">
          ✨ AI-Powered Vision Board Generator
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-text-heading leading-tight mb-5 font-serif">
          Turn your dreams into
          <br />a beautiful vision board
        </h1>

        <p className="text-base text-text-sub leading-relaxed max-w-[500px] mx-auto mb-9">
          Tell us your goals and aspirations. Our AI will craft a stunning
          watercolor-style vision board you can print, share, or set as your
          wallpaper.
        </p>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-br from-amber-brand to-amber-dark text-white font-bold text-base shadow-lg shadow-amber-brand/30 hover:shadow-xl hover:shadow-amber-brand/40 transition-all"
        >
          Create My Vision Board <ArrowRight size={18} />
        </Link>
      </div>

      {/* How it works */}
      <div className="max-w-[800px] mx-auto px-6 pt-10 pb-20">
        <h2 className="text-center text-2xl font-bold text-text-main mb-10 font-serif">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 text-center shadow-sm"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-[0.7rem] text-amber-brand font-bold tracking-widest mb-1.5">
                {s.num}
              </div>
              <div className="text-[0.95rem] font-bold text-text-main mb-2">
                {s.title}
              </div>
              <div className="text-sm text-text-sub leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-footer">
        Made with ♡ by Yihan
      </div>
    </div>
  );
}