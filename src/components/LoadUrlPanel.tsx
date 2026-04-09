"use client";

import { useState } from "react";
import type { Property } from "@/lib/types";

interface LoadUrlPanelProps {
  onPropertyReady: (property: Property) => void;
}

// Note: load-from-URL UI text stays English by design — the form fields
// match the schema clients will need to map to a real CRM/MLS integration.

type ScrapeReason = "blocked" | "no_jsonld" | "parse_error" | "network_error";

const REASON_MESSAGES: Record<ScrapeReason, string> = {
  blocked:
    "That site blocks automated reads. In production this would be a direct API call to your CRM or MLS — no scraping required. For now, please enter the details manually below.",
  no_jsonld:
    "We couldn't find structured property data on that page. Please enter the details manually below.",
  parse_error:
    "We found data but couldn't read it. Please enter the details manually below.",
  network_error:
    "We couldn't reach that URL. Please check the link or enter the details manually below.",
};

export default function LoadUrlPanel({ onPropertyReady }: LoadUrlPanelProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ScrapeReason | null>(null);
  const [showManual, setShowManual] = useState(false);

  // Manual form fields
  const [manualAddress, setManualAddress] = useState("");
  const [manualHeadline, setManualHeadline] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualBeds, setManualBeds] = useState("");
  const [manualBaths, setManualBaths] = useState("");
  const [manualCars, setManualCars] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualType, setManualType] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setShowManual(false);
    try {
      const res = await fetch("/demo/api/properties/from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.ok && data.property) {
        onPropertyReady(data.property as Property);
      } else {
        setError(((data.reason as ScrapeReason) ?? "network_error"));
        setShowManual(true);
      }
    } catch {
      setError("network_error");
      setShowManual(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualSubmitting) return;
    setManualError(null);
    if (!manualAddress.trim() || !manualDescription.trim()) {
      setManualError("Address and description are required.");
      return;
    }
    setManualSubmitting(true);
    try {
      const res = await fetch("/demo/api/properties/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: manualAddress.trim(),
          headline: manualHeadline.trim(),
          description: manualDescription.trim(),
          beds: manualBeds ? parseInt(manualBeds, 10) : 0,
          baths: manualBaths ? parseInt(manualBaths, 10) : 0,
          cars: manualCars ? parseInt(manualCars, 10) : 0,
          price: manualPrice.trim(),
          propertyType: manualType.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok && data.property) {
        onPropertyReady(data.property as Property);
      } else {
        setManualError("Couldn't save — please check the fields.");
      }
    } catch {
      setManualError("Network error — please try again.");
    } finally {
      setManualSubmitting(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full">
      <div className="mb-5">
        <h2 className="text-white text-lg font-semibold tracking-tight">
          Load from URL
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Paste a property listing URL — we&rsquo;ll attempt to extract its
          details and let you chat with the AI about it. In production this is
          replaced with a direct CRM/MLS API call.
        </p>
      </div>

      <form
        onSubmit={handleUrlSubmit}
        className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-4 sm:p-5"
      >
        <label className="block text-[12px] font-medium text-slate-400 uppercase tracking-wider mb-2">
          Listing URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.realestate.com.au/property-..."
            className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[15px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!url.trim() || loading}
            className="flex-shrink-0 px-5 py-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-semibold text-sm hover:from-amber-300 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/20"
          >
            {loading ? "Loading..." : "Load Property"}
          </button>
        </div>
        <p className="text-[11px] text-slate-600 mt-3">
          Note: realestate.com.au and domain.com.au actively block automated
          reads. Manual entry is the reliable fallback.
        </p>
      </form>

      {error && (
        <div className="mt-4 rounded-xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-[13px] text-amber-200/90">
          {REASON_MESSAGES[error]}
        </div>
      )}

      {showManual && (
        <form
          onSubmit={handleManualSubmit}
          className="mt-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-4 sm:p-5 space-y-4"
        >
          <div>
            <h3 className="text-white text-base font-semibold tracking-tight">
              Enter property details manually
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              The AI will only know what you tell it here.
            </p>
          </div>

          <ManualField
            label="Address *"
            value={manualAddress}
            onChange={setManualAddress}
            placeholder="123 Example Street, Sydney NSW 2000"
          />
          <ManualField
            label="Headline (optional)"
            value={manualHeadline}
            onChange={setManualHeadline}
            placeholder="Renovated family home with pool"
          />

          <div>
            <label className="block text-[12px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Description *
            </label>
            <textarea
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              placeholder="Describe the property in plain English — the more detail, the smarter the chat. Mention the kitchen, bedrooms, outdoor area, schools, transport, anything notable."
              rows={6}
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ManualField
              label="Beds"
              value={manualBeds}
              onChange={setManualBeds}
              placeholder="4"
              type="number"
            />
            <ManualField
              label="Baths"
              value={manualBaths}
              onChange={setManualBaths}
              placeholder="2"
              type="number"
            />
            <ManualField
              label="Cars"
              value={manualCars}
              onChange={setManualCars}
              placeholder="2"
              type="number"
            />
            <ManualField
              label="Price"
              value={manualPrice}
              onChange={setManualPrice}
              placeholder="$1.5M"
            />
          </div>

          <ManualField
            label="Property Type"
            value={manualType}
            onChange={setManualType}
            placeholder="House / Apartment / Unit"
          />

          {manualError && (
            <div className="text-[13px] text-red-300">{manualError}</div>
          )}

          <button
            type="submit"
            disabled={manualSubmitting}
            className="w-full px-5 py-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-semibold text-sm hover:from-amber-300 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/20"
          >
            {manualSubmitting ? "Saving..." : "Open Chat"}
          </button>
        </form>
      )}
    </div>
  );
}

interface ManualFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

function ManualField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: ManualFieldProps) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
      />
    </div>
  );
}
