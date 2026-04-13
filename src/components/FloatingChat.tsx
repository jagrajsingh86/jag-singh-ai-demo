"use client";

import { useState, useRef } from "react";
import { t } from "@/lib/i18n";
import type { ChatMessage, Language } from "@/lib/types";

interface FloatingChatProps {
  propertyId: string;
  propertyAddress: string;
  language: Language;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
  leadCaptured: boolean;
  onLeadCaptured: () => void;
}

export default function FloatingChat({
  propertyId,
  language,
  messages,
  onMessagesChange,
  leadCaptured,
  onLeadCaptured,
}: FloatingChatProps) {
  const strings = t(language);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    onMessagesChange(updatedMessages);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/demo/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          propertyId,
          language,
          mode: "solo",
        }),
      });
      const data = await res.json();
      if (data.error) {
        onMessagesChange([...updatedMessages, { role: "assistant", content: strings.chat.errorRetry }]);
      } else {
        onMessagesChange([...updatedMessages, { role: "assistant", content: data.message }]);
        if (data.leadCaptured) onLeadCaptured();
      }
    } catch {
      onMessagesChange([...updatedMessages, { role: "assistant", content: strings.chat.errorRetry }]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const showSuggestions = messages.length === 1;
  const unreadCount = !open && messages.length > 1 ? messages.length - 1 : 0;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[70vh] rounded-2xl border border-white/[0.1] bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.08] bg-gradient-to-r from-slate-900 to-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d97706] to-amber-600 flex items-center justify-center shadow-md">
                <span className="text-slate-900 font-bold text-xs">S</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">SENTINEL</p>
                <p className="text-[10px] text-slate-500">AI Property Concierge</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors ml-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#d97706]/20 text-amber-50 border border-[#d97706]/30"
                      : "bg-white/[0.04] text-slate-200 border border-white/[0.08]"
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {strings.chat.suggested.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[12px] px-2.5 py-1 rounded-full border border-[#d97706]/30 text-[#d97706]/80 hover:bg-[#d97706]/10 hover:text-[#d97706] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {leadCaptured && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2.5 text-center">
                <p className="text-emerald-400 text-sm font-medium">{strings.chat.bookedTitle}</p>
                <p className="text-emerald-300/70 text-[11px] mt-0.5">{strings.chat.bookedSubtitle}</p>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#d97706]/60 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-[#d97706]/60 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-[#d97706]/60 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.08] px-3 py-3 bg-slate-950/90">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={strings.chat.placeholder}
                rows={1}
                className="flex-1 resize-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2.5 text-[14px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#d97706]/50 focus:ring-1 focus:ring-[#d97706]/20 transition-all"
                style={{ maxHeight: "80px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97706] to-amber-600 text-slate-900 flex items-center justify-center hover:from-amber-500 hover:to-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#d97706]/20"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-5 5m5-5l5 5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#d97706] to-amber-600 text-slate-900 flex items-center justify-center shadow-xl shadow-[#d97706]/30 hover:scale-105 transition-transform"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}

function formatMessage(content: string) {
  return content.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="text-[#d97706] font-semibold">{part.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </span>
  ));
}
