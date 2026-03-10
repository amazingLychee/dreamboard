#!/bin/bash
# 在 dreamboard 项目根目录运行: bash setup.sh

# ── 创建文件夹 ──
mkdir -p src/components src/lib src/types src/app/create src/app/result src/app/api/generate

# ── globals.css ──
cat > src/app/globals.css << 'EOF'
@import "tailwindcss";

@theme {
  --color-db-cream: #fdf6ee;
  --color-db-cream-dark: #f5ead6;
  --color-db-amber: #c9a87c;
  --color-db-amber-dark: #b8956a;
  --color-db-text: #4a3728;
  --color-db-heading: #3a2a1a;
  --color-db-sub: #8b7a6a;
  --color-db-muted: #a08060;
  --color-db-warm: #5c4a3a;
  --color-db-label: #8b6a4a;
  --color-db-line: #e0d5c5;
  --color-db-line-light: #eeeeee;
  --color-db-line-accent: #d4c0a0;
  --color-db-surface: #fafafa;
  --color-db-surface-warm: #fdf0e6;
  --color-db-footer: #b8a088;
  --font-serif: var(--font-playfair), Georgia, serif;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--color-db-text);
}
EOF

# ── layout.tsx ──
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "DreamBoard.ai — AI Vision Board Generator",
  description: "Turn your dreams into a beautiful watercolor vision board, powered by AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>{children}</body>
    </html>
  );
}
EOF

# ── types/index.ts ──
cat > src/types/index.ts << 'EOF'
export interface DreamDetails {
  brand?: string;
  color?: string;
  pets?: string[];
  destinations?: string[];
  activities?: string[];
  hobbies?: string[];
  text?: string;
}

export interface FormData {
  time: string;
  dreams: string[];
  details: Record<string, DreamDetails>;
  name: string;
  motto: string;
  addLabels: boolean;
}

export interface GenerationResult {
  imageUrl: string;
  shareSlug: string;
  prompt: string;
}
EOF

# ── lib/constants.ts ──
cat > src/lib/constants.ts << 'EOF'
export const TIMES = [
  { id: "1y", label: "This Year", sub: "2026 Goals", emoji: "🎯" },
  { id: "3y", label: "3–5 Years", sub: "2026 — 2030", emoji: "🌟" },
  { id: "long", label: "Life Blueprint", sub: "Long-term Vision", emoji: "🗺️" },
];

export const DREAMS = [
  { id: "car", emoji: "🚗", label: "Dream Car" },
  { id: "immigration", emoji: "🍁", label: "Immigration / PR" },
  { id: "job", emoji: "💼", label: "Dream Job" },
  { id: "pet", emoji: "🐾", label: "Pet" },
  { id: "travel", emoji: "✈️", label: "Travel" },
  { id: "home", emoji: "🏠", label: "Dream Home" },
  { id: "health", emoji: "💪", label: "Health & Fitness" },
  { id: "hobby", emoji: "📸", label: "Hobbies" },
  { id: "love", emoji: "❤️", label: "Love & Family" },
  { id: "finance", emoji: "💰", label: "Financial Goals" },
  { id: "education", emoji: "🎓", label: "Education" },
  { id: "other", emoji: "✍️", label: "Other" },
];

export const CAR_BRANDS = ["BMW", "Porsche", "Mercedes-Benz", "Tesla", "Audi", "Lexus", "Other"];
export const CAR_COLORS = ["Black", "White", "Silver", "Red", "Blue", "Green", "Other"];
export const PET_OPTIONS = ["Golden Retriever", "Corgi", "Labrador", "Samoyed", "Orange Tabby Cat", "Ragdoll Cat", "British Shorthair", "Other"];
export const TRAVEL_SUGGESTIONS = ["Santorini", "Kyoto", "Swiss Alps", "Paris", "Bali", "New York", "Iceland", "Maldives", "London", "Seoul"];
export const HEALTH_OPTIONS = ["Rock Climbing", "Yoga", "Running", "Gym", "Hiking", "Cycling", "Swimming", "Martial Arts"];
export const HOBBY_OPTIONS = ["Film Photography", "Cooking", "Reading", "Music", "Art", "Gardening", "Gaming", "Writing"];
export const LOADING_MSGS = [
  "Gathering your dreams... ✨",
  "Mixing the watercolors... 🎨",
  "Pinning everything together... 📌",
  "Adding golden star stickers... ⭐",
  "Almost there... 💫",
];
EOF

# ── lib/prompt-builder.ts ──
cat > src/lib/prompt-builder.ts << 'EOF'
import { FormData } from "@/types";
import { DREAMS, TIMES } from "./constants";

export function buildSystemPrompt(): string {
  return `You are an expert AI image prompt engineer specializing in vision board design. Given structured user input about their dreams and goals, generate a single detailed English prompt for an AI image generator.

The prompt should describe a densely packed, overflowing vision board collage in warm watercolor illustration style, horizontal 16:9 landscape format, pinned on a cork board with overlapping Polaroids, torn magazine clippings, sticky notes, washi tape, dried flowers, and golden star stickers.

Style requirements:
- Warm hand-painted watercolor aesthetic throughout
- Soft golden lighting
- Muted rich palette: cream, amber, terracotta, sage green, dusty blue, dusty rose
- Visible watercolor paper texture
- Nostalgic, hopeful, abundant, deeply personal
- Everything packed tightly, almost no empty space
- Elements slightly crooked, edges curling — messy but beautiful

Make it personal, warm, abundant, and full of life. Include ALL the user's specific dreams as visual elements with specific details they provided. Add small decorative details like handwritten notes with motivational phrases, star stickers, pressed flowers, and washi tape between images.

Return ONLY the image generation prompt, nothing else.`;
}

export function buildUserMessage(data: FormData): string {
  const timePeriod = TIMES.find(t => t.id === data.time)?.label || data.time;
  let msg = `Create a vision board for: ${data.name || "someone"}\n`;
  msg += `Time frame: ${timePeriod}\n`;
  if (data.motto) msg += `Personal motto: "${data.motto}"\n`;
  msg += `Add handwritten labels: ${data.addLabels ? "yes" : "no"}\n\n`;
  msg += `Dreams and details:\n`;

  for (const dreamId of data.dreams) {
    const dream = DREAMS.find(d => d.id === dreamId);
    const detail = data.details[dreamId];
    msg += `\n- ${dream?.label}:`;
    if (!detail) { msg += " (no specific details provided)"; continue; }
    if (dreamId === "car" && detail.brand) msg += ` ${detail.color || ""} ${detail.brand}`;
    else if (dreamId === "pet" && detail.pets?.length) msg += ` ${detail.pets.join(", ")}`;
    else if (dreamId === "travel" && detail.destinations?.length) msg += ` ${detail.destinations.join(", ")}`;
    else if (dreamId === "health" && detail.activities?.length) msg += ` ${detail.activities.join(", ")}`;
    else if (dreamId === "hobby" && detail.hobbies?.length) msg += ` ${detail.hobbies.join(", ")}`;
    else if (detail.text) msg += ` ${detail.text}`;
  }
  return msg;
}
EOF

# ── components/Navbar.tsx ──
cat > src/components/Navbar.tsx << 'EOF'
"use client";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Navbar({ action }: { action?: React.ReactNode }) {
  return (
    <nav className="flex justify-between items-center px-7 py-5 max-w-[1100px] mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <Sparkles size={22} className="text-db-amber" />
        <span className="text-lg font-bold text-db-text tracking-wide">DreamBoard.ai</span>
      </Link>
      {action}
    </nav>
  );
}
EOF

# ── components/Chip.tsx ──
cat > src/components/Chip.tsx << 'EOF'
"use client";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${selected
          ? "border-2 border-db-amber bg-db-surface-warm text-db-label"
          : "border-[1.5px] border-db-line bg-white text-db-warm"
        }`}
    >
      {label}
    </button>
  );
}
EOF

# ── components/TagInput.tsx ──
cat > src/components/TagInput.tsx << 'EOF'
"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  suggestions: string[];
  placeholder: string;
}

export default function TagInput({ tags, setTags, suggestions, placeholder }: TagInputProps) {
  const [input, setInput] = useState("");
  const addTag = (t: string) => {
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setInput("");
  };
  const filtered = suggestions.filter(
    (s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-db-surface-warm border-[1.5px] border-db-amber text-sm text-db-label">
            {t}
            <X size={13} className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setTags(tags.filter((x) => x !== t))} />
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { e.preventDefault(); addTag(input.trim()); } }}
        className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-db-line text-sm outline-none focus:border-db-amber bg-white transition-colors"
      />
      {input && filtered.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {filtered.slice(0, 6).map((s) => (
            <button key={s} onClick={() => addTag(s)} className="px-3 py-1 rounded-full border-[1.5px] border-dashed border-db-line-accent bg-transparent text-xs text-db-muted cursor-pointer hover:bg-db-surface-warm transition-colors">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

# ── components/LoadingScreen.tsx ──
cat > src/components/LoadingScreen.tsx << 'EOF'
"use client";
import { useState, useEffect } from "react";
import { LOADING_MSGS } from "@/lib/constants";

export default function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MSGS.length), 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-db-cream to-db-cream-dark p-6">
      <div className="relative w-20 h-20 mb-8">
        <div className="w-20 h-20 border-[3px] border-db-line border-t-db-amber rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">✨</div>
      </div>
      <div className="text-lg font-bold text-db-text mb-2 font-serif">Creating your DreamBoard</div>
      <div key={msgIdx} className="text-sm text-db-muted h-6 transition-opacity duration-500">{LOADING_MSGS[msgIdx]}</div>
    </div>
  );
}
EOF

# ── components/DreamDetail.tsx ──
cat > src/components/DreamDetail.tsx << 'EOF'
"use client";
import { DreamDetails } from "@/types";
import { CAR_BRANDS, CAR_COLORS, PET_OPTIONS, TRAVEL_SUGGESTIONS, HEALTH_OPTIONS, HOBBY_OPTIONS } from "@/lib/constants";
import Chip from "./Chip";
import TagInput from "./TagInput";

interface Props {
  id: string;
  details: Record<string, DreamDetails>;
  setDetails: React.Dispatch<React.SetStateAction<Record<string, DreamDetails>>>;
}

export default function DreamDetail({ id, details, setDetails }: Props) {
  const d = details[id] || {};
  const upd = (k: string, v: any) => setDetails((prev) => ({ ...prev, [id]: { ...prev[id], [k]: v } }));
  const toggleArray = (key: string, value: string) => {
    const arr: string[] = (d as any)[key] || [];
    upd(key, arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  if (id === "car") return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">{CAR_BRANDS.map((b) => <Chip key={b} label={b} selected={d.brand === b} onClick={() => upd("brand", b)} />)}</div>
      <div className="flex flex-wrap gap-1.5">{CAR_COLORS.map((c) => <Chip key={c} label={c} selected={d.color === c} onClick={() => upd("color", c)} />)}</div>
    </div>
  );
  if (id === "pet") return (
    <div className="flex flex-wrap gap-1.5">{PET_OPTIONS.map((p) => <Chip key={p} label={p} selected={(d.pets || []).includes(p)} onClick={() => toggleArray("pets", p)} />)}</div>
  );
  if (id === "travel") return <TagInput tags={d.destinations || []} setTags={(v) => upd("destinations", v)} suggestions={TRAVEL_SUGGESTIONS} placeholder="Type a destination and press Enter" />;
  if (id === "health") return (
    <div className="flex flex-wrap gap-1.5">{HEALTH_OPTIONS.map((h) => <Chip key={h} label={h} selected={(d.activities || []).includes(h)} onClick={() => toggleArray("activities", h)} />)}</div>
  );
  if (id === "hobby") return (
    <div className="flex flex-wrap gap-1.5">{HOBBY_OPTIONS.map((h) => <Chip key={h} label={h} selected={(d.hobbies || []).includes(h)} onClick={() => toggleArray("hobbies", h)} />)}</div>
  );

  const placeholders: Record<string, string> = {
    immigration: "e.g., Canadian PR, US Green Card",
    job: "e.g., Solutions Engineer at Google",
    home: "e.g., Cozy condo in downtown Toronto with a monstera corner",
    love: "e.g., Build a warm home with my partner",
    finance: "e.g., Reach $500K net worth, FIRE by 35",
    education: "e.g., Complete Master's degree in Information Systems",
    other: "Describe your dream...",
  };
  return (
    <textarea value={d.text || ""} onChange={(e) => upd("text", e.target.value)} placeholder={placeholders[id] || "Describe..."} rows={2}
      className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-db-line text-sm resize-none outline-none focus:border-db-amber bg-white transition-colors" />
  );
}
EOF

# ── components/StepTime.tsx ──
cat > src/components/StepTime.tsx << 'EOF'
"use client";
import { Star } from "lucide-react";
import { TIMES } from "@/lib/constants";

interface Props { time: string; setTime: (t: string) => void; }

export default function StepTime({ time, setTime }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-db-heading mb-1.5 font-serif">When is this for?</h2>
      <p className="text-sm text-db-sub mb-6">Choose the time frame for your vision board</p>
      <div className="flex flex-col gap-3">
        {TIMES.map((t) => (
          <div key={t.id} onClick={() => setTime(t.id)}
            className={`flex items-center gap-4 p-[18px] rounded-2xl cursor-pointer transition-all
              ${time === t.id ? "border-[2.5px] border-db-amber bg-db-cream" : "border-[1.5px] border-db-line-light bg-db-surface"}`}>
            <span className="text-2xl">{t.emoji}</span>
            <div>
              <div className="font-semibold text-[0.95rem] text-db-heading">{t.label}</div>
              <div className="text-xs text-db-muted">{t.sub}</div>
            </div>
            {time === t.id && <Star size={16} fill="#c9a87c" className="text-db-amber ml-auto" />}
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

# ── components/StepDreams.tsx ──
cat > src/components/StepDreams.tsx << 'EOF'
"use client";
import { useCallback } from "react";
import { DREAMS } from "@/lib/constants";
import { DreamDetails } from "@/types";
import DreamDetail from "./DreamDetail";

interface Props {
  dreams: string[];
  setDreams: React.Dispatch<React.SetStateAction<string[]>>;
  details: Record<string, DreamDetails>;
  setDetails: React.Dispatch<React.SetStateAction<Record<string, DreamDetails>>>;
}

export default function StepDreams({ dreams, setDreams, details, setDetails }: Props) {
  const toggleDream = useCallback((id: string) => {
    setDreams((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length < 8 ? [...p, id] : p);
  }, [setDreams]);

  return (
    <div>
      <h2 className="text-xl font-bold text-db-heading mb-1.5 font-serif">What are your dreams?</h2>
      <p className="text-sm text-db-sub mb-5">Pick 2–8 categories, then fill in the details</p>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {DREAMS.map((d) => {
          const sel = dreams.includes(d.id);
          const maxed = !sel && dreams.length >= 8;
          return (
            <div key={d.id} onClick={() => !maxed && toggleDream(d.id)}
              className={`py-3.5 px-2 rounded-[14px] cursor-pointer text-center transition-all
                ${sel ? "border-[2.5px] border-db-amber bg-db-cream" : "border-[1.5px] border-db-line-light bg-db-surface"}
                ${maxed ? "opacity-40 pointer-events-none" : ""}`}>
              <div className="text-xl mb-1">{d.emoji}</div>
              <div className={`text-xs font-semibold ${sel ? "text-db-label" : "text-db-warm"}`}>{d.label}</div>
            </div>
          );
        })}
      </div>
      {dreams.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="text-xs font-semibold text-db-muted tracking-wider uppercase">Fill in the details</div>
          {dreams.map((id) => {
            const dr = DREAMS.find((x) => x.id === id)!;
            return (
              <div key={id} className="bg-db-surface rounded-[14px] p-3.5">
                <div className="text-sm font-semibold text-db-text mb-2.5">{dr.emoji} {dr.label}</div>
                <DreamDetail id={id} details={details} setDetails={setDetails} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
EOF

# ── components/StepPersonal.tsx ──
cat > src/components/StepPersonal.tsx << 'EOF'
"use client";

interface Props {
  name: string; setName: (n: string) => void;
  motto: string; setMotto: (m: string) => void;
  addLabels: boolean; setAddLabels: (v: boolean) => void;
}

export default function StepPersonal({ name, setName, motto, setMotto, addLabels, setAddLabels }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-db-heading mb-1.5 font-serif">Final touches</h2>
      <p className="text-sm text-db-sub mb-6">Add some personal flair to your board</p>
      <div className="mb-5">
        <label className="text-sm font-semibold text-db-warm block mb-2">Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional — shown on the board"
          className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-db-line text-sm outline-none focus:border-db-amber bg-white transition-colors" />
      </div>
      <div className="mb-5">
        <label className="text-sm font-semibold text-db-warm block mb-2">Personal motto or quote</label>
        <textarea value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="Leave blank and AI will write one for you ✨" rows={3}
          className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-db-line text-sm resize-none outline-none focus:border-db-amber bg-white transition-colors" />
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <div onClick={() => setAddLabels(!addLabels)}
          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all
            ${addLabels ? "border-2 border-db-amber bg-db-amber text-white" : "border-2 border-db-line-accent bg-white"}`}>
          {addLabels && "✓"}
        </div>
        <span className="text-sm text-db-warm">Add handwritten-style labels to each dream</span>
      </label>
    </div>
  );
}
EOF

# ── app/page.tsx (Landing) ──
cat > src/app/page.tsx << 'EOF'
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const STEPS = [
  { num: "01", icon: "💭", title: "Tell us your dreams", desc: "Pick categories and fill in what you want — dream car, travel destinations, career goals..." },
  { num: "02", icon: "✍️", title: "Add a personal touch", desc: "Add your name and a personal motto to make the board uniquely yours" },
  { num: "03", icon: "✨", title: "AI creates your board", desc: "Our AI generates a stunning watercolor vision board packed with your dreams" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-db-cream via-db-cream-dark to-db-cream">
      <Navbar action={
        <Link href="/create" className="px-5 py-2 rounded-full border-[1.5px] border-db-amber text-db-label font-semibold text-sm hover:bg-db-surface-warm transition-colors">
          Get Started
        </Link>
      } />
      <div className="text-center pt-20 pb-16 px-6 max-w-[700px] mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white border-[1.5px] border-db-line text-xs text-db-muted font-medium mb-6">
          ✨ AI-Powered Vision Board Generator
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-db-heading leading-tight mb-5 font-serif">
          Turn your dreams into<br />a beautiful vision board
        </h1>
        <p className="text-base text-db-sub leading-relaxed max-w-[500px] mx-auto mb-9">
          Tell us your goals and aspirations. Our AI will craft a stunning watercolor-style vision board you can print, share, or set as your wallpaper.
        </p>
        <Link href="/create" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-br from-db-amber to-db-amber-dark text-white font-bold text-base shadow-lg shadow-db-amber/30 hover:shadow-xl hover:shadow-db-amber/40 transition-all">
          Create My Vision Board <ArrowRight size={18} />
        </Link>
      </div>
      <div className="max-w-[800px] mx-auto px-6 pt-10 pb-20">
        <h2 className="text-center text-2xl font-bold text-db-text mb-10 font-serif">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 text-center shadow-sm">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-[0.7rem] text-db-amber font-bold tracking-widest mb-1.5">{s.num}</div>
              <div className="text-[0.95rem] font-bold text-db-text mb-2">{s.title}</div>
              <div className="text-sm text-db-sub leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center py-6 text-xs text-db-footer">Made with ♡ by Yihan</div>
    </div>
  );
}
EOF

# ── app/create/page.tsx ──
cat > src/app/create/page.tsx << 'EOF'
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import StepTime from "@/components/StepTime";
import StepDreams from "@/components/StepDreams";
import StepPersonal from "@/components/StepPersonal";
import LoadingScreen from "@/components/LoadingScreen";
import { DreamDetails } from "@/types";

const STEP_LABELS = ["Time Range", "Your Dreams", "Personal Touch"];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");
  const [dreams, setDreams] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, DreamDetails>>({});
  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [addLabels, setAddLabels] = useState(true);

  const canNext = () => {
    if (step === 0) return !!time;
    if (step === 1) return dreams.length >= 2;
    return true;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, dreams, details, name, motto, addLabels }),
      });
      const data = await res.json();
      if (data.error) { alert("Generation failed: " + data.error); setLoading(false); return; }
      sessionStorage.setItem("dreamboard-result", JSON.stringify(data));
      router.push("/result");
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-db-cream to-db-cream-dark p-5">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          {step === 0 ? (
            <Link href="/" className="flex items-center gap-1 text-db-sub text-sm font-medium hover:text-db-text transition-colors"><ArrowLeft size={16} /> Home</Link>
          ) : (
            <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 text-db-sub text-sm font-medium hover:text-db-text transition-colors"><ArrowLeft size={16} /> Back</button>
          )}
          <div className="flex items-center gap-1.5">
            <Sparkles size={18} className="text-db-amber" />
            <span className="font-bold text-db-text text-[0.95rem]">DreamBoard.ai</span>
          </div>
          <div className="w-[60px]" />
        </div>
        <div className="flex gap-1.5 mb-2">
          {STEP_LABELS.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-sm transition-all duration-300 ${i <= step ? "bg-db-amber" : "bg-db-line"}`} />
          ))}
        </div>
        <div className="text-xs text-db-muted font-medium mb-7">Step {step + 1} of 3 · {STEP_LABELS[step]}</div>
        <div className="bg-white rounded-3xl p-7 shadow-lg shadow-db-amber/5 min-h-[400px]">
          {step === 0 && <StepTime time={time} setTime={setTime} />}
          {step === 1 && <StepDreams dreams={dreams} setDreams={setDreams} details={details} setDetails={setDetails} />}
          {step === 2 && <StepPersonal name={name} setName={setName} motto={motto} setMotto={setMotto} addLabels={addLabels} setAddLabels={setAddLabels} />}
        </div>
        <div className="mt-5 pb-8">
          <button
            onClick={() => { if (step < 2) setStep((s) => s + 1); else handleGenerate(); }}
            disabled={!canNext()}
            className={`w-full py-4 rounded-2xl font-bold text-[0.95rem] flex items-center justify-center gap-2 transition-all
              ${canNext() ? "bg-gradient-to-br from-db-amber to-db-amber-dark text-white shadow-lg shadow-db-amber/25 cursor-pointer hover:shadow-xl" : "bg-db-line text-white cursor-not-allowed"}`}>
            {step < 2 ? (<>Next <ChevronRight size={18} /></>) : (<>✨ Generate My DreamBoard</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

# ── app/result/page.tsx ──
cat > src/app/result/page.tsx << 'EOF'
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Download, RefreshCw, Mail, Link2, X } from "lucide-react";
import { GenerationResult } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("dreamboard-result");
    if (stored) setResult(JSON.parse(stored));
    else router.push("/create");
  }, [router]);

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.download = `dreamboard-${result.shareSlug}.png`;
    link.click();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/board/${result?.shareSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-db-cream to-db-cream-dark p-5">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center justify-center gap-2 mb-7">
          <Sparkles size={20} className="text-db-amber" />
          <span className="font-bold text-db-text text-base">DreamBoard.ai</span>
        </div>
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-db-heading mb-1.5 font-serif">Your DreamBoard is ready! ✨</h1>
          <p className="text-sm text-db-sub">Here&apos;s your personalized vision board</p>
        </div>
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl shadow-db-amber/10 mb-6 border-[3px] border-white">
          {result.imageUrl ? (
            <img src={result.imageUrl} alt="Your DreamBoard" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-db-cream-dark via-db-surface-warm to-db-cream flex items-center justify-center">
              <div className="text-center text-db-muted">
                <div className="text-5xl mb-3">🎨</div>
                <div className="text-sm font-semibold">Your vision board will appear here</div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5 max-w-[500px] mx-auto mb-5">
          {[
            { icon: Download, label: "Download HD", onClick: handleDownload },
            { icon: RefreshCw, label: "Regenerate", onClick: () => router.push("/create") },
            { icon: Mail, label: "Send to Email", onClick: () => setShowEmailModal(true) },
            { icon: Link2, label: copied ? "Copied!" : "Share Link", onClick: handleCopyLink },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-[14px] border-[1.5px] border-db-line bg-white text-db-warm font-semibold text-sm hover:bg-db-surface-warm transition-colors">
              <btn.icon size={16} /> {btn.label}
            </button>
          ))}
        </div>
        <div className="text-center pb-8">
          <button onClick={() => { sessionStorage.removeItem("dreamboard-result"); router.push("/create"); }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-br from-db-amber to-db-amber-dark text-white font-bold text-sm shadow-lg shadow-db-amber/25 hover:shadow-xl transition-all">
            ✏️ Create Another DreamBoard
          </button>
        </div>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-5" onClick={() => setShowEmailModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-8 max-w-[400px] w-full shadow-2xl">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-db-heading font-serif">Send to your inbox 📧</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-db-sub hover:text-db-text"><X size={18} /></button>
            </div>
            <p className="text-sm text-db-sub mb-5">We&apos;ll send your DreamBoard as a beautiful email</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-db-line text-sm outline-none focus:border-db-amber mb-4 transition-colors" />
            <button onClick={() => setShowEmailModal(false)}
              className="w-full py-3.5 rounded-[14px] bg-gradient-to-br from-db-amber to-db-amber-dark text-white font-bold text-sm">
              Send with Love 💌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
EOF

# ── api/generate/route.ts ──
cat > src/app/api/generate/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt-builder";
import { FormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();

    // Step 1: Claude generates image prompt
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages: [{ role: "user", content: buildUserMessage(formData) }],
      }),
    });
    const claudeData = await claudeRes.json();
    const imagePrompt = claudeData.content?.[0]?.text;
    if (!imagePrompt) return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });

    // Step 2: Gemini generates image
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-native-image-generation:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imagePrompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
          },
        }),
      }
    );
    const geminiData = await geminiRes.json();
    const imagePart = geminiData.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData?.mimeType?.startsWith("image/")
    );
    if (!imagePart) return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });

    const base64Image = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
    const shareSlug = Math.random().toString(36).substring(2, 10);

    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${base64Image}`,
      shareSlug,
      prompt: imagePrompt,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
EOF

# ── .env.local ──
cat > .env.local << 'EOF'
ANTHROPIC_API_KEY=your-key-here
GOOGLE_AI_API_KEY=your-key-here
EOF

echo "✅ All files created! Run: npm run dev"