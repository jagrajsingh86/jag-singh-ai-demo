"use client";

import { useState, useRef, useEffect } from "react";
import { t } from "@/lib/i18n";
import type { ChatMessage, Language } from "@/lib/types";

interface ChatWidgetProps {
  propertyId: string;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
  leadCaptured: boolean;
  onLeadCaptured: () => void;
  language?: Language;
  mode?: "solo" | "compare";
}

export default function ChatWidget({
  propertyId,
  messages,
  onMessagesChange,
  leadCaptured,
  onLeadCaptured,
  language = "en",
  mode = "solo",
}: ChatWidgetProps) {
  const strings = t(language);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    onMessagesChange(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/demo/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          propertyId,
          language,
          mode,
        }),
      });

      const data = await res.json();

      if (data.error) {
        onMessagesChange([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              strings.chat.errorRetry,
          },
        ]);
      } else {
        onMessagesChange([
          ...updatedMessages,
          { role: "assistant", content: data.message },
        ]);
        if (data.leadCaptured) onLeadCaptured();
      }
    } catch {
      onMessagesChange([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "I apologise — I'm having a moment. Could you try that question again?",
        },
      ]);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex flex-col h-full">
      <ChatTranscript messages={messages} isLoading={isLoading}>
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {strings.chat.suggested.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[13px] px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-300/80 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50 transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {leadCaptured && (
          <div className="mx-auto max-w-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-center">
            <div className="text-emerald-400 text-sm font-medium">
              {strings.chat.bookedTitle}
            </div>
            <div className="text-emerald-300/70 text-xs mt-1">
              {strings.chat.bookedSubtitle}
            </div>
          </div>
        )}
      </ChatTranscript>

      <div className="border-t border-white/[0.06] bg-slate-950/80 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={strings.chat.placeholder}
              rows={1}
              className="w-full resize-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[15px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              style={{ maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 flex items-center justify-center hover:from-amber-300 hover:to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5m0 0l-5 5m5-5l5 5"
              />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[11px] text-slate-600">{strings.chat.poweredBy}</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ChatTranscript — exported sub-component reused by ComparePanel.
// Renders the message list, loading dots, and accepts arbitrary children
// (used by ChatWidget for the suggestion chips and lead-captured banner).
// ────────────────────────────────────────────────────────────────────────────

interface ChatTranscriptProps {
  messages: ChatMessage[];
  isLoading: boolean;
  children?: React.ReactNode;
}

export function ChatTranscript({
  messages,
  isLoading,
  children,
}: ChatTranscriptProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 scrollbar-thin">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
              msg.role === "user"
                ? "bg-amber-500/20 text-amber-50 border border-amber-500/30"
                : "bg-white/[0.04] text-slate-200 border border-white/[0.08]"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-slate-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-3.14 1.346 2.14.916a1 1 0 00.788 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-amber-400/70 uppercase tracking-wider">
                  Property Concierge
                </span>
              </div>
            )}
            {formatMessage(msg.content)}
          </div>
        </div>
      ))}

      {children}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
              <span className="text-[12px] text-slate-500">
                Reviewing property details...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

function formatMessage(content: string) {
  // Simple markdown-like bold rendering
  return content.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="text-amber-400 font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </span>
  ));
}
