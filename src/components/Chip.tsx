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
