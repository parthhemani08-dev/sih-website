import type { AssistantContext } from "./assistant-context";

export function getAssistantResponse(message: string, context: AssistantContext) {
  const normalized = message.toLowerCase();
  if (context.currentPage === "Circuit Lab" && normalized.includes("mistake")) {
    return context.circuit?.validationError
      ? `I found a circuit issue: ${context.circuit.validationError}`
      : "I do not see a validation error in the current circuit. Check that multi-qubit gates use different, valid qubits and that the operation order matches your experiment.";
  }
  if (context.currentPage === "Circuit Lab" && (normalized.includes("circuit") || normalized.includes("result") || normalized.includes("predict"))) {
    const gates = context.circuit?.gates ?? [];
    const hasBellPattern = gates.some((gate) => gate.type === "H") && gates.some((gate) => gate.type === "CNOT");
    if (context.circuit?.validationError) return `The circuit cannot run yet: ${context.circuit.validationError}`;
    if (hasBellPattern) return "I can see an H gate on Qubit 0 followed by a CNOT connecting Qubit 0 to Qubit 1. Starting from |00⟩, that creates the Bell state (|00⟩ + |11⟩)/√2, so those two outcomes should each have about 50% probability.";
    const strongest = context.circuit?.measurementResults
      ? Object.entries(context.circuit.measurementResults).sort(([, a], [, b]) => b - a)[0]
      : undefined;
    return strongest ? `Your latest simulation most strongly favors ${strongest[0]} at ${strongest[1].toFixed(1)}%. Add an H or X gate and run again to explore how the distribution changes.` : "Run the circuit to calculate an exact probability distribution from the current state vector.";
  }
  if (normalized.includes("quiz")) return "Quick quiz: what happens when a qubit in superposition is measured? Choose an outcome and explain why probabilities are involved.";
  if (normalized.includes("learn") || normalized.includes("next")) return "Start with Qubits and Superposition, then build the Bell state experiment in Circuit Lab. That path connects the core ideas quickly.";
  if (normalized.includes("example")) return "A Hadamard gate is a great example: it takes |0⟩ and creates an equal superposition of |0⟩ and |1⟩ until measurement.";
  return `I’m following along with ${context.currentPage || "QuantumLab AI"}. I can explain the concept, suggest a next step, or help you interpret what you see here.`;
}
