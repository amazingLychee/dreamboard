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
