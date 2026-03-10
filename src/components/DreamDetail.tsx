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
