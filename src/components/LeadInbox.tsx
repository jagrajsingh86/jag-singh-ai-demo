"use client";

import { useState, useEffect, useCallback } from "react";
import { t } from "@/lib/i18n";
import type { Lead } from "@/lib/leads";
import type { Language } from "@/lib/types";

export default function LeadInbox({ language = "en" }: { language?: Language }) {
  const strings = t(language).leadInbox;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/demo/api/leads");
      if (!res.ok) throw new Error("fetch_failed");
      const data = (await res.json()) as { leads: Lead[] };
      setLeads(data.leads);
    } catch {
      setError("Couldn't load leads — try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-white text-lg font-semibold tracking-tight">{strings.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{strings.subtitle}</p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex-shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-full border border-white/[0.1] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : strings.refresh}
        </button>
      </div>

      {/* Demo-only banner */}
      <div className="mb-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3 text-[12px] text-cyan-300/80">
        {strings.banner}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && leads.length === 0 && !error && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
          <p className="text-slate-400 text-sm">{strings.empty}</p>
        </div>
      )}

      {leads.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/60 to-slate-950/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/[0.06]">
                  <th className="px-4 py-3 font-medium">{strings.cols.capturedAt}</th>
                  <th className="px-4 py-3 font-medium">{strings.cols.name}</th>
                  <th className="px-4 py-3 font-medium">{strings.cols.mobile}</th>
                  <th className="px-4 py-3 font-medium">{strings.cols.email}</th>
                  <th className="px-4 py-3 font-medium">{strings.cols.property}</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(l.capturedAt)}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{l.name}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs whitespace-nowrap">
                      {l.mobile}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">
                      {l.email}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {l.property}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        {l.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
