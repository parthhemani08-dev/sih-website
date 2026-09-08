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

        <section className="mt-8 overflow-hidden rounded-[32px] border border-[#1a2a2b] bg-[#050a0d]/90 p-5 shadow-[0_0_0_1px_rgba(31,61,55,0.45)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_50%_20%,rgba(110,255,195,0.11),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.08),transparent_25%),linear-gradient(180deg,#071014,#0a1117)] p-5 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden="true" />
            <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-[#9fe7b7]/8 blur-3xl" aria-hidden="true" />
            <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-cyan-400/8 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1f3d37] bg-[#0d1f1a] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#9fe7b7]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#9fe7b7] shadow-[0_0_12px_rgba(159,231,183,0.9)]" />
                  Quantum computing / active
                </div>
              </div>

              <div className="mt-8 text-center sm:text-left">
                <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-white sm:text-5xl lg:text-[4.1rem] lg:leading-[0.96]">
                  Explore the Quantum World
                </h2>
                <h2 className="mx-auto mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-[#d7e5e9] sm:text-5xl lg:text-[4.1rem] lg:leading-[0.96]">
                  Beyond Classical Computing
                </h2>
              </div>

              <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-slate-300 sm:text-base sm:text-left">
                Build quantum circuits, simulate real quantum states, and see the mathematics behind every result.
              </p>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
                <Link href="/circuit-lab" className="inline-flex items-center gap-2 rounded-lg border border-[#9fe7b7] bg-[#9fe7b7] px-4 py-2.5 text-sm font-semibold text-[#08110d] transition hover:bg-[#baf2d1]">
                  Enter Quantum Lab
                  <ArrowRight size={15} />
                </Link>
                <Link href="/concepts" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0d141a] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white">
                  Explore Concepts
                </Link>
              </div>

              <div className="mt-9 overflow-hidden rounded-[26px] border border-slate-800 bg-[#081017]/95 p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#9fe7b7] shadow-[0_0_12px_rgba(159,231,183,0.8)]" />
                    State core / online
                  </div>
                  <span className="rounded-full border border-[#1b3035] bg-[#07171d] px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-slate-400">
                    live system
                  </span>
                </div>

                <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[20px] border border-slate-800 bg-[radial-gradient(circle_at_center,rgba(159,231,183,0.08),transparent_45%),#070d12] p-4 sm:p-6">
                  <div className="absolute inset-0 opacity-60" aria-hidden="true">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(159,231,183,0.12),transparent_55%)]" />
                  </div>

                  <div className="absolute h-[210px] w-[210px] rounded-full border border-[#1f3d37]/80" aria-hidden="true" />
                  <div className="absolute h-[210px] w-[210px] rounded-full border border-cyan-400/20 [transform:rotate(18deg)]" aria-hidden="true" />
                  <div className="absolute h-[210px] w-[210px] rounded-full border border-cyan-400/20 [transform:rotate(-18deg)]" aria-hidden="true" />

                  <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7fe6bc]/40 bg-[#0d1817]/80 shadow-[0_0_36px_rgba(159,231,183,0.16)]" aria-hidden="true" />
                  <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9fe7b7] bg-[#0f201c] shadow-[0_0_18px_rgba(159,231,183,0.65)]" aria-hidden="true" />

                  <div className="absolute left-[20%] top-[22%] h-2.5 w-2.5 rounded-full bg-[#9fe7b7] shadow-[0_0_18px_rgba(159,231,183,0.8)]" aria-hidden="true" />
                  <div className="absolute right-[25%] top-[28%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" aria-hidden="true" />
                  <div className="absolute left-[24%] bottom-[24%] h-2.5 w-2.5 rounded-full bg-[#9fe7b7] shadow-[0_0_18px_rgba(159,231,183,0.8)]" aria-hidden="true" />
                  <div className="absolute right-[18%] bottom-[20%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" aria-hidden="true" />

                  <div className="relative z-10 flex w-full max-w-[520px] items-center justify-between gap-4">
                    <div className="w-full rounded-2xl border border-slate-800 bg-[#0c161b]/80 p-3 backdrop-blur-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Qubit 0</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9fe7b7]">|0&gt;</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-[#9fe7b7] to-cyan-300" />
                      </div>
                    </div>

                    <div className="w-full rounded-2xl border border-slate-800 bg-[#0c161b]/80 p-3 backdrop-blur-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Qubit 1</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300">|1&gt;</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-cyan-300 to-[#9fe7b7]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-slate-800 pt-4 sm:justify-start">
                {['Qubits', 'Quantum Gates', 'State Vectors', 'Bloch Spheres', 'Measurement', 'Quantum Circuits'].map((item) => (
                  <div key={item} className="rounded-full border border-slate-800 bg-[#0c1419] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[30px] border border-slate-800 bg-[#0a0f14]/80 p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.96fr_1.04fr]">
            <div>
              <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-[#1f3d37] bg-[#0d1f1a] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#9fe7b7]">
                Quantum system
              </p>

              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl lg:text-[2.9rem]">
                Build circuits. See the quantum state change.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                Explore how quantum gates transform states in real time. Build a circuit, run the local simulator, and inspect amplitudes, probabilities, and qubit states.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  { index: "01", title: "Build", text: "Compose quantum circuits using real gate operations." },
                  { index: "02", title: "Simulate", text: "Run the local state-vector simulator." },
                  { index: "03", title: "Visualize", text: "Inspect probabilities, amplitudes, Bloch states, and state evolution." },
                ].map(({ index, title, text }) => (
                  <div key={index} className="flex gap-4 rounded-2xl border border-slate-800 bg-[#0d151b] p-3.5 sm:p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1f3d37] bg-[#0e231d] font-mono text-[10px] font-semibold text-[#9fe7b7]">
                      {index}
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/circuit-lab" className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[#9fe7b7] bg-[#9fe7b7] px-4 py-2.5 text-sm font-semibold text-[#08110d] transition hover:bg-[#baf2d1]">
                Open Circuit Lab
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="rounded-[26px] border border-slate-800 bg-[#0b1117] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#9fe7b7] shadow-[0_0_12px_rgba(159,231,183,0.8)]" />
                  Quantum engine / active
                </div>
                <span className="rounded-full border border-slate-800 bg-[#0e171e] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">q0-q2</span>
              </div>

              <div className="rounded-[20px] border border-slate-800 bg-[#081017] p-4 sm:p-5">
                <div className="space-y-4">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="grid grid-cols-[32px_1fr_58px] items-center gap-3">
                      <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">q{row}</span>
                      <div className="relative h-10 overflow-hidden rounded-lg border border-slate-800 bg-[#0d141a]">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(159,231,183,0.06),transparent)]" />
                        <div className="absolute inset-y-0 left-[12%] w-px bg-[#2b3b47]" />
                        <div className="absolute inset-y-0 left-[38%] w-px bg-[#2b3b47]" />
                        <div className="absolute inset-y-0 left-[64%] w-px bg-[#2b3b47]" />
                        <div className="absolute inset-y-0 left-[83%] w-px bg-[#2b3b47]" />
                        <div className="absolute left-[18%] top-1/2 h-7 w-7 -translate-y-1/2 rounded-md border border-[#1e3f3a] bg-[#11251f] text-[10px] font-semibold text-[#9fe7b7] flex items-center justify-center shadow-[0_0_12px_rgba(159,231,183,0.12)]">
                          H
                        </div>
                        <div className="absolute left-[52%] top-1/2 h-7 w-7 -translate-y-1/2 rounded-md border border-[#1d2c2f] bg-[#101c25] text-[10px] font-semibold text-cyan-300 flex items-center justify-center">
                          X
                        </div>
                        {row === 1 && (
                          <div className="absolute right-[20%] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-800 bg-[#0d141a] text-[9px] text-slate-300">
                            •
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <span className="rounded-full border border-slate-800 bg-[#0e171e] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-400">
                          {row === 0 ? "50%" : row === 1 ? "25%" : "25%"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "|00>", value: "0.5" },
                    { label: "|01>", value: "0.25" },
                    { label: "|11>", value: "0.25" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-slate-800 bg-[#0e171e] p-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        <span>{label}</span>
                        <span className="text-[#9fe7b7]">{value}</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#9fe7b7] to-cyan-400" style={{ width: `${Number(value) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">From theory to experiment</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            Learn the concept. Build the circuit. Run the simulation. Understand the result.
          </p>
        </div>

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
