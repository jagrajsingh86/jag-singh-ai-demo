"use client";

import type { Property } from "@/lib/types";

interface PropertyGridProps {
  properties: Property[];
  onSelect: (id: string) => void;
  selectable?: boolean;
  maxSelectable?: number;
  selectedIds?: string[];
}

export default function PropertyGrid({
  properties,
  onSelect,
  selectable = false,
  maxSelectable = 2,
  selectedIds = [],
}: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {properties.map((p) => {
        const selectionIndex = selectedIds.indexOf(p.id);
        const isSelected = selectionIndex !== -1;
        const disabled =
          selectable && !isSelected && selectedIds.length >= maxSelectable;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            disabled={disabled}
            className={`group text-left rounded-2xl border transition-all duration-200 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm ${
              isSelected
                ? "border-amber-500/60 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                : "border-white/[0.08] hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
            } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {/* Top strip with type badge + selection number */}
            <div className="flex items-center justify-between px-4 pt-4">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-400/70 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {p.propertyType}
              </span>
              {selectable && isSelected && (
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 text-xs font-bold flex items-center justify-center shadow-md">
                  {selectionIndex + 1}
                </span>
              )}
              {p.source !== "curated" && (
                <span className="text-[9px] font-medium tracking-wider uppercase text-cyan-400/70 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  {p.source === "url" ? "Loaded URL" : "Manual"}
                </span>
              )}
            </div>

            <div className="px-4 pt-3 pb-4">
              <h3 className="text-white font-semibold text-[15px] leading-snug tracking-tight line-clamp-2">
                {p.address}
              </h3>
              <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                {p.headline}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m-6 0h6"
                      />
                    </svg>
                    {p.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                      />
                    </svg>
                    {p.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                      />
                    </svg>
                    {p.carSpaces}
                  </span>
                </div>
                <span className="text-amber-300/80 font-medium text-[11px]">
                  {p.priceGuide}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
