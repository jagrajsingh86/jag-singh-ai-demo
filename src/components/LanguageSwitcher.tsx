"use client";

import type { Language } from "@/lib/types";

interface LanguageSwitcherProps {
  language: Language;
  onChange: (l: Language) => void;
}

const OPTIONS: { id: Language; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
  { id: "hi", label: "हिन्दी" },
];

export default function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex items-center gap-1 p-1 rounded-full border border-white/[0.08] bg-white/[0.03]"
    >
      {OPTIONS.map((o) => {
        const active = o.id === language;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all ${
              active
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
