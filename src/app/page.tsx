"use client";

import { useState, useCallback, useMemo } from "react";
import ChatWidget from "@/components/ChatWidget";
import TabBar from "@/components/TabBar";
import PropertyGrid from "@/components/PropertyGrid";
import LeadInbox from "@/components/LeadInbox";
import LoadUrlPanel from "@/components/LoadUrlPanel";
import ComparePanel from "@/components/ComparePanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CURATED_PROPERTIES } from "@/data/properties";
import { t } from "@/lib/i18n";
import type { ChatMessage, Language, Property, TabId } from "@/lib/types";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<TabId>("portfolio");
  const [runtimeProperties, setRuntimeProperties] = useState<Property[]>([]);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [messagesByProperty, setMessagesByProperty] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [leadCapturedByProperty, setLeadCapturedByProperty] = useState<
    Record<string, boolean>
  >({});

  const strings = t(language);

  const allProperties = useMemo<Property[]>(
    () => [...CURATED_PROPERTIES, ...runtimeProperties],
    [runtimeProperties]
  );

  const findProperty = useCallback(
    (id: string) => allProperties.find((p) => p.id === id),
    [allProperties]
  );

  const ensureMessagesForProperty = useCallback(
    (id: string, address: string) => {
      setMessagesByProperty((prev) => {
        if (prev[id]) return prev;
        return {
          ...prev,
          [id]: [
            { role: "assistant", content: t(language).chat.welcome(address) },
          ],
        };
      });
    },
    [language]
  );

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
      <header className="border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <span className="text-slate-900 font-bold text-sm">JS</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white tracking-tight truncate">
                Jag Singh AI
              </div>
              <div className="text-[11px] text-slate-500 tracking-wide truncate">
                {strings.header.tagline}
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
                {strings.header.live}
              </span>
            </div>
          </div>
        </div>
      </header>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} language={language} />

      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col min-h-0">
        {activeTab === "portfolio" && (
          <PortfolioPanel
            properties={allProperties}
            activeProperty={activeProperty}
            onSelect={openPropertyChat}
            onBack={() => setActivePropertyId(null)}
            language={language}
            messages={
              activePropertyId ? messagesByProperty[activePropertyId] ?? [] : []
            }
            onMessagesChange={
              activePropertyId ? updateMessages(activePropertyId) : () => {}
            }
            leadCaptured={
              activePropertyId
                ? leadCapturedByProperty[activePropertyId] ?? false
                : false
            }
            onLeadCaptured={
              activePropertyId ? markLeadCaptured(activePropertyId) : () => {}
            }
          />
        )}

        {activeTab === "loadUrl" && (
          <LoadUrlPanel onPropertyReady={addRuntimeProperty} />
        )}

        {activeTab === "compare" && (
          <ComparePanel properties={allProperties} language={language} />
        )}

        {activeTab === "leadInbox" && <LeadInbox language={language} />}
      </main>
    </div>
  );
}

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
      <div className="px-4 sm:px-6 py-6">
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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="border-b border-white/[0.04] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="text-[12px] text-slate-400 hover:text-amber-300 mb-2 inline-flex items-center gap-1 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ← {strings.tabs.portfolio}
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-white font-semibold text-base sm:text-lg tracking-tight">
                {activeProperty.address}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                {activeProperty.headline}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{activeProperty.bedrooms} Bed</span>
              <span>{activeProperty.bathrooms} Bath</span>
              <span>{activeProperty.carSpaces} Car</span>
              {activeProperty.landSize && (
                <span className="hidden sm:inline">{activeProperty.landSize}</span>
              )}
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
