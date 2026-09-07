import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, CircuitBoard, FlaskConical, Sparkles } from "lucide-react";
import { QuantumStateCore } from "@/components/quantum-visuals";

const workflow = [
  { id: "01", title: "Learn", text: "Build intuition from qubits, gates, and measurement." },
  { id: "02", title: "Build", text: "Compose circuits with precise gate operations." },
  { id: "03", title: "Simulate", text: "Run the local state-vector engine and inspect results." },
  { id: "04", title: "Visualize", text: "Track amplitudes, probabilities, and Bloch states." },
  { id: "05", title: "Understand", text: "Connect behavior to the deeper quantum principles." },
];

const stats = [
  { label: "Qubits", value: "03" },
  { label: "State space", value: "8" },
  { label: "Fidelity", value: "99.2%" },
];

export default function Home() {
  return (
    <div className="quantum-grid min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8">
        <section className="glass rounded-[28px] p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#9fe7b7]" />
                Quantum learning environment
              </p>

              <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl lg:text-[4rem]">
                Understand quantum computing by actually exploring it.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                Learn concepts, build circuits, simulate quantum states, and understand why the results happen.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/circuit-lab" className="inline-flex items-center gap-2 rounded-lg border border-[#9fe7b7] bg-[#9fe7b7] px-4 py-2.5 text-sm font-semibold text-[#08110d] transition hover:bg-[#baf2d1]">
                  Enter Quantum Lab
                  <ArrowRight size={15} />
                </Link>
                <Link href="/concepts" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d141a] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white">
                  Explore concepts
                </Link>
              </div>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-slate-800 pt-5">
                {stats.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-h-[360px] items-center justify-center lg:min-h-[480px]">
              <QuantumStateCore />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-800 bg-[#0b1117]/70 p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Workflow</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Learn → Build → Simulate → Visualize → Understand</h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-[#0a1217] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:flex">
              <Sparkles size={12} className="text-[#9fe7b7]" />
              Live system
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {workflow.map(({ id, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-[#0d141a] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{id}</span>
                  <ArrowRight size={14} className="text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
