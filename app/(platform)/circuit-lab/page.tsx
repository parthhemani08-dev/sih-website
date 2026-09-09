"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, GripVertical, Play, RotateCcw, Settings2, Trash2, XCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState, PageHeading } from "@/components/ui";
import { useAssistantContext } from "@/components/ai-assistant/assistant-context";
import { recordLearningActivity } from "@/lib/learning-activity";
import { blochVector, blochVectorFromDensityMatrix, densityMatrixPurity, formatComplex, reducedQubitState, simulateCircuit, validateCircuit, type Complex, type GateOperation, type QuantumCircuit, type SingleQubitGate } from "@/lib/quantum";

type GateType = SingleQubitGate | "CNOT" | "Measure";
type CircuitOperation = { id: string; column: number; gate: GateType; qubit?: number; control?: number; target?: number };
type StateEntry = { state: string; re: number; im: number };
type ResultRow = { state: string; probability: number };
type EvolutionSnapshot = { label: string; gates: string; stateVector: StateEntry[]; probabilities: ResultRow[]; bloch: ({ x: number; y: number; z: number } | null)[] };
type Experiment = { name: string; difficulty: string; concept: string; explanation: string; expected: string; gates: string; operations: CircuitOperation[] };

const columns = Array.from({ length: 6 }, (_, index) => index);
const gatePalette: GateType[] = ["H", "X", "Y", "Z", "CNOT", "Measure"];
const defaultOperations: CircuitOperation[] = [{ id: "h-0", gate: "H", qubit: 0, column: 0 }, { id: "cnot-1", gate: "CNOT", control: 0, target: 1, column: 1 }];
const experiments: Experiment[] = [
  { name: "Bit Flip", difficulty: "Beginner", concept: "Pauli-X gate", explanation: "The X gate flips the computational basis state from |0⟩ to |1⟩.", expected: "The corresponding |1⟩ basis state has 100% probability.", gates: "X", operations: [{ id: "x-0", gate: "X", qubit: 0, column: 0 }] },
  { name: "Superposition", difficulty: "Beginner", concept: "Superposition", explanation: "The Hadamard gate creates an equal-amplitude combination of |0⟩ and |1⟩.", expected: "The two relevant basis states each have approximately 50% probability.", gates: "H", operations: [{ id: "h-0", gate: "H", qubit: 0, column: 0 }] },
  { name: "Bell State", difficulty: "Intermediate", concept: "Entanglement", explanation: "The Hadamard gate creates superposition on Qubit 0. CNOT then correlates Qubit 1 with it.", expected: "|00⟩ and |11⟩ are each approximately 50%; |01⟩ and |10⟩ are 0%.", gates: "H + CNOT", operations: defaultOperations },
  { name: "Phase Flip", difficulty: "Intermediate", concept: "Relative phase", explanation: "H, Z, H maps the phase change introduced by Z into a measurable bit flip.", expected: "Starting from |0⟩, the final state is |1⟩ with 100% probability.", gates: "H + Z + H", operations: [{ id: "h-0", gate: "H", qubit: 0, column: 0 }, { id: "z-0", gate: "Z", qubit: 0, column: 1 }, { id: "h-0-2", gate: "H", qubit: 0, column: 2 }] },
];

function initialResults(qubits: number): ResultRow[] {
  return Array.from({ length: 2 ** qubits }, (_, index) => ({ state: `|${index.toString(2).padStart(qubits, "0")}⟩`, probability: index === 0 ? 100 : 0 }));
}

function stateEntries(amplitudes: readonly Complex[], qubits: number): StateEntry[] {
  return amplitudes.map((amplitude, index) => ({ state: `|${index.toString(2).padStart(qubits, "0")}⟩`, re: amplitude.re, im: amplitude.im }));
}

function singleQubitState(stateVector: StateEntry[], qubits: number): Complex[] | null {
  if (qubits < 2) return stateVector.map(({ re, im }) => ({ re, im }));
  const amplitudes = stateVector.filter(({ state }) => /^\|0+[01]⟩$/.test(state));
  if (amplitudes.length !== 2) return null;
  const otherStatesHaveAmplitude = stateVector.some(({ state, re, im }) => !/^\|0+[01]⟩$/.test(state) && (Math.abs(re) > 0.0001 || Math.abs(im) > 0.0001));
  return otherStatesHaveAmplitude ? null : amplitudes.map(({ re, im }) => ({ re, im }));
}

function basisState(index: number, qubits: number) {
  return `|${index.toString(2).padStart(qubits, "0")}⟩`;
}

function createEvolutionSnapshot(label: string, gates: string, amplitudes: readonly Complex[], qubits: number): EvolutionSnapshot {
  const stateVector = stateEntries(amplitudes, qubits);
  const probabilities = amplitudes.map((amplitude, index) => ({ state: basisState(index, qubits), probability: (amplitude.re * amplitude.re + amplitude.im * amplitude.im) * 100 }));
  const bloch = Array.from({ length: qubits }, (_, qubit) => {
    const reduced = reducedQubitState(amplitudes, qubits, qubit);
    return reduced ? blochVectorFromDensityMatrix(reduced) : null;
  });
  return { label, gates, stateVector, probabilities, bloch };
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

function QuantumStateEvolution({ snapshots, selectedIndex, onSelect, playing, onTogglePlay }: { snapshots: EvolutionSnapshot[]; selectedIndex: number; onSelect: (index: number) => void; playing: boolean; onTogglePlay: () => void }) {
  const snapshot = snapshots[selectedIndex];
  if (!snapshot) return null;
  return <section className="glass mb-5 rounded-2xl p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Quantum State Evolution</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Step through the simulated state</h2></div><button onClick={onTogglePlay} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">{playing ? "Pause Evolution" : "Play Evolution"}</button></div><div className="mb-5 flex gap-2 overflow-x-auto pb-2">{snapshots.map((item, index) => <button key={`${item.label}-${index}`} onClick={() => onSelect(index)} className={`min-w-[90px] rounded-xl border px-3 py-2 text-left transition ${selectedIndex === index ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-200" : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900"}`}><span className="block text-[10px] uppercase tracking-wider">{item.label}</span><span className="mt-1 block text-xs">{item.gates}</span></button>)}</div><div className="mb-4 flex gap-2"><button onClick={() => onSelect(Math.max(0, selectedIndex - 1))} disabled={selectedIndex === 0} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300">Previous</button><button onClick={() => onSelect(Math.min(snapshots.length - 1, selectedIndex + 1))} disabled={selectedIndex === snapshots.length - 1} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300">Next</button><span className="self-center text-xs text-slate-500">{snapshot.gates}</span></div><div className="grid gap-4 md:grid-cols-3"><div><h3 className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200">State Vector</h3><div className="space-y-1">{snapshot.stateVector.filter(({ re, im }) => Math.abs(re) > 0.0001 || Math.abs(im) > 0.0001).map(({ state, re, im }) => <p className="font-mono text-xs text-slate-500 dark:text-slate-400" key={state}>{state} <span className="text-slate-800 dark:text-slate-200">{formatComplex({ re, im })}</span></p>)}</div></div><div><h3 className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Measurement Probabilities</h3><div className="space-y-1">{snapshot.probabilities.filter(({ probability }) => probability > 0.0001).map(({ state, probability }) => <p className="flex justify-between font-mono text-xs text-slate-500 dark:text-slate-400" key={state}><span>{state}</span><span>{probability.toFixed(2)}%</span></p>)}</div></div><div><h3 className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Qubit Bloch Data</h3><div className="space-y-1">{snapshot.bloch.map((item, qubit) => <p className="font-mono text-xs text-slate-500 dark:text-slate-400" key={qubit}>q{qubit}: {item ? `(${item.x.toFixed(2)}, ${item.y.toFixed(2)}, ${item.z.toFixed(2)})` : "unavailable"}</p>)}</div></div></div></section>;
}

function BlochSphere({ vector }: { vector: { x: number; y: number; z: number } | null }) {
  if (!vector) return <EmptyState>Run a single-qubit experiment to view its Bloch vector.</EmptyState>;
  const projectedX = Math.max(-1, Math.min(1, vector.x + vector.y * 0.3));
  const projectedY = Math.max(-1, Math.min(1, vector.z + vector.y * 0.16));
  const x = 110 + projectedX * 72;
  const y = 110 - projectedY * 72;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 220 220" className="h-56 w-56 max-w-full text-slate-500 dark:text-slate-300" role="img" aria-label={`Bloch vector x ${vector.x.toFixed(2)}, y ${vector.y.toFixed(2)}, z ${vector.z.toFixed(2)}`}>
        <defs>
          <radialGradient id="bloch-shade" cx="35%" cy="28%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity=".22" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity=".04" />
          </radialGradient>
          <marker id="bloch-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#10b981" />
          </marker>
        </defs>
        <circle cx="110" cy="110" r="78" fill="url(#bloch-shade)" stroke="currentColor" opacity=".45" />
        <ellipse cx="110" cy="110" rx="78" ry="25" fill="none" stroke="currentColor" opacity=".3" />
        <ellipse cx="110" cy="110" rx="25" ry="78" fill="none" stroke="currentColor" opacity=".2" />
        <path d="M32 110h156M110 32v156" stroke="currentColor" opacity=".25" />
        <path d="M66 70L154 150M154 70L66 150" stroke="currentColor" strokeDasharray="3 4" opacity=".13" />
        <path d={`M110 110L${x} ${y}`} stroke="#10b981" strokeWidth="3" markerEnd="url(#bloch-arrow)" />
        <circle cx={x} cy={y} r="5" fill="#059669" />
        <text x="114" y="25" fontSize="10" fill="currentColor">|0⟩</text>
        <text x="114" y="207" fontSize="10" fill="currentColor">|1⟩</text>
        <text x="192" y="106" fontSize="10" fill="currentColor">+X</text>
        <text x="15" y="106" fontSize="10" fill="currentColor">-X</text>
        <text x="178" y="85" fontSize="10" fill="currentColor">+Y</text>
        <text x="178" y="139" fontSize="10" fill="currentColor">-Y</text>
        <text x="114" y="218" fontSize="10" fill="currentColor">Z axis</text>
      </svg>
      <div className="grid grid-cols-3 gap-3 text-center font-mono text-[11px] text-slate-500"><span>X {vector.x.toFixed(3)}</span><span>Y {vector.y.toFixed(3)}</span><span>Z {vector.z.toFixed(3)}</span></div>
    </div>
  );
}

export default function CircuitLabPage() {
  const [qubits, setQubits] = useState<1 | 2 | 3>(2);
  const [operations, setOperations] = useState<CircuitOperation[]>(defaultOperations);
  const [selectedGate, setSelectedGate] = useState<GateType>("H");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ResultRow[]>(initialResults(2));
  const [stateVector, setStateVector] = useState<StateEntry[]>([]);
  const [measuredState, setMeasuredState] = useState<string | null>(null);
  const [activeOperationId, setActiveOperationId] = useState<string | null>(null);
  const [evolutionSnapshots, setEvolutionSnapshots] = useState<EvolutionSnapshot[]>([]);
  const [evolutionIndex, setEvolutionIndex] = useState(0);
  const [playingEvolution, setPlayingEvolution] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(experiments[2]);
  const { setCircuit } = useAssistantContext();
  const quantumOperations = useMemo((): GateOperation[] => operations.filter((operation) => operation.gate !== "Measure").map(({ gate, qubit, control, target }) => gate === "CNOT" ? { gate, control: control ?? 0, target: target ?? 1 } : { gate: gate as SingleQubitGate, qubit: qubit ?? 0 }), [operations]);
  const circuit: QuantumCircuit = useMemo(() => ({ qubits, operations: quantumOperations }), [qubits, quantumOperations]);
  const validationError = useMemo(() => { try { validateCircuit(circuit); for (const operation of operations) if (operation.column < 0 || operation.column >= columns.length) throw new Error("Every operation must be placed in a valid time column."); return ""; } catch (validation) { return validation instanceof Error ? validation.message : "This circuit contains an invalid operation."; } }, [circuit, operations]);
  const vectors = useMemo(() => Array.from({ length: qubits }, (_, qubit) => {
    const reduced = reducedQubitState(stateVector.map(({ re, im }) => ({ re, im })), qubits, qubit);
    return { qubit, vector: reduced ? blochVectorFromDensityMatrix(reduced) : null, purity: reduced ? densityMatrixPurity(reduced) : null };
  }), [stateVector, qubits]);
  const vector = useMemo(() => { const singleState = singleQubitState(stateVector, qubits); return singleState ? blochVector(singleState) : null; }, [stateVector, qubits]);
  const hasCorrelations = vectors.some(({ purity }) => purity !== null && purity < 0.999);
  const correlationText = hasCorrelations ? "Reduced qubit states are mixed, indicating correlations or entanglement in the full state." : "No entanglement detected from the current reduced-state purities.";
  const isBellState = qubits === 2 && results.length === 4 && results[0].probability > 45 && results[3].probability > 45 && results[1].probability < 5 && results[2].probability < 5;
  const circuitDepth = operations.length ? Math.max(...operations.map((operation) => operation.column)) + 1 : 0;
  const currentState = results.reduce((best, row) => row.probability > best.probability ? row : best, results[0]);
  const status = running ? "Running" : stateVector.length ? "Complete" : "Ready";

  useEffect(() => {
    if (!playingEvolution || evolutionSnapshots.length < 2) return;
    const timer = window.setInterval(() => {
      setEvolutionIndex((current) => {
        if (current >= evolutionSnapshots.length - 1) {
          setPlayingEvolution(false);
          return current;
        }
        return current + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [playingEvolution, evolutionSnapshots.length]);

  useEffect(() => { setCircuit({ qubits, gates: operations.map(({ gate, qubit, control, target, column }) => ({ type: gate, qubit, control, target, column })), valid: !validationError, validationError: validationError || undefined, measurementResults: Object.fromEntries(results.map(({ state, probability }) => [state, probability])), stateVector, experiment: selectedExperiment?.name }); }, [operations, qubits, results, stateVector, validationError, selectedExperiment, setCircuit]);

  const placeGate = (qubit: number, column: number) => {
    const existing = operations.filter((operation) => operation.column === column && (operation.qubit === qubit || operation.control === qubit || operation.target === qubit));
    const next = operations.filter((operation) => !existing.some((item) => item.id === operation.id));
    if (selectedGate === "CNOT") {
      if (qubit >= qubits - 1) { setError("CNOT needs a control and a different target qubit below it."); return; }
      next.push({ id: `CNOT-${qubit}-${column}`, gate: "CNOT", control: qubit, target: qubit + 1, column });
    } else next.push({ id: `${selectedGate}-${qubit}-${column}`, gate: selectedGate, qubit, column });
    setOperations(next);
    setMeasuredState(null);
    setError("");
  };

  const runCircuit = async () => {
    if (validationError || running) { if (validationError) setError(validationError); return; }
    setRunning(true);
    setMeasuredState(null);
    setEvolutionSnapshots([]);
    setEvolutionIndex(0);
    setPlayingEvolution(false);
    setError("");
    const ordered = [...operations].sort((left, right) => left.column - right.column || left.id.localeCompare(right.id));
    const executable: GateOperation[] = [];
    const snapshots: EvolutionSnapshot[] = [createEvolutionSnapshot("Initial", "No gates", new Array(2 ** qubits).fill(null).map((_, index) => index === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 }), qubits)];
    setEvolutionSnapshots(snapshots);
    try {
    for (const column of [...new Set(ordered.map((operation) => operation.column))].sort((a, b) => a - b)) {
      const columnOperations = ordered.filter((operation) => operation.column === column);
      for (const operation of columnOperations) {
        setActiveOperationId(operation.id);
        await delay(260);
        if (operation.gate !== "Measure") executable.push(operation.gate === "CNOT" ? { gate: operation.gate, control: operation.control ?? 0, target: operation.target ?? 1 } : { gate: operation.gate, qubit: operation.qubit ?? 0 });
      }
      const step = simulateCircuit({ qubits, operations: executable });
      const snapshot = createEvolutionSnapshot(`T${column + 1}`, columnOperations.map((operation) => operation.gate).join(" + "), step.state, qubits);
      snapshots.push(snapshot);
      setEvolutionSnapshots([...snapshots]);
      setEvolutionIndex(snapshots.length - 1);
      setResults(snapshot.probabilities);
      setStateVector(snapshot.stateVector);
    }
    {
      const final = simulateCircuit(circuit);
      const finalResults = final.probabilities().map((probability, index) => ({ state: basisState(index, qubits), probability: probability * 100 }));
      setResults(finalResults);
      setStateVector(stateEntries(final.state, qubits));
      const finalSnapshot = createEvolutionSnapshot("Final", "Circuit complete", final.state, qubits);
      setEvolutionSnapshots([...snapshots, finalSnapshot]);
      setEvolutionIndex(snapshots.length);
      const measure = operations.some((operation) => operation.gate === "Measure");
      if (measure) setMeasuredState(finalResults.reduce((best, row) => row.probability > best.probability ? row : best, finalResults[0]).state);
      const circuitName = selectedExperiment?.name ?? `${qubits}-qubit circuit`;
      recordLearningActivity("circuit_run", circuitName, {
        entityId: selectedExperiment?.name.toLowerCase().replaceAll(" ", "-") ?? "custom-circuit",
        metadata: { qubits, gates: operations.length, depth: circuitDepth, status: "complete" },
      });
      if (selectedExperiment) {
        recordLearningActivity("experiment_completed", selectedExperiment.name, {
          entityId: selectedExperiment.name.toLowerCase().replaceAll(" ", "-"),
          metadata: { status: "complete", qubits },
        });
      }
    }
    } catch (simulationError) {
      setError(simulationError instanceof Error ? simulationError.message : "Unable to simulate this circuit.");
    } finally {
      setActiveOperationId(null);
      setRunning(false);
    }
  };

  const loadExperiment = (experiment: Experiment) => { setSelectedExperiment(experiment); setQubits(2); setOperations(experiment.operations); setResults(initialResults(2)); setStateVector([]); setMeasuredState(null); setEvolutionSnapshots([]); setEvolutionIndex(0); setError(""); };
  const clearCircuit = () => { setOperations([]); setSelectedExperiment(null); setResults(initialResults(qubits)); setStateVector([]); setMeasuredState(null); setEvolutionSnapshots([]); setEvolutionIndex(0); setError(""); };
  const resetCircuit = () => { setQubits(2); setOperations(defaultOperations); setSelectedExperiment(experiments[2]); setResults(initialResults(2)); setStateVector([]); setMeasuredState(null); setEvolutionSnapshots([]); setEvolutionIndex(0); setError(""); };

  return <div className="mx-auto w-full max-w-[1500px] px-5 py-9">
    <PageHeading eyebrow="Interactive workspace" title="Circuit Lab" description="Compose gates, load guided experiments, and simulate exact measurement probabilities from a local state-vector engine." />
    <section className="mb-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-slate-900 dark:text-white">Experiments</h2><span className="text-xs text-slate-500">Start with a concept, then modify the circuit.</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{experiments.map((experiment) => <button key={experiment.name} onClick={() => loadExperiment(experiment)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${selectedExperiment?.name === experiment.name ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/40" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}><div className="flex items-center justify-between"><span className="font-semibold text-slate-900 dark:text-white">{experiment.name}</span>{selectedExperiment?.name === experiment.name && <CheckCircle2 className="text-emerald-600 dark:text-emerald-300" size={16} />}</div><p className="mt-2 text-xs text-slate-500">{experiment.concept} · {experiment.difficulty}</p></button>)}</div>{selectedExperiment && <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/25"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-slate-900 dark:text-white">{selectedExperiment.name}</h3><span className="rounded-full bg-white/70 px-2 py-1 text-emerald-700 dark:bg-slate-900/60 dark:text-emerald-300">{selectedExperiment.difficulty}</span></div><div className="grid gap-3 sm:grid-cols-[.7fr_1.4fr_1fr]"><div><p className="font-semibold text-emerald-800 dark:text-emerald-300">Concept</p><p className="mt-1 text-slate-600 dark:text-slate-400">{selectedExperiment.concept}</p></div><div><p className="font-semibold text-emerald-800 dark:text-emerald-300">Explanation</p><p className="mt-1 text-slate-600 dark:text-slate-400">{selectedExperiment.explanation}</p></div><div><p className="font-semibold text-emerald-800 dark:text-emerald-300">Expected · Gates</p><p className="mt-1 text-slate-600 dark:text-slate-400">{selectedExperiment.expected} · {selectedExperiment.gates}</p></div></div></div>}</section>
    <div className="mb-5 grid gap-3 sm:grid-cols-4"><div className="glass rounded-xl p-3"><p className="text-[10px] uppercase tracking-widest text-slate-500">Qubits</p><p className="mt-1 font-mono text-lg text-slate-900 dark:text-white">{qubits}</p></div><div className="glass rounded-xl p-3"><p className="text-[10px] uppercase tracking-widest text-slate-500">Circuit depth</p><p className="mt-1 font-mono text-lg text-slate-900 dark:text-white">{circuitDepth}</p></div><div className="glass rounded-xl p-3"><p className="text-[10px] uppercase tracking-widest text-slate-500">Current state</p><p className="mt-1 truncate font-mono text-sm text-slate-900 dark:text-white">{stateVector.length ? currentState.state : "|00…0⟩"}</p></div><div className="glass rounded-xl p-3"><p className="text-[10px] uppercase tracking-widest text-slate-500">Simulation</p><p className={`mt-1 flex items-center gap-2 text-sm font-semibold ${running ? "text-amber-600" : status === "Complete" ? "text-emerald-600 dark:text-emerald-300" : "text-slate-700 dark:text-slate-200"}`}><span className={`h-2 w-2 rounded-full ${running ? "animate-pulse bg-amber-500" : status === "Complete" ? "bg-emerald-500" : "bg-slate-400"}`} />{status}</p></div></div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30"><div><p className="flex items-center gap-2 text-xs font-bold tracking-[.12em] text-emerald-700 dark:text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500" /> SIMULATOR READY</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Qubit 0 is the least-significant bit in each displayed basis state.</p></div><div className="flex items-center gap-2"><label className="text-xs text-slate-500" htmlFor="qubit-count">Qubits</label><select id="qubit-count" value={qubits} onChange={(event) => { const value = Number(event.target.value) as 1 | 2 | 3; setQubits(value); setOperations([]); setSelectedExperiment(null); setResults(initialResults(value)); setStateVector([]); setMeasuredState(null); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option></select></div></div>
    {evolutionSnapshots.length > 0 && <QuantumStateEvolution snapshots={evolutionSnapshots} selectedIndex={evolutionIndex} onSelect={(index) => { setEvolutionIndex(index); setPlayingEvolution(false); }} playing={playingEvolution} onTogglePlay={() => { if (evolutionSnapshots.length > 1) { setEvolutionIndex((current) => current >= evolutionSnapshots.length - 1 ? 0 : current); setPlayingEvolution((current) => !current); } }} />}
    <div className="space-y-5"><div className="flex flex-col gap-5"><div className="order-2 glass rounded-2xl p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-900 dark:text-white">Circuit workspace</h2><p className="mt-1 text-xs text-slate-500">Select a gate, then click a cell. Clicking an occupied cell replaces that operation.</p></div><div className="flex gap-2"><button onClick={clearCircuit} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-700"><Trash2 size={14} /> Clear</button><button onClick={resetCircuit} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-700"><RotateCcw size={14} /> Reset</button><button onClick={runCircuit} disabled={running} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"><Play size={14} fill="currentColor" /> {running ? "Running..." : "Run Circuit"}</button></div></div><div className="overflow-x-auto pb-2"><div className="technical-panel min-w-[650px] rounded-xl border border-slate-200 p-5 dark:border-slate-700"><div className="mb-3 flex pl-16 text-[10px] uppercase tracking-widest text-slate-500">{columns.map((column) => <span className="w-20 text-center" key={column}>t{column + 1}</span>)}</div>{Array.from({ length: qubits }, (_, qubit) => <div className="flex h-20 items-center" key={qubit}><span className="w-16 font-mono text-xs text-teal-700 dark:text-teal-300">q[{qubit}]</span><div className="relative flex flex-1 items-center">{columns.map((column) => { const operation = operations.find((item) => item.column === column && (item.qubit === qubit || item.control === qubit || item.target === qubit)); const isControl = operation?.gate === "CNOT" && operation.control === qubit; const isTarget = operation?.gate === "CNOT" && operation.target === qubit; const active = operation?.id === activeOperationId; return <button aria-label={`Place gate at qubit ${qubit}, column ${column + 1}`} key={column} onClick={() => placeGate(qubit, column)} className={`relative flex h-12 w-20 items-center justify-center border-t border-slate-300 text-xs text-slate-400 hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-emerald-950/30 ${active ? "bg-emerald-100 ring-2 ring-emerald-400 dark:bg-emerald-950/70" : ""}`}>{operation && (isControl || isTarget || operation.qubit === qubit) ? <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border font-bold ${operation.gate === "CNOT" ? "border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950/70 dark:text-teal-200" : operation.gate === "Measure" ? "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200" : "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-200"}`}>{isControl ? "●" : isTarget ? "⊕" : operation.gate}</span> : null}{operation?.gate === "CNOT" && isControl && <span className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-px -translate-x-1/2 -translate-y-1/2 bg-teal-500" />}</button>; })}</div></div>)}</div></div>    </div><div className="order-1 glass rounded-2xl p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-slate-900 dark:text-white">Gate palette</h2><Settings2 size={16} className="text-slate-500" /></div><div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{gatePalette.map((gate) => <button key={gate} onClick={() => setSelectedGate(gate)} className={`flex flex-col items-center gap-2 rounded-xl border py-3 text-xs font-bold transition ${selectedGate === gate ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200" : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-current">{gate === "CNOT" ? "⊕" : gate === "Measure" ? "M" : gate}</span><span className="text-[10px]">{gate}</span></button>)}</div></div>{error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"><XCircle size={16} />{error}</div>}</div>
      <aside className="glass rounded-2xl p-5"><div className="mb-5 flex items-center gap-2"><BarChart3 size={17} className="text-emerald-600 dark:text-emerald-300" /><h2 className="font-semibold text-slate-900 dark:text-white">Results</h2></div><section><h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">Measurement Probabilities</h3><div className="mt-2 h-52 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={results}><CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={.12} /><XAxis dataKey="state" fontSize={10} /><YAxis domain={[0, 100]} fontSize={10} tickFormatter={(value) => `${value}%`} /><Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} /><Bar dataKey="probability" fill="#10b981" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="mt-5 space-y-2">{results.map(({ state, probability }) => <div className="flex items-center justify-between font-mono text-xs" key={state}><span className="text-slate-600 dark:text-slate-300">{state}</span><span className="text-emerald-700 dark:text-emerald-300">{probability.toFixed(2)}%</span></div>)}</div></section>{measuredState && <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/30"><p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">Measurement collapse</p><p className="mt-1 font-mono text-lg text-amber-900 dark:text-amber-100">{measuredState}</p><p className="mt-1 text-[11px] text-amber-700/80 dark:text-amber-300/80">Representative highest-probability outcome; theoretical probabilities remain above.</p></section>}<section className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-700"><h3 className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-200">State Vector</h3>{stateVector.length ? stateVector.filter(({ re, im }) => Math.abs(re) > 0.0001 || Math.abs(im) > 0.0001).map(({ state, re, im }) => <p className="font-mono text-xs text-slate-500 dark:text-slate-400" key={state}>{state} <span className="text-slate-700 dark:text-slate-200">{formatComplex({ re, im })}</span></p>) : <EmptyState>Run the circuit to calculate amplitudes.</EmptyState>}</section>      <section className="mt-7 border-t border-slate-200 pt-5       dark:border-slate-700"><h3 className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-200">Quantum Visualization</h3>{qubits === 1 ? <BlochSphere vector={vector} /> :             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{vectors.map(({ qubit, vector: qubitVector, purity }) => <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700" key={qubit}><p className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Qubit {qubit}</p><BlochSphere vector={qubitVector} /><p className="mt-2 text-center text-[10px] text-slate-500">{purity === null ? "Run the circuit to calculate its reduced state." : `Purity ${purity.toFixed(3)}`}</p></div>)}</div>}</section>{qubits > 1 && <section className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-700"><h3 className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-200">Quantum Correlations</h3><div className={`rounded-xl border p-3 ${hasCorrelations ? "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50"}`}><p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{hasCorrelations ? "Correlated / entangled subsystem detected" : "No entanglement detected"}</p><p className="mt-1 text-[11px] leading-5 text-slate-600 dark:text-slate-400">{correlationText}</p>{isBellState && <div className="mt-3 rounded-lg bg-white/70 p-2 dark:bg-slate-900/60"><p className="font-mono text-xs text-slate-800 dark:text-slate-100">|ψ⟩ = (|00⟩ + |11⟩) / √2</p><p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">|00⟩ = 50% · |01⟩ = 0% · |10⟩ = 0% · |11⟩ = 50%</p></div>}{hasCorrelations && <p className="mt-2 font-mono text-[11px] text-amber-800 dark:text-amber-200">{isBellState ? "q0 and q1 are strongly correlated." : "The individual Bloch spheres cannot represent the complete entangled state."}</p>}</div></section>}<div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30"><GripVertical size={14} className="mb-2 text-emerald-600 dark:text-emerald-300" /><p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{activeOperationId ? `Executing ${operations.find((operation) => operation.id === activeOperationId)?.gate}...` : "Operations execute left to right by column."} Qubit 0 is the least-significant bit.</p></div></aside>
    </div>
  </div>;
}
