"use client";

import { useState, useCallback, useMemo } from "react";
import TabBar from "@/components/TabBar";
import PropertyGrid from "@/components/PropertyGrid";
import LoadUrlPanel from "@/components/LoadUrlPanel";
import ListingPage from "@/components/ListingPage";
import AgencyDashboard from "@/components/AgencyDashboard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ChatWidget from "@/components/ChatWidget";
import { CURATED_PROPERTIES } from "@/data/properties";
import { t } from "@/lib/i18n";
import type { ChatMessage, Language, Property, TabId } from "@/lib/types";

const DEFAULT_PROPERTY_ID = "42-ironbark-ridge-rouse-hill";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<TabId>("listing");
  const [runtimeProperties, setRuntimeProperties] = useState<Property[]>([]);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [messagesByProperty, setMessagesByProperty] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [leadCapturedByProperty, setLeadCapturedByProperty] = useState<
    Record<string, boolean>
  >({});

  const allProperties = useMemo<Property[]>(
    () => [...CURATED_PROPERTIES, ...runtimeProperties],
    [runtimeProperties]
  );

  const findProperty = useCallback(
    (id: string) => allProperties.find((p) => p.id === id),
    [allProperties]
  );

  const defaultProperty = CURATED_PROPERTIES.find((p) => p.id === DEFAULT_PROPERTY_ID)!;

  const ensureMessagesForProperty = useCallback(
    (id: string, address: string) => {
      setMessagesByProperty((prev) => {
        if (prev[id]) return prev;
        return {
          ...prev,
          [id]: [{ role: "assistant", content: t(language).chat.welcome(address) }],
        };
      });
    },
    [language]
  );

  // Ensure the default listing property has messages
  if (!messagesByProperty[DEFAULT_PROPERTY_ID]) {
    ensureMessagesForProperty(DEFAULT_PROPERTY_ID, defaultProperty.address);
  }

  const openPropertyChat = useCallback(
    (id: string) => {
      const property = findProperty(id);
      if (!property) return;
      ensureMessagesForProperty(id, property.address);
      setActivePropertyId(id);
    },
    [findProperty, ensureMessagesForProperty]
  );

  const updateMessages = useCallback(
    (id: string) => (msgs: ChatMessage[]) => {
      setMessagesByProperty((prev) => ({ ...prev, [id]: msgs }));
    },
    []
  );

  const markLeadCaptured = useCallback(
    (id: string) => () => {
      setLeadCapturedByProperty((prev) => ({ ...prev, [id]: true }));
    },
    []
  );

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setActivePropertyId(null);
  }, []);

  const addRuntimeProperty = useCallback(
    (property: Property) => {
      setRuntimeProperties((prev) => {
        if (prev.some((p) => p.id === property.id)) return prev;
        return [...prev, property];
      });
      ensureMessagesForProperty(property.id, property.address);
      setActiveTab("portfolio");
      setActivePropertyId(property.id);
    },
    [ensureMessagesForProperty]
  );

  const activeProperty = activePropertyId ? findProperty(activePropertyId) : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d97706] to-amber-600 flex items-center justify-center shadow-lg shadow-[#d97706]/20 flex-shrink-0">
              <span className="text-slate-900 font-bold text-sm">S</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white tracking-tight truncate">
                SENTINEL
              </div>
              <div className="text-[10px] text-slate-500 tracking-widest uppercase truncate">
                by Jag Singh AI
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher language={language} onChange={setLanguage} />
            <div className="hidden sm:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] text-emerald-400/80 font-medium">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} language={language} />

      <main className="flex-1 flex flex-col">
        {/* Tab: Listing Page — The buyer experience */}
        {activeTab === "listing" && (
          <ListingPage
            property={defaultProperty}
            language={language}
            messages={messagesByProperty[DEFAULT_PROPERTY_ID] ?? []}
            onMessagesChange={updateMessages(DEFAULT_PROPERTY_ID)}
            leadCaptured={leadCapturedByProperty[DEFAULT_PROPERTY_ID] ?? false}
            onLeadCaptured={markLeadCaptured(DEFAULT_PROPERTY_ID)}
          />
        )}

        {/* Tab: Agency Dashboard */}
        {activeTab === "dashboard" && <AgencyDashboard />}

        {/* Tab: Portfolio */}
        {activeTab === "portfolio" && (
          <PortfolioPanel
            properties={allProperties}
            activeProperty={activeProperty}
            onSelect={openPropertyChat}
            onBack={() => setActivePropertyId(null)}
            language={language}
            messages={activePropertyId ? messagesByProperty[activePropertyId] ?? [] : []}
            onMessagesChange={activePropertyId ? updateMessages(activePropertyId) : () => {}}
            leadCaptured={activePropertyId ? leadCapturedByProperty[activePropertyId] ?? false : false}
            onLeadCaptured={activePropertyId ? markLeadCaptured(activePropertyId) : () => {}}
          />
        )}

        {/* Tab: Load from URL */}
        {activeTab === "loadUrl" && <LoadUrlPanel onPropertyReady={addRuntimeProperty} />}
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Portfolio — grid or per-property chat
// ────────────────────────────────────────────────────────────

interface PortfolioPanelProps {
  properties: Property[];
  activeProperty: Property | null | undefined;
  onSelect: (id: string) => void;
  onBack: () => void;
  language: Language;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
  leadCaptured: boolean;
  onLeadCaptured: () => void;
}

function PortfolioPanel({
  properties,
  activeProperty,
  onSelect,
  onBack,
  language,
  messages,
  onMessagesChange,
  leadCaptured,
  onLeadCaptured,
}: PortfolioPanelProps) {
  const strings = t(language);

  if (!activeProperty) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full">
        <div className="mb-5">
          <h2 className="text-white text-lg font-semibold tracking-tight">
            {strings.portfolio.title}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{strings.portfolio.subtitle}</p>
        </div>
        <PropertyGrid properties={properties} onSelect={onSelect} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 max-w-5xl mx-auto w-full">
      <div className="border-b border-white/[0.04] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="text-[12px] text-slate-400 hover:text-[#d97706] mb-2 inline-flex items-center gap-1 transition-colors"
          >
            ← {strings.tabs.portfolio}
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-white font-semibold text-base sm:text-lg tracking-tight">
                {activeProperty.address}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{activeProperty.headline}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{activeProperty.bedrooms} Bed</span>
              <span>{activeProperty.bathrooms} Bath</span>
              <span>{activeProperty.carSpaces} Car</span>
            </div>
          </div>
        </div>
      </div>
      <ChatWidget
        propertyId={activeProperty.id}
        messages={messages}
        onMessagesChange={onMessagesChange}
        leadCaptured={leadCaptured}
        onLeadCaptured={onLeadCaptured}
        language={language}
      />
    </div>
  );
}
