// src/components/StepDreams.tsx
// ============================================
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
  const toggleDream = useCallback(
    (id: string) => {
      setDreams((p) =>
        p.includes(id) ? p.filter((x) => x !== id) : p.length < 8 ? [...p, id] : p
      );
    },
    [setDreams]
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-text-heading mb-1.5 font-serif">
        What are your dreams?
      </h2>
      <p className="text-sm text-text-sub mb-5">
        Pick 2–8 categories, then fill in the details
      </p>

      {/* Category grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {DREAMS.map((d) => {
          const sel = dreams.includes(d.id);
          const maxed = !sel && dreams.length >= 8;
          return (
            <div
              key={d.id}
              onClick={() => !maxed && toggleDream(d.id)}
              className={`py-3.5 px-2 rounded-[14px] cursor-pointer text-center transition-all
                ${sel
                  ? "border-[2.5px] border-amber-brand bg-db-cream"
                  : "border-[1.5px] border-border-light bg-surface"
                }
                ${maxed ? "opacity-40 pointer-events-none" : ""}
              `}
            >
              <div className="text-xl mb-1">{d.emoji}</div>
              <div className={`text-xs font-semibold ${sel ? "text-text-label" : "text-text-warm"}`}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail forms */}
      {dreams.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="text-xs font-semibold text-text-muted tracking-wider uppercase">
            Fill in the details
          </div>
          {dreams.map((id) => {
            const dr = DREAMS.find((x) => x.id === id)!;
            return (
              <div key={id} className="bg-surface rounded-[14px] p-3.5">
                <div className="text-sm font-semibold text-text-main mb-2.5">
                  {dr.emoji} {dr.label}
                </div>
                <DreamDetail id={id} details={details} setDetails={setDetails} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}