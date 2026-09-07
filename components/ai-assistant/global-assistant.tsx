"use client";

import { useEffect, useMemo, useState } from "react";
import { Atom, Bot, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAssistantResponse } from "./assistant-service";
import { useAssistantContext } from "./assistant-context";

type Message = { role: "assistant" | "user"; text: string };

const pageDetails: Record<string, { name: string; context: string; opening: string; actions: string[] }> = {
  "/": { name: "Home", context: "You're on Home", opening: "You're exploring NIRVANA. I can guide you through quantum concepts, experiments, and circuits. What would you like to explore?", actions: ["What should I learn?", "Start an experiment"] },
  "/concepts": { name: "Concepts", context: "You're learning quantum concepts", opening: "I can see you're in the concepts section. I can explain the current idea, connect it to a circuit, or show a simple example.", actions: ["Explain this", "Give me an example", "Quiz me"] },
  "/experiments": { name: "Experiments", context: "You're exploring the experiment library", opening: "I can help you interpret the expected behavior of this experiment and explain how the circuit leads to the result.", actions: ["Why does this happen?", "What should I observe?", "Show the expected result"] },
  "/learn": { name: "Learn", context: "You're learning Quantum Concepts", opening: "I can see you're in the Learn section. I can explain the current quantum concept, give examples, or quiz you on what you've learned.", actions: ["Explain this", "Give me an example", "Quiz me"] },
  "/circuit-lab": { name: "Circuit Lab", context: "You're building a quantum circuit", opening: "You're in the Circuit Lab. I can inspect your current circuit, explain each gate, identify possible mistakes, or help you understand the measurement results.", actions: ["Explain my circuit", "Find a mistake", "Predict the result"] },
  "/ai-tutor": { name: "AI Tutor", context: "You're using AI Tutor", opening: "I can help you understand quantum computing concepts or work through a problem step by step.", actions: ["Explain superposition", "Give me an example"] },
  "/dashboard": { name: "Dashboard", context: "You're viewing your progress", opening: "I can analyze your learning progress and suggest what you should learn or experiment with next.", actions: ["Analyze my progress", "What should I learn next?"] },
};

export default function GlobalAssistant() {
  const pathname = usePathname();
  const { context } = useAssistantContext();
  const details = pageDetails[pathname] ?? pageDetails["/"];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(true);

  const currentContext = useMemo(() => ({ ...context, currentPage: details.name, currentSection: details.context }), [context, details]);

  useEffect(() => {
    setMessages([{ role: "assistant", text: details.opening }]);
    setUnread(true);
  }, [details.opening]);

  const submit = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "assistant", text: getAssistantResponse(trimmed, currentContext) }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {open && (
        <section aria-label="Quantum AI Assistant" className="assistant-panel flex w-[calc(100vw-2rem)] max-w-[400px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.16)] transition-all dark:border-slate-700 dark:bg-slate-900">
          <header className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"><Atom size={19} /></div><div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ask NIRVANA</h2><p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Context aware</p></div><button aria-label="Close assistant" onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-slate-700 dark:hover:text-white"><X size={17} /></button></div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{details.context}</p>
          </header>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === "user" ? "justify-end" : ""}`}><div className={`max-w-[88%] rounded-xl px-3 py-2.5 text-xs leading-5 ${message.role === "user" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" : "border border-emerald-100 bg-emerald-50 text-slate-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-slate-200"}`}>{message.role === "assistant" && <Bot className="mb-1 text-emerald-600 dark:text-emerald-300" size={14} />}{message.text}</div></div>)}</div>
          <div className="border-t border-slate-200 p-3 dark:border-slate-700"><div className="mb-3 flex flex-wrap gap-1.5">{details.actions.map((action) => <button key={action} onClick={() => submit(action)} className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40">{action}</button>)}</div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 focus-within:border-emerald-400 dark:border-slate-700 dark:bg-slate-950"><label className="sr-only" htmlFor="global-assistant-input">Ask Quantum AI Assistant</label><input id="global-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Ask about this page..." className="min-w-0 flex-1 bg-transparent px-1 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" /><button aria-label="Send message" onClick={() => submit()} className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700"><Send size={14} /></button></div></div>
        </section>
      )}
      <button aria-label={open ? "Close Quantum AI Assistant" : "Open Quantum AI Assistant"} onClick={() => { setOpen((current) => !current); setUnread(false); }} className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-[0_10px_30px_rgba(5,150,105,.28)] transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(5,150,105,.36)] dark:from-emerald-500 dark:to-teal-600 ${unread && !open ? "assistant-pulse" : ""}`}>{open ? <X size={21} /> : <MessageSquare size={21} />}{unread && !open && <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-cyan-500 dark:border-slate-950" />}</button>
      <span className="sr-only">{open ? "Assistant panel open" : "Assistant panel closed"}</span>
    </div>
  );
}
