"use client";

import { useState, useRef } from "react";
import PropertyGrid from "@/components/PropertyGrid";
import { ChatTranscript } from "@/components/ChatWidget";
import { t } from "@/lib/i18n";
import type { ChatMessage, Language, Property } from "@/lib/types";

interface ComparePanelProps {
  properties: Property[];
  language: Language;
}

export default function ComparePanel({ properties, language }: ComparePanelProps) {
  const strings = t(language);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [leftMessages, setLeftMessages] = useState<ChatMessage[]>([]);
  const [rightMessages, setRightMessages] = useState<ChatMessage[]>([]);
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const left = properties.find((p) => p.id === selectedIds[0]);
  const right = properties.find((p) => p.id === selectedIds[1]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function exit() {
    setStarted(false);
    setSelectedIds([]);
    setLeftMessages([]);
    setRightMessages([]);
    setInput("");
  }

  async function askProperty(
    property: Property,
    history: ChatMessage[],
    setMessages: (m: ChatMessage[]) => void,
    setLoading: (b: boolean) => void
  ) {
    setLoading(true);
    try {
      const res = await fetch("/demo/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          propertyId: property.id,
          language,
          mode: "compare",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages([...history, { role: "assistant", content: strings.chat.errorRetry }]);
      } else {
        setMessages([...history, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([...history, { role: "assistant", content: strings.chat.errorRetry }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendShared(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || leftLoading || rightLoading || !left || !right) return;

    const userMsg: ChatMessage = { role: "user", content: messageText };
    const nextLeft = [...leftMessages, userMsg];
    const nextRight = [...rightMessages, userMsg];
    setLeftMessages(nextLeft);
    setRightMessages(nextRight);
    setInput("");

    await Promise.all([
      askProperty(left, nextLeft, setLeftMessages, setLeftLoading),
      askProperty(right, nextRight, setRightMessages, setRightLoading),
    ]);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendShared();
    }
  }

  // Selection stage
  if (!started) {
    return (
      <div className="px-4 sm:px-6 py-6">
        <div className="mb-5">
          <h2 className="text-white text-lg font-semibold tracking-tight">{strings.compare.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{strings.compare.subtitle}</p>
        </div>
        <PropertyGrid
          properties={properties}
          onSelect={toggleSelect}
          selectable
          maxSelectable={2}
          selectedIds={selectedIds}
        />
        <div className="mt-6 flex items-center justify-between gap-3 sticky bottom-4">
          <span className="text-xs text-slate-500">
            {selectedIds.length}/2 — {strings.compare.selectPrompt}
          </span>
          <button
            onClick={() => setStarted(true)}
            disabled={selectedIds.length !== 2}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-semibold text-sm hover:from-amber-300 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
          >
            {strings.compare.startCompare}
          </button>
        </div>
      </div>
    );
  }

  // Compare stage
  if (!left || !right) {
    exit();
    return null;
  }

  const showSuggestions = leftMessages.length === 0 && rightMessages.length === 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={exit}
          className="text-[12px] text-slate-400 hover:text-amber-300 transition-colors"
        >
          ← {strings.compare.exit}
        </button>
        <span className="text-[11px] text-slate-500">{strings.compare.title}</span>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <ColumnHeader property={left} />
        <ColumnHeader property={right} />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] overflow-hidden">
        <div className="flex flex-col min-h-0 overflow-hidden">
          <ChatTranscript messages={leftMessages} isLoading={leftLoading} />
        </div>
        <div className="flex flex-col min-h-0 overflow-hidden">
          <ChatTranscript messages={rightMessages} isLoading={rightLoading} />
        </div>
      </div>

      {showSuggestions && (
        <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-2 border-t border-white/[0.06]">
          {strings.compare.suggested.map((q) => (
            <button
              key={q}
              onClick={() => sendShared(q)}
              className="text-[12px] px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-300/80 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-white/[0.06] bg-slate-950/80 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={strings.compare.sharedPlaceholder}
            rows={1}
            className="flex-1 resize-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[15px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={() => sendShared()}
            disabled={!input.trim() || leftLoading || rightLoading}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 flex items-center justify-center hover:from-amber-300 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-5 5m5-5l5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ColumnHeader({ property }: { property: Property }) {
  return (
    <div className="px-4 sm:px-5 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-[14px] tracking-tight truncate">
            {property.address}
          </h3>
          <p className="text-slate-500 text-[11px] mt-0.5 truncate">{property.headline}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 text-[11px] text-slate-400">
          <span>{property.bedrooms}B</span>
          <span>{property.bathrooms}Ba</span>
          <span className="text-amber-300/80 font-medium">{property.priceGuide}</span>
        </div>
      </div>
    </div>
  );
}
