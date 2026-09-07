"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import MarkdownMessage from "@/components/markdown-message";

type Message = { role: "ai" | "user"; text: string };

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi — I'm your quantum learning guide. Ask me about a concept, a gate, or a result you want to understand." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const historyForApi = messages.map((m) => ({ role: m.role === "ai" ? "assistant" : "user", text: m.text }));

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          context: { currentPage: "AI Tutor", currentSection: "You're using AI Tutor" },
          history: historyForApi,
        }),
      });
      const data = await response.json();
      const reply = response.ok ? data.reply : "Sorry, I ran into an issue answering that. Please try again.";
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "ai", text: "I couldn't reach the server. Check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-10">
      <section className="glass rounded-[28px] p-5 sm:p-7">
        <p className="eyebrow">AI Tutor</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">What would you like to understand?</h1>
      </section>

      <div className="glass mt-6 flex min-h-[620px] flex-col overflow-hidden rounded-[28px]">
        <div className="flex items-center gap-3 border-b border-slate-800 p-4 sm:p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1d2c2f] bg-[#0d1d1d] text-[#9fe7b7]">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">NIRVANA Guide</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#9fe7b7]">Ready to help</p>
          </div>
          <Sparkles className="ml-auto text-slate-400" size={16} />
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
              <div className={`flex max-w-[88%] gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${message.role === "user" ? "bg-slate-700 text-slate-200" : "border border-[#1d2c2f] bg-[#0d1d1d] text-[#9fe7b7]"}`}>
                  {message.role === "user" ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[#9fe7b7] text-[#08110d]" : "border border-slate-800 bg-[#0d141a] text-slate-300"}`}>
                  {message.role === "ai" ? <MarkdownMessage text={message.text} /> : message.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex max-w-[88%] gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1d2c2f] bg-[#0d1d1d] text-[#9fe7b7]">
                  <Bot size={15} />
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0d141a] px-4 py-3 text-sm italic leading-6 text-slate-500">
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {["Explain My Circuit", "Find My Mistake"].map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => send(action)}
                className="rounded-lg border border-slate-800 bg-[#0d141a] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-slate-400 transition hover:border-[#214d3d] hover:text-slate-200"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="flex gap-2 rounded-2xl border border-slate-800 bg-[#0d141a] p-2 focus-within:border-[#214d3d]">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Ask anything about quantum computing..."
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button aria-label="Send message" type="button" onClick={() => send()} className="rounded-xl bg-[#9fe7b7] p-2.5 text-[#08110d] transition hover:bg-[#baf2d1]">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
