// ============================================
// src/components/StepTime.tsx
// ============================================
"use client";
import { Star } from "lucide-react";
import { TIMES } from "@/lib/constants";

interface Props {
  time: string;
  setTime: (t: string) => void;
}

export default function StepTime({ time, setTime }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-text-heading mb-1.5 font-serif">
        When is this for?
      </h2>
      <p className="text-sm text-text-sub mb-6">
        Choose the time frame for your vision board
      </p>
      <div className="flex flex-col gap-3">
        {TIMES.map((t) => (
          <div
            key={t.id}
            onClick={() => setTime(t.id)}
            className={`flex items-center gap-4 p-4.5 rounded-2xl cursor-pointer transition-all
              ${time === t.id
                ? "border-[2.5px] border-amber-brand bg-db-cream"
                : "border-[1.5px] border-border-light bg-surface"
              }`}
          >
            <span className="text-2xl">{t.emoji}</span>
            <div>
              <div className="font-semibold text-[0.95rem] text-text-heading">{t.label}</div>
              <div className="text-xs text-text-muted">{t.sub}</div>
            </div>
            {time === t.id && (
              <Star size={16} fill="#c9a87c" className="text-amber-brand ml-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}