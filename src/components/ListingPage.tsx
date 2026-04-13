"use client";

import type { ChatMessage, Language, Property } from "@/lib/types";
import FloatingChat from "@/components/FloatingChat";

interface ListingPageProps {
  property: Property;
  language: Language;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
  leadCaptured: boolean;
  onLeadCaptured: () => void;
}

export default function ListingPage({
  property,
  language,
  messages,
  onMessagesChange,
  leadCaptured,
  onLeadCaptured,
}: ListingPageProps) {
  const p = property;

  return (
    <div className="relative min-h-screen">
      {/* Hero banner */}
      <div className="bg-gradient-to-b from-[#d97706]/10 via-slate-950 to-slate-950 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d97706] bg-[#d97706]/10 border border-[#d97706]/20 px-2.5 py-1 rounded-full">
              {p.propertyType}
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
              SENTINEL Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {p.address}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mt-2">{p.headline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Stat label="Bedrooms" value={String(p.bedrooms)} />
            <Stat label="Bathrooms" value={String(p.bathrooms)} />
            <Stat label="Car Spaces" value={String(p.carSpaces)} />
            {p.landSize && <Stat label="Land" value={p.landSize} />}
            {p.yearBuilt && <Stat label="Built" value={String(p.yearBuilt)} />}
          </div>

          <div className="mt-6">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider">Price Guide</span>
            <p className="text-xl sm:text-2xl font-bold text-[#d97706] mt-1">{p.priceGuide}</p>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {p.features && (
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard title="Kitchen" items={p.features.kitchen} accent="amber" />
            <FeatureCard title="Living Areas" items={p.features.living} accent="cyan" />
            <FeatureCard title="Bedrooms" items={p.features.bedrooms} accent="cyan" />
            <FeatureCard title="Outdoor" items={p.features.outdoor} accent="amber" />
            <FeatureCard title="Climate Control" items={p.features.climate} accent="cyan" />
            <FeatureCard title="Security" items={p.features.security} accent="cyan" />
            <FeatureCard title="Smart Home" items={p.features.smart} accent="amber" />
          </div>
        )}

        {/* Schools + Transport */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {p.schoolCatchment && (
            <InfoCard title="School Catchment" icon="🎓">
              {p.schoolCatchment.primary && <InfoRow label="Primary" value={p.schoolCatchment.primary} />}
              {p.schoolCatchment.secondary && <InfoRow label="Secondary" value={p.schoolCatchment.secondary} />}
              {p.schoolCatchment.private && <InfoRow label="Private" value={p.schoolCatchment.private} />}
              {p.schoolCatchment.earlyChildhood && <InfoRow label="Early Childhood" value={p.schoolCatchment.earlyChildhood} />}
            </InfoCard>
          )}

          {p.transport && (
            <InfoCard title="Transport & Amenities" icon="🚇">
              {p.transport.metro && <InfoRow label="Metro" value={p.transport.metro} />}
              {p.transport.bus && <InfoRow label="Bus" value={p.transport.bus} />}
              {p.transport.shopping && <InfoRow label="Shopping" value={p.transport.shopping} />}
            </InfoCard>
          )}
        </div>

        {/* Inspection */}
        {p.inspectionTimes && (
          <div className="mt-8 rounded-2xl border border-[#d97706]/20 bg-[#d97706]/5 p-6">
            <h3 className="text-white font-semibold text-base mb-2">Next Inspection</h3>
            {p.inspectionTimes.upcoming && (
              <p className="text-[#d97706] font-medium">{p.inspectionTimes.upcoming}</p>
            )}
            {p.inspectionTimes.note && (
              <p className="text-slate-400 text-sm mt-1">{p.inspectionTimes.note}</p>
            )}
          </div>
        )}

        {/* Agent card */}
        {p.agent && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d97706] to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#d97706]/20">
              <span className="text-slate-900 font-bold text-lg">JS</span>
            </div>
            <div>
              <p className="text-white font-semibold">{p.agent.name}</p>
              <p className="text-slate-400 text-sm">{p.agent.agency}</p>
              <p className="text-slate-500 text-xs mt-1">{p.agent.mobile} &middot; {p.agent.email}</p>
            </div>
          </div>
        )}

        {/* Demo context banner */}
        <div className="mt-8 rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3 text-[12px] text-cyan-300/80">
          <strong className="text-cyan-300">SENTINEL Demo:</strong> This is a live listing page powered by SENTINEL.
          The floating chat widget (bottom-right) is your 24/7 AI concierge — it qualifies leads, answers
          questions, and books inspections automatically. In production, this embeds on your agency website.
        </div>
      </div>

      {/* Floating chat widget */}
      <FloatingChat
        propertyId={p.id}
        propertyAddress={p.address}
        language={language}
        messages={messages}
        onMessagesChange={onMessagesChange}
        leadCaptured={leadCaptured}
        onLeadCaptured={onLeadCaptured}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function FeatureCard({ title, items, accent }: { title: string; items: string[]; accent: "amber" | "cyan" }) {
  const dot = accent === "amber" ? "bg-[#d97706]" : "bg-cyan-400";
  const heading = accent === "amber" ? "text-[#d97706]" : "text-cyan-400";
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <h3 className={`text-sm font-semibold uppercase tracking-wider ${heading} mb-3`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <h3 className="text-white font-semibold text-base mb-3">
        <span className="mr-2">{icon}</span>{title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] text-slate-500 uppercase tracking-wider w-24 shrink-0 mt-0.5">{label}</span>
      <span className="text-slate-300 text-sm">{value}</span>
    </div>
  );
}
