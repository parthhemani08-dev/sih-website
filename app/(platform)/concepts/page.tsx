"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, Cpu, Sparkles } from "lucide-react";

const topics = [
  {
    id: "qubits",
    title: "Qubits",
    badge: "01",
    summary: "A qubit stores quantum information as a superposition of |0⟩ and |1⟩.",
    body:
      "A classical bit is always 0 or 1. A qubit carries amplitudes, so the system can occupy a combination of both basis states until measurement collapses it to a definite outcome.",
    formula: "|ψ⟩ = α|0⟩ + β|1⟩",
    takeaway: "The state carries probability amplitudes, not just a single stored value.",
  },
  {
    id: "superposition",
    title: "Superposition",
    badge: "02",
    summary: "The Hadamard gate creates an equal mixture of basis states.",
    body:
      "When a qubit is placed in superposition, the amplitudes for |0⟩ and |1⟩ are equal in magnitude. Measuring the system yields a probabilistic result, but the full state still contains both possibilities before the measurement event.",
    formula: "H|0⟩ = (|0⟩ + |1⟩)/√2",
    takeaway: "Superposition is the source of quantum uncertainty rather than a classical random coin flip.",
  },
  {
    id: "measurement",
    title: "Measurement",
    badge: "03",
    summary: "Measurement converts a quantum state into a classical result.",
    body:
      "Measurement is not just observation; it projects the system into one basis state with probability determined by the squared amplitudes. That is why probability distributions are so central to quantum workflows.",
    formula: "P(0) = |α|², P(1) = |β|²",
    takeaway: "The amplitudes define the probabilities; the measurement outcome chooses a single branch.",
  },
  {
    id: "gates",
    title: "Quantum Gates",
    badge: "04",
    summary: "Gates are unitary operations that rotate the quantum state.",
    body:
      "Single-qubit gates like H, X, Y, and Z move the state around the Bloch sphere. Multi-qubit gates such as CNOT create correlations across qubits and are the building blocks for entanglement.",
    formula: "U†U = I",
    takeaway: "Quantum gates preserve probability norms while changing the state geometry.",
  },
  {
    id: "entanglement",
    title: "Entanglement",
    badge: "05",
    summary: "Two qubits can share a joint state that cannot be factored independently.",
    body:
      "The Bell state is a classic example: measuring either qubit gives a correlated result. The pair behaves as one system, not as two independent classical bits with hidden values.",
    formula: "(|00⟩ + |11⟩)/√2",
    takeaway: "Entanglement creates correlations stronger than any classical preparation can reproduce.",
  },
  {
    id: "algorithms",
    title: "Quantum Algorithms",
    badge: "06",
    summary: "Algorithms exploit interference and amplitude amplification.",
    body:
      "Many quantum algorithms rely on constructing phase relationships so that desirable states reinforce while incorrect ones cancel. This is the heart of the speedups researchers are exploring.",
    formula: "Amplitude amplification",
    takeaway: "Quantum advantage appears when the algorithm uses interference deliberately rather than simply sampling random outcomes.",
  },
];

export default function ConceptsPage() {
  const [selected, setSelected] = useState<string>(topics[0].id);

  const activeTopic = useMemo(
    () => topics.find((topic) => topic.id === selected) ?? topics[0],
    [selected],
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8">
      <section className="glass rounded-[28px] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Concepts</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">
              Build your understanding of quantum computing from first principles.
            </h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d141a] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
            <BookOpen size={14} className="text-[#9fe7b7]" />
            Foundations track
          </button>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelected(topic.id)}
              className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition ${
                selected === topic.id
                  ? "border-[#214d3d] bg-[#10241d] text-white"
                  : "border-slate-800 bg-[#0d141a] text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="glass rounded-[24px] p-4 sm:p-5">
          <div className="space-y-3">
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelected(topic.id)}
                className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-3 text-left transition ${
                  selected === topic.id
                    ? "border-[#214d3d] bg-[#10241d]"
                    : "border-slate-800 bg-[#0d141a] hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">{topic.badge}</div>
                  <div className="mt-2 text-base font-medium text-white">{topic.title}</div>
                </div>
                <ArrowRight size={14} className="mt-1 text-slate-500" />
              </button>
            ))}
          </div>
        </aside>

        <article className="glass rounded-[24px] p-5 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">{activeTopic.badge}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{activeTopic.title}</h2>
            </div>
            <div className="rounded-full border border-[#1f3d37] bg-[#10271f] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#9fe7b7]">
              Core idea
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{activeTopic.summary}</p>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-800 bg-[#0d141a] p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <BrainCircuit size={14} className="text-[#9fe7b7]" />
                Concept explanation
              </div>
              <p className="text-sm leading-7 text-slate-300">{activeTopic.body}</p>
            </div>

            <div className="rounded-2xl border border-[#1d2c2f] bg-[#0d1d1d] p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#9fe7b7]">
                <Cpu size={14} />
                Interactive example
              </div>
              <div className="rounded-xl border border-[#214d3d] bg-[#10241d] p-4 font-mono text-sm text-[#d7f9e6]">
                {activeTopic.formula}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{activeTopic.takeaway}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Sparkles size={16} className="text-[#9fe7b7]" />
              Key takeaway
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{activeTopic.takeaway}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
