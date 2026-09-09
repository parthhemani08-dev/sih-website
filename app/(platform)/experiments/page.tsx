"use client";

import Link from "next/link";
import { ArrowRight, Beaker, Cpu, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { recordLearningActivity } from "@/lib/learning-activity";

const experiments = [
  { name: "Bit Flip", difficulty: "Beginner", qubits: "1 Qubit", time: "5 min", description: "Understand how the X gate flips a qubit from |0⟩ to |1⟩.", accent: "#9fe7b7" },
  { name: "Superposition", difficulty: "Beginner", qubits: "1 Qubit", time: "8 min", description: "Observe a deterministic gate create a 50/50 probability split.", accent: "#8fe3ff" },
  { name: "Phase Flip", difficulty: "Intermediate", qubits: "1 Qubit", time: "10 min", description: "See how phase information changes the state without changing amplitudes directly.", accent: "#a7f3d0" },
  { name: "Bell State", difficulty: "Intermediate", qubits: "2 Qubits", time: "12 min", description: "Construct an entangled pair and interpret the correlated readout.", accent: "#b2e3ff" },
  { name: "Quantum Teleportation", difficulty: "Advanced", qubits: "3 Qubits", time: "15 min", description: "Trace a state transfer protocol through measurement and correction.", accent: "#d9f99d" },
];

export default function ExperimentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8">
      <section className="glass rounded-[28px] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Experiments</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">
              Learn quantum mechanics by running controlled experiments.
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-[#0d141a] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
            <Beaker size={12} className="text-[#9fe7b7]" />
            Research sandbox
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {experiments.map((experiment) => (
          <div key={experiment.name} className="glass flex flex-col gap-5 rounded-[24px] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#0d141a]" style={{ boxShadow: `inset 0 0 0 1px ${experiment.accent}22` }}>
                <Sparkles size={18} style={{ color: experiment.accent }} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">{experiment.name}</h2>
                  <span className="rounded-full border border-slate-800 bg-[#0d141a] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {experiment.difficulty}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{experiment.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  <span className="inline-flex items-center gap-2"><Cpu size={12} className="text-[#9fe7b7]" /> {experiment.qubits}</span>
                  <span className="inline-flex items-center gap-2"><Gauge size={12} className="text-[#9fe7b7]" /> {experiment.time}</span>
                  <span className="inline-flex items-center gap-2"><ShieldCheck size={12} className="text-[#9fe7b7]" /> Verified</span>
                </div>
              </div>
            </div>

            <Link
              href="/circuit-lab"
              onClick={() => recordLearningActivity("experiment_started", experiment.name, { entityId: experiment.name.toLowerCase().replaceAll(" ", "-") })}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-[#1d2c2f] bg-[#0d1d1d] px-3.5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#d8f9e6] transition hover:border-[#214d3d] hover:text-white lg:self-center"
            >
              Open experiment
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
