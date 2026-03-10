"use client";

import { useState, useCallback, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Download, RefreshCw, Mail, Link2, ChevronRight, Star, X, Check, Share2 } from "lucide-react";

// ─── Constants ───
const TIMES = [
  { id: "1y", label: "This Year", sub: "2026 Goals", emoji: "🎯" },
  { id: "3y", label: "3–5 Years", sub: "2026 — 2030", emoji: "🌟" },
  { id: "long", label: "Life Blueprint", sub: "Long-term Vision", emoji: "🗺️" },
];

const DREAMS = [
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

const CAR_BRANDS = ["BMW", "Porsche", "Mercedes-Benz", "Tesla", "Audi", "Lexus", "Other"];
const CAR_COLORS = ["Black", "White", "Silver", "Red", "Blue", "Green", "Other"];
const PET_OPTIONS = ["Golden Retriever", "Corgi", "Labrador", "Samoyed", "Orange Tabby Cat", "Ragdoll Cat", "British Shorthair", "Other"];
const TRAVEL_SUGGESTIONS = ["Santorini", "Kyoto", "Swiss Alps", "Paris", "Bali", "New York", "Iceland", "Maldives", "London", "Seoul"];
const HEALTH_OPTIONS = ["Rock Climbing", "Yoga", "Running", "Gym", "Hiking", "Cycling", "Swimming"];
const HOBBY_OPTIONS = ["Film Photography", "Cooking", "Reading", "Music", "Art", "Gardening", "Gaming", "Writing"];

const LOADING_MSGS = [
  { text: "Gathering your dreams...", emoji: "💭", progress: 10 },
  { text: "Crafting your vision...", emoji: "✍️", progress: 30 },
  { text: "Mixing the watercolors...", emoji: "🎨", progress: 50 },
  { text: "Pinning everything together...", emoji: "📌", progress: 70 },
  { text: "Adding golden star stickers...", emoji: "⭐", progress: 85 },
  { text: "Almost there...", emoji: "✨", progress: 95 },
];

// ─── Sub-components ───
function Chip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", borderRadius: 30, border: selected ? "2px solid #c9a87c" : "1.5px solid #e0d5c5",
      background: selected ? "#fdf0e6" : "#fff", color: selected ? "#8b6a4a" : "#6b5c4c",
      fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
    }}>{label}</button>
  );
}

function TagInput({ tags, setTags, suggestions, placeholder }) {
  const [input, setInput] = useState("");
  const addTag = (t) => { if (t && !tags.includes(t)) setTags([...tags, t]); setInput(""); };
  const filtered = suggestions.filter(s => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {tags.map(t => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 20, background: "#fdf0e6", border: "1.5px solid #c9a87c", fontSize: "0.82rem", color: "#8b6a4a" }}>
            {t} <X size={13} style={{ cursor: "pointer", opacity: 0.6 }} onClick={() => setTags(tags.filter(x => x !== t))} />
          </span>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder}
        onKeyDown={e => { if (e.key === "Enter" && input.trim()) { e.preventDefault(); addTag(input.trim()); } }}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e0d5c5", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", background: "#fff" }} />
      {input && filtered.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {filtered.slice(0, 6).map(s => (
            <button key={s} onClick={() => addTag(s)} style={{ padding: "5px 12px", borderRadius: 20, border: "1.5px dashed #d4c0a0", background: "transparent", fontSize: "0.78rem", color: "#a08060", cursor: "pointer" }}>+ {s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function DreamDetail({ id, details, setDetails }) {
  const d = details[id] || {};
  const upd = (k, v) => setDetails(prev => ({ ...prev, [id]: { ...prev[id], [k]: v } }));
  const toggleArr = (key, val) => { const arr = d[key] || []; upd(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]); };

  if (id === "car") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{CAR_BRANDS.map(b => <Chip key={b} label={b} selected={d.brand === b} onClick={() => upd("brand", b)} />)}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{CAR_COLORS.map(c => <Chip key={c} label={c} selected={d.color === c} onClick={() => upd("color", c)} />)}</div>
    </div>
  );
  if (id === "pet") return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{PET_OPTIONS.map(p => <Chip key={p} label={p} selected={(d.pets||[]).includes(p)} onClick={() => toggleArr("pets", p)} />)}</div>;
  if (id === "travel") return <TagInput tags={d.destinations||[]} setTags={v => upd("destinations", v)} suggestions={TRAVEL_SUGGESTIONS} placeholder="Type a destination and press Enter" />;
  if (id === "health") return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{HEALTH_OPTIONS.map(h => <Chip key={h} label={h} selected={(d.activities||[]).includes(h)} onClick={() => toggleArr("activities", h)} />)}</div>;
  if (id === "hobby") return <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{HOBBY_OPTIONS.map(h => <Chip key={h} label={h} selected={(d.hobbies||[]).includes(h)} onClick={() => toggleArr("hobbies", h)} />)}</div>;

  const ph = { immigration: "e.g., Canadian PR, US Green Card", job: "e.g., Solutions Engineer at Google", home: "e.g., Cozy condo in downtown Toronto", love: "e.g., Build a warm home with my partner", finance: "e.g., Reach $500K net worth", education: "e.g., Complete Master's degree", other: "Describe your dream..." };
  return <textarea value={d.text||""} onChange={e => upd("text", e.target.value)} placeholder={ph[id]||"Describe..."} rows={2} style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e0d5c5", fontSize: "0.85rem", resize: "none", outline: "none", fontFamily: "inherit", background: "#fff" }} />;
}

// ─── Inline Loading ───
function InlineLoading({ progress, currentMsg }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 20px" }}>
      <div style={{ position: "relative", width: 88, height: 88, marginBottom: 24 }}>
        <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="44" cy="44" r="38" fill="none" stroke="#efe4d6" strokeWidth="4" />
          <circle cx="44" cy="44" r="38" fill="none" stroke="#c9a87c" strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 38}`}
            strokeDashoffset={`${2 * Math.PI * 38 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "1.4rem" }}>
          {currentMsg?.emoji || "✨"}
        </div>
      </div>
      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#4a3728", marginBottom: 6, fontFamily: "Georgia, serif" }}>Creating your DreamBoard</div>
      <div style={{ fontSize: "0.85rem", color: "#a08060", marginBottom: 8 }}>{currentMsg?.text || "Starting..."}</div>
      <div style={{ fontSize: "0.72rem", color: "#c9a87c", fontWeight: 600 }}>{progress}%</div>
    </div>
  );
}

// ─── Inline Result ───
function InlineResult({ imageUrl, onRegenerate, onNew }) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // Demo placeholder if no real image
  const isDemo = !imageUrl;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#3a2a1a", marginBottom: 6, fontFamily: "Georgia, serif" }}>
          {isDemo ? "Almost there! 🎨" : "Your DreamBoard is ready! ✨"}
        </h2>
        <p style={{ color: "#8b7a6a", fontSize: "0.85rem" }}>
          {isDemo ? "Image generation is warming up — try again in a moment" : "Here's your personalized vision board"}
        </p>
      </div>

      {/* Image */}
      <div style={{
        width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", marginBottom: 20,
        boxShadow: "0 6px 30px rgba(160,120,60,0.12)", border: "3px solid #fff",
        background: isDemo ? "linear-gradient(135deg, #f5ead6, #fdf0e6, #e8f0e4, #fce8ea)" : undefined,
        display: isDemo ? "flex" : undefined, alignItems: isDemo ? "center" : undefined, justifyContent: isDemo ? "center" : undefined,
      }}>
        {isDemo ? (
          <div style={{ textAlign: "center", color: "#a08060", padding: 20 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🎨</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: 4 }}>Image generation is connecting...</div>
            <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>Click "Try Again" to regenerate</div>
          </div>
        ) : (
          <img src={imageUrl} alt="Your DreamBoard" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: isDemo ? "1fr 1fr" : "repeat(2, 1fr)", gap: 8, width: "100%", marginBottom: 16 }}>
        {!isDemo && (
          <button onClick={() => { const a = document.createElement("a"); a.href = imageUrl; a.download = "dreamboard.png"; a.click(); }}
            style={btnStyle}><Download size={15} /> Download HD</button>
        )}
        <button onClick={onRegenerate} style={btnStyle}><RefreshCw size={15} /> {isDemo ? "Try Again" : "Regenerate"}</button>
        {!isDemo && (
          <button onClick={() => setShowEmailModal(true)} style={btnStyle}><Mail size={15} /> Send to Email</button>
        )}
        {!isDemo && (
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={btnStyle}>{copied ? <><Check size={15} /> Copied!</> : <><Link2 size={15} /> Share Link</>}</button>
        )}
      </div>

      <button onClick={onNew} style={{
        padding: "13px 28px", borderRadius: 30, border: "none",
        background: "linear-gradient(135deg, #c9a87c, #b8956a)", color: "#fff",
        fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 4px 16px rgba(180,140,90,0.25)",
      }}>✏️ Create Another</button>

      {/* Email Modal */}
      {showEmailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }} onClick={() => setShowEmailModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, padding: "32px 28px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#3a2a1a", marginBottom: 6, fontFamily: "Georgia, serif" }}>Send to your inbox 📧</h3>
            <p style={{ color: "#8b7a6a", fontSize: "0.85rem", marginBottom: 20 }}>We'll send your DreamBoard as a beautiful email</p>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0d5c5", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", marginBottom: 16 }} />
            <button onClick={() => setShowEmailModal(false)} style={{
              width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #c9a87c, #b8956a)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
            }}>Send with Love 💌</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e0d5c5",
  background: "#fff", color: "#5c4a3a", fontWeight: 600, fontSize: "0.82rem",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit",
};

// ─── Landing Page ───
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #fdf6ee 0%, #f5ead6 50%, #fdf6ee 100%)" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={22} color="#c9a87c" />
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#4a3728", letterSpacing: 0.5 }}>DreamBoard.ai</span>
        </div>
        <button onClick={onStart} style={{ padding: "8px 20px", borderRadius: 30, border: "1.5px solid #c9a87c", background: "transparent", color: "#8b6a4a", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>Get Started</button>
      </nav>

      <div style={{ textAlign: "center", padding: "60px 24px 40px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 30, background: "#fff", border: "1.5px solid #e0d5c5", fontSize: "0.78rem", color: "#a08060", marginBottom: 24, fontWeight: 500 }}>✨ AI-Powered Vision Board Generator</div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "#3a2a1a", lineHeight: 1.2, marginBottom: 18, fontFamily: "Georgia, serif" }}>
          Turn your dreams into<br />a beautiful vision board
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#8b7a6a", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
          Tell us your goals and aspirations. Our AI will craft a stunning watercolor-style vision board you can print, share, or set as your wallpaper.
        </p>
        <button onClick={onStart} style={{
          padding: "16px 40px", borderRadius: 50, border: "none", background: "linear-gradient(135deg, #c9a87c, #b8956a)",
          color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
          boxShadow: "0 4px 20px rgba(180,140,90,0.3)", fontFamily: "inherit",
        }}>Create My Vision Board <ArrowRight size={18} /></button>
      </div>

      {/* Example previews */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {["Travel & Adventure 🌍", "Career & Growth 💼", "Dream Life 2030 ✨"].map((title, i) => (
            <div key={i} style={{
              aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", position: "relative",
              background: `linear-gradient(135deg, ${["#f5ead6, #fdf0e6, #e8dcc8", "#e8f0e4, #f0efe6, #dde8d8", "#fce8ea, #fdf0e6, #f0e4f0"][i]})`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "2px solid #fff",
            }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ fontSize: "1.8rem" }}>{["🌍", "💼", "✨"][i]}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#8b7a6a", letterSpacing: 1 }}>{title}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#b8a088", marginTop: 12 }}>Examples of AI-generated vision boards</p>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 24px 60px" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: 700, color: "#4a3728", marginBottom: 40, fontFamily: "Georgia, serif" }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { num: "01", icon: "💭", title: "Tell us your dreams", desc: "Pick categories and fill in the details — dream car, travel destinations, career goals..." },
            { num: "02", icon: "✍️", title: "Add a personal touch", desc: "Add your name and a personal motto to make the board uniquely yours" },
            { num: "03", icon: "✨", title: "AI creates your board", desc: "Our AI generates a stunning watercolor vision board packed with your dreams" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "28px 22px", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: "0.7rem", color: "#c9a87c", fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>{s.num}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#4a3728", marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: "0.82rem", color: "#8b7a6a", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "20px 0 30px", fontSize: "0.78rem", color: "#b8a088" }}>Made with ♡ by Yihan</div>
    </div>
  );
}

// ─── Main Create Flow (everything in one page) ───
function CreateFlow({ onBack }) {
  const [step, setStep] = useState(0);
  const [time, setTime] = useState("");
  const [dreams, setDreams] = useState([]);
  const [details, setDetails] = useState({});
  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [addLabels, setAddLabels] = useState(true);

  // Generation state
  const [phase, setPhase] = useState("form"); // form | loading | result
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const toggleDream = useCallback(id => {
    setDreams(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 8 ? [...p, id] : p);
  }, []);

  const canNext = () => {
    if (step === 0) return !!time;
    if (step === 1) return dreams.length >= 2;
    return true;
  };

  const steps = ["Time Range", "Your Dreams", "Personal Touch"];

  const handleGenerate = async () => {
    setPhase("loading");
    setLoadingProgress(0);
    setLoadingMsgIdx(0);

    let msgIdx = 0;
    const iv = setInterval(() => {
      msgIdx++;
      if (msgIdx < LOADING_MSGS.length) {
        setLoadingMsgIdx(msgIdx);
        setLoadingProgress(LOADING_MSGS[msgIdx].progress);
      }
    }, 2500);

    try {
      const data = { time, dreams, details, name, motto, addLabels };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      clearInterval(iv);

      if (res.ok) {
        const result = await res.json();
        setLoadingProgress(100);
        setTimeout(() => {
          setImageUrl(result.imageUrl);
          setPhase("result");
        }, 600);
      } else {
        setLoadingProgress(100);
        setTimeout(() => {
          setImageUrl(null);
          setPhase("result");
        }, 600);
      }
    } catch {
      clearInterval(iv);
      setLoadingProgress(100);
      setTimeout(() => {
        setImageUrl(null);
        setPhase("result");
      }, 600);
    }
  };

  const handleRegenerate = () => {
    setPhase("form");
    setImageUrl(null);
    // Keep step at 2 so user can tweak and regenerate
  };

  const handleNew = () => {
    setPhase("form");
    setStep(0);
    setTime("");
    setDreams([]);
    setDetails({});
    setName("");
    setMotto("");
    setImageUrl(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #fdf6ee, #f5ead6 100%)", padding: "20px 16px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div onClick={phase !== "form" ? undefined : (step === 0 ? onBack : () => setStep(s => s - 1))}
            style={{ cursor: phase !== "form" ? "default" : "pointer", display: "flex", alignItems: "center", gap: 4, color: "#8b7a6a", fontSize: "0.85rem", fontWeight: 500, opacity: phase !== "form" ? 0.4 : 1 }}>
            <ArrowLeft size={16} /> {step === 0 ? "Home" : "Back"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={18} color="#c9a87c" />
            <span style={{ fontWeight: 700, color: "#4a3728", fontSize: "0.95rem" }}>DreamBoard.ai</span>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Progress (always visible) */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? "#c9a87c" : "#e0d5c5", transition: "all 0.3s" }} />)}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#a08060", marginBottom: 28, fontWeight: 500 }}>
          {phase === "loading" ? "Generating..." : phase === "result" ? "Complete! ✨" : `Step ${step + 1} of 3 · ${steps[step]}`}
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "32px 26px", boxShadow: "0 4px 30px rgba(160,120,60,0.08)", minHeight: 300 }}>

          {/* Loading state */}
          {phase === "loading" && (
            <InlineLoading progress={loadingProgress} currentMsg={LOADING_MSGS[loadingMsgIdx]} />
          )}

          {/* Result state */}
          {phase === "result" && (
            <InlineResult imageUrl={imageUrl} onRegenerate={handleRegenerate} onNew={handleNew} />
          )}

          {/* Form state */}
          {phase === "form" && step === 0 && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#3a2a1a", marginBottom: 6, fontFamily: "Georgia, serif" }}>When is this for?</h2>
              <p style={{ color: "#8b7a6a", fontSize: "0.88rem", marginBottom: 24 }}>Choose the time frame for your vision board</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {TIMES.map(t => (
                  <div key={t.id} onClick={() => setTime(t.id)} style={{
                    padding: "18px 20px", borderRadius: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                    border: time === t.id ? "2.5px solid #c9a87c" : "1.5px solid #eee", background: time === t.id ? "#fdf6ee" : "#fafafa", transition: "all 0.2s",
                  }}>
                    <span style={{ fontSize: "1.6rem" }}>{t.emoji}</span>
                    <div><div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#3a2a1a" }}>{t.label}</div><div style={{ fontSize: "0.78rem", color: "#a08060" }}>{t.sub}</div></div>
                    {time === t.id && <Star size={16} fill="#c9a87c" color="#c9a87c" style={{ marginLeft: "auto" }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "form" && step === 1 && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#3a2a1a", marginBottom: 6, fontFamily: "Georgia, serif" }}>What are your dreams?</h2>
              <p style={{ color: "#8b7a6a", fontSize: "0.88rem", marginBottom: 20 }}>Pick 2–8 categories, then fill in the details</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
                {DREAMS.map(d => {
                  const sel = dreams.includes(d.id);
                  return (
                    <div key={d.id} onClick={() => toggleDream(d.id)} style={{
                      padding: "14px 8px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                      border: sel ? "2.5px solid #c9a87c" : "1.5px solid #eee", background: sel ? "#fdf6ee" : "#fafafa",
                      transition: "all 0.2s", opacity: !sel && dreams.length >= 8 ? 0.4 : 1,
                    }}>
                      <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{d.emoji}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: sel ? "#8b6a4a" : "#6b5c4c" }}>{d.label}</div>
                    </div>
                  );
                })}
              </div>
              {dreams.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#a08060", letterSpacing: 1, textTransform: "uppercase" }}>Fill in the details</div>
                  {dreams.map(id => {
                    const dr = DREAMS.find(x => x.id === id);
                    return (
                      <div key={id} style={{ background: "#fafafa", borderRadius: 14, padding: "14px 16px" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#4a3728", marginBottom: 10 }}>{dr.emoji} {dr.label}</div>
                        <DreamDetail id={id} details={details} setDetails={setDetails} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {phase === "form" && step === 2 && (
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#3a2a1a", marginBottom: 6, fontFamily: "Georgia, serif" }}>Final touches</h2>
              <p style={{ color: "#8b7a6a", fontSize: "0.88rem", marginBottom: 24 }}>Add some personal flair to your board</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#5c4a3a", display: "block", marginBottom: 8 }}>Your name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Optional — shown on the board"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0d5c5", fontSize: "0.88rem", outline: "none", fontFamily: "inherit" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#5c4a3a", display: "block", marginBottom: 8 }}>Personal motto or quote</label>
                <textarea value={motto} onChange={e => setMotto(e.target.value)} placeholder='Leave blank and AI will write one for you ✨' rows={3}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0d5c5", fontSize: "0.88rem", resize: "none", outline: "none", fontFamily: "inherit" }} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <div onClick={() => setAddLabels(!addLabels)} style={{
                  width: 20, height: 20, borderRadius: 6, border: addLabels ? "2px solid #c9a87c" : "2px solid #d4c0a0",
                  background: addLabels ? "#c9a87c" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                }}>{addLabels && "✓"}</div>
                <span style={{ fontSize: "0.85rem", color: "#5c4a3a" }}>Add handwritten-style labels to each dream</span>
              </label>
            </div>
          )}
        </div>

        {/* Bottom button — only show in form state */}
        {phase === "form" && (
          <div style={{ display: "flex", gap: 12, marginTop: 20, paddingBottom: 30 }}>
            <button onClick={() => { if (step < 2) setStep(s => s + 1); else handleGenerate(); }}
              disabled={!canNext()}
              style={{
                flex: 1, padding: "15px 0", borderRadius: 16, border: "none",
                background: canNext() ? "linear-gradient(135deg, #c9a87c, #b8956a)" : "#e0d5c5",
                color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: canNext() ? "pointer" : "not-allowed",
                fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: canNext() ? "0 4px 16px rgba(180,140,90,0.25)" : "none",
              }}>
              {step < 2 ? <>Next <ChevronRight size={18} /></> : <>✨ Generate My DreamBoard</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ───
export default function App() {
  const [page, setPage] = useState("landing");

  if (page === "landing") return <Landing onStart={() => setPage("create")} />;
  if (page === "create") return <CreateFlow onBack={() => setPage("landing")} />;
}