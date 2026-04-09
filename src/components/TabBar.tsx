"use client";

import { t } from "@/lib/i18n";
import type { Language, TabId } from "@/lib/types";

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  language: Language;
}

export default function TabBar({ activeTab, onTabChange, language }: TabBarProps) {
  const labels = t(language).tabs;
  const TABS: { id: TabId; label: string }[] = [
    { id: "portfolio", label: labels.portfolio },
    { id: "loadUrl", label: labels.loadUrl },
    { id: "compare", label: labels.compare },
    { id: "leadInbox", label: labels.leadInbox },
  ];
  return (
    <nav
      aria-label="Demo sections"
      className="border-b border-white/[0.04] bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex-shrink-0 text-[13px] font-medium px-4 py-1.5 rounded-full border transition-all duration-200 ${
                active
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                  : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/[0.15]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
