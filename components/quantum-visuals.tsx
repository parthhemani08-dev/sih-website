import { Atom, CircleDot, Rocket } from "lucide-react";

export function QuantumStateCore() {
  return <div className="state-core relative h-72 w-72 sm:h-96 sm:w-96" aria-label="Animated quantum state core visualization" role="img"><div className="state-core-grid absolute inset-7 rounded-full" /><div className="state-core-ring state-core-ring-a" /><div className="state-core-ring state-core-ring-b" /><div className="state-core-ring state-core-ring-c" /><span className="state-core-node state-core-node-a" /><span className="state-core-node state-core-node-b" /><span className="state-core-node state-core-node-c" /><div className="state-core-center"><Atom size={42} strokeWidth={1} /></div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[.2em] text-emerald-400">STATE CORE / ACTIVE</div></div>;
}

export function QuantumOrbit() {
  return (
    <div className="quantum-visual relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
      <div className="orbit-ring orbit-ring-one" />
      <div className="orbit-ring orbit-ring-two" />
      <div className="orbit-ring orbit-ring-three" />
      <span className="orbit-particle orbit-particle-one" />
      <span className="orbit-particle orbit-particle-two" />
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600 shadow-[0_12px_35px_rgba(15,23,42,.1)]">
        <Atom size={42} strokeWidth={1.4} />
      </div>
      <CircleDot className="absolute right-8 top-10 text-cyan-600" size={16} />
      <CircleDot className="absolute bottom-12 left-8 text-emerald-600" size={13} />
      <div className="absolute bottom-1 left-1/2 h-px w-36 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
    </div>
  );
}

export function LaunchCard() {
  return (
    <div className="launch-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,.07)]">
      <div className="circuit-trace absolute right-4 top-4 h-10 w-20 opacity-60" />
      <div className="flex items-center gap-3">
        <div className="rocket-float flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-emerald-300">
          <Rocket size={21} />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[.16em] text-emerald-700">LAUNCH SEQUENCE</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Launch your first circuit</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Simulator ready</span>
        <span className="font-mono text-slate-400">Q-LAB / 01</span>
      </div>
    </div>
  );
}
