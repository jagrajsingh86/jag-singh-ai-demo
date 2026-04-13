"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead } from "@/lib/leads";
import type { QuestionTrend, ConversionMetrics, QuestionLog } from "@/lib/types";

interface DashboardData {
  leads: Lead[];
  trends: QuestionTrend[];
  metrics: ConversionMetrics;
  recentQuestions: QuestionLog[];
}

export default function AgencyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/demo/api/analytics");
      if (!res.ok) throw new Error("fetch_failed");
      setData(await res.json());
    } catch {
      // silently fail — empty state handles it
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const m = data?.metrics ?? { totalEnquiries: 0, leadsCapured: 0, inspectionsBooked: 0, conversionRate: 0 };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d97706] bg-[#d97706]/10 border border-[#d97706]/20 px-2.5 py-1 rounded-full">
              Agency Dashboard
            </span>
          </div>
          <h2 className="text-white text-lg font-bold tracking-tight">
            SENTINEL — The ROI View
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            What the Principal sees. Live lead capture, question trends, and conversion tracking.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex-shrink-0 text-[12px] font-medium px-4 py-2 rounded-full border border-white/[0.1] text-slate-300 hover:text-[#d97706] hover:border-[#d97706]/40 disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Demo banner */}
      <div className="mb-6 rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3 text-[12px] text-cyan-300/80">
        <strong className="text-cyan-300">Demo:</strong> All data resets on server restart.
        In production, this connects to your CRM and persists permanently.
        Go to the <strong>Listing Page</strong> tab and chat with SENTINEL to generate data here.
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Enquiries" value={String(m.totalEnquiries)} accent="white" />
        <MetricCard label="Leads Captured" value={String(m.leadsCapured)} accent="amber" />
        <MetricCard label="Inspections Booked" value={String(m.inspectionsBooked)} accent="emerald" />
        <MetricCard label="Conversion Rate" value={`${m.conversionRate}%`} accent="cyan" />
      </div>

      {/* Two-column: Trends + Recent Questions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Question Trends */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h3 className="text-white font-semibold text-sm mb-4">
            Question Trends
          </h3>
          <p className="text-slate-500 text-xs mb-4">
            What are buyers asking about most?
          </p>
          {(!data?.trends || data.trends.length === 0) ? (
            <p className="text-slate-500 text-sm py-6 text-center">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.trends.slice(0, 8).map((t) => (
                <div key={t.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-300 text-sm">{t.category}</span>
                    <span className="text-slate-500 text-xs">{t.count} ({t.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d97706] to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Questions */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h3 className="text-white font-semibold text-sm mb-4">
            Recent Buyer Questions
          </h3>
          {(!data?.recentQuestions || data.recentQuestions.length === 0) ? (
            <p className="text-slate-500 text-sm py-6 text-center">No questions yet</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
              {data.recentQuestions.map((q) => (
                <div key={q.id} className="border-b border-white/[0.04] pb-3 last:border-0">
                  <p className="text-slate-200 text-sm leading-relaxed">&ldquo;{q.question}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-[#d97706]/80 bg-[#d97706]/10 border border-[#d97706]/20 px-2 py-0.5 rounded-full">
                      {q.category}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formatTime(q.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead Cards */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h3 className="text-white font-semibold text-sm mb-4">
          Active Leads
        </h3>
        {(!data?.leads || data.leads.length === 0) ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            No leads captured yet. Chat with SENTINEL on the Listing Page to generate a lead.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {data.leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-xl border border-[#d97706]/20 bg-[#d97706]/5 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{lead.name}</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Qualified
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-400">
                    <span className="text-slate-500 text-xs w-14 inline-block">Mobile</span>
                    <span className="text-slate-300">{lead.mobile}</span>
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-500 text-xs w-14 inline-block">Email</span>
                    <span className="text-slate-300">{lead.email}</span>
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-500 text-xs w-14 inline-block">Property</span>
                    <span className="text-slate-300">{lead.property}</span>
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">{formatTime(lead.capturedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  const colors: Record<string, string> = {
    white: "text-white",
    amber: "text-[#d97706]",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
  };
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center">
      <p className={`text-3xl font-bold ${colors[accent] ?? "text-white"}`}>{value}</p>
      <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-AU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
