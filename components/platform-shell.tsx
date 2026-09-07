"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Atom, BarChart3, BookOpen, CircuitBoard, Cpu, Eye, FlaskConical, Menu, MessageSquare, Moon, Sun, X, Zap } from "lucide-react";
import GlobalAssistant from "@/components/ai-assistant/global-assistant";
import { AssistantProvider } from "@/components/ai-assistant/assistant-context";

const navGroups = [
  { label: "Explore", items: [{ href: "/", label: "Home", icon: Atom }, { href: "/concepts", label: "Concepts", icon: BookOpen }, { href: "/experiments", label: "Experiments", icon: FlaskConical }] },
  { label: "Create", items: [{ href: "/circuit-lab", label: "Circuit Lab", icon: Cpu }] },
  { label: "Understand", items: [{ href: "/ai-tutor", label: "AI Tutor", icon: MessageSquare }, { href: "/dashboard", label: "Dashboard", icon: BarChart3 }] },
];

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    document.documentElement.classList.toggle("dark", nextMode);
    localStorage.setItem("quantumlab-theme", nextMode ? "dark" : "light");
    setDarkMode(nextMode);
  };
  const isActive = (href: string) => href === "/" ? path === "/" : path.startsWith(href);

  return (
    <AssistantProvider>
      <div className="min-h-screen bg-[#05080d] text-slate-100">
        <aside className={`fixed inset-y-0 left-0 z-40 w-[270px] border-r border-slate-800 bg-[#090d12]/95 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1d2c2f] bg-[#0d1d1d] text-[#9fe7b7]">
                <Atom size={18} />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-slate-100">NIRVANA</span>
            </Link>
            <button aria-label="Close navigation" className="text-slate-400 lg:hidden" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="mt-10 space-y-7">
            {navGroups.map(({ label: group, items }) => (
              <div key={group}>
                <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{group}</p>
                <div className="space-y-1.5">
                  {items.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={`${group}-${label}`}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                          active
                            ? "border-[#214d3d] bg-[#10241d] text-slate-50 shadow-[inset_0_0_0_1px_rgba(159,231,183,0.1)]"
                            : "border-transparent bg-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/70 hover:text-slate-200"
                        }`}
                      >
                        <Icon size={15} className={active ? "text-[#9fe7b7]" : "text-slate-500"} />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="absolute bottom-5 left-5 right-5 border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#9fe7b7]">
              <Zap size={12} />
              System
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-200">
              <span className="h-2 w-2 rounded-full bg-[#9fe7b7] shadow-[0_0_12px_rgba(159,231,183,0.8)]" />
              Quantum Engine online
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">State vector / ready</p>
          </div>
        </aside>

        {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-[#02070d]/70 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="lg:pl-[270px]">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-[#090d12]/80 px-5 backdrop-blur-xl lg:px-8">
            <button aria-label="Open navigation" className="text-slate-300 lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={18} />
            </button>

            <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-slate-500 sm:flex">
              <span className="text-slate-300">NIRVANA</span>
              <span className="text-slate-700">/</span>
              <span>Quantum lab</span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#9fe7b7]" />
                Ready
              </span>
              <button
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-[#0f171e] text-slate-300 transition hover:border-[#2b433d] hover:text-[#9fe7b7]"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1f3d37] bg-[#10271f] text-[10px] font-semibold text-[#9fe7b7]">
                AL
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>

        <GlobalAssistant />
      </div>
    </AssistantProvider>
  );
}
