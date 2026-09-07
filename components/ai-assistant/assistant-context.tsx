"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type CircuitGate = { type: string; qubit?: number; control?: number; target?: number; column?: number };

export type AssistantContext = {
  currentPage: string;
  currentSection: string;
  selectedLesson?: string;
  lessonProgress?: number;
  circuit?: {
    qubits: number;
    gates: CircuitGate[];
    valid?: boolean;
    validationError?: string;
    measurementResults?: Record<string, number>;
    stateVector?: { state: string; re: number; im: number }[];
    experiment?: string;
  };
  dashboardStats?: { circuitsBuilt: number; lessonsCompleted: string; accuracy: string; timeSpent: string };
};

type AssistantContextValue = {
  context: AssistantContext;
  setCircuit: (circuit: AssistantContext["circuit"]) => void;
};

const Context = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [circuit, setCircuit] = useState<AssistantContext["circuit"]>({
    qubits: 2,
    gates: [
      { type: "H", qubit: 0 },
      { type: "CNOT", control: 0, target: 1 },
    ],
    measurementResults: { "|00⟩": 48, "|01⟩": 22, "|10⟩": 18, "|11⟩": 12 },
  });

  const value = useMemo(() => ({ context: { currentPage: "", currentSection: "", circuit }, setCircuit }), [circuit]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAssistantContext() {
  const value = useContext(Context);
  if (!value) throw new Error("useAssistantContext must be used inside AssistantProvider");
  return value;
}
