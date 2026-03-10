// ============================================
// src/components/LoadingScreen.tsx
// ============================================
"use client";
import { useState, useEffect } from "react";
import { LOADING_MSGS } from "@/lib/constants";

export default function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(
      () => setMsgIdx((i) => (i + 1) % LOADING_MSGS.length),
      3000
    );
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-db-cream to-db-cream-dark p-6">
      <div className="relative w-20 h-20 mb-8">
        <div className="w-20 h-20 border-[3px] border-border border-t-amber-brand rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
          ✨
        </div>
      </div>
      <div className="text-lg font-bold text-text-main mb-2 font-serif">
        Creating your DreamBoard
      </div>
      <div
        key={msgIdx}
        className="text-sm text-text-muted h-6 transition-opacity duration-500"
      >
        {LOADING_MSGS[msgIdx]}
      </div>
    </div>
  );
}