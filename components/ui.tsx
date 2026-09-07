import { ArrowRight, CheckCircle2, CircleHelp, Sparkles } from "lucide-react";
import Link from "next/link";

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-9"><p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[.12em] text-emerald-700"><Sparkles size={14} /> {eyebrow}</p><h1 className="text-3xl font-bold tracking-[-.04em] text-slate-900 sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div>;
}
export function StatCard({ label, value, detail, accent = "violet" }: { label: string; value: string; detail: string; accent?: string }) {
  return <div className="glass rounded-2xl p-5"><div className="mb-6 h-1 w-10 rounded-full bg-emerald-500" /><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div>;
}
export function EmptyState({ children }: { children: React.ReactNode }) { return <div className="flex items-center gap-2 text-xs text-slate-500"><CircleHelp size={14} />{children}</div>; }
export function CompleteButton({ onClick }: { onClick?: () => void }) { return <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"><CheckCircle2 size={16} /> Mark as Complete</button>; }
export function ViewLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:gap-3">{children}<ArrowRight size={16} /></Link>; }
