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
