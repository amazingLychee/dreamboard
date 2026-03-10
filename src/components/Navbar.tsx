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
