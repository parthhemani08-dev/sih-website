/**
 * Small state-vector simulator for one to three qubits.
 *
 * Qubit 0 is the least-significant bit of a basis-state index.  Consequently
 * the vector is ordered |q(n-1)...q1q0>, and a CNOT tests the corresponding
 * bit in that integer index.
 */

export type Complex = Readonly<{ re: number; im: number }>;
export type SingleQubitGate = "H" | "X" | "Y" | "Z";

export type GateOperation =
  | { gate: SingleQubitGate; qubit: number }
  | { gate: "CNOT"; control: number; target: number };

export type QuantumCircuit = {
  qubits: number;
  operations: readonly GateOperation[];
};

export const complex = (re = 0, im = 0): Complex => ({ re, im });
export const add = (a: Complex, b: Complex): Complex =>
  complex(a.re + b.re, a.im + b.im);
export const multiply = (a: Complex, b: Complex): Complex =>
  complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const scale = (a: Complex, factor: number): Complex =>
  complex(a.re * factor, a.im * factor);
export const magnitudeSquared = (a: Complex): number => a.re * a.re + a.im * a.im;

const SQRT_HALF = 1 / Math.sqrt(2);

function assertQubitCount(qubits: number): void {
  if (!Number.isInteger(qubits) || qubits < 1 || qubits > 3) {
    throw new Error("QuantumSimulator supports one to three qubits.");
  }
}

function assertQubit(qubit: number, qubits: number, name = "qubit"): void {
  if (!Number.isInteger(qubit) || qubit < 0 || qubit >= qubits) {
    throw new Error(`${name} must be an integer from 0 to ${qubits - 1}.`);
  }
}

export function validateCircuit(circuit: QuantumCircuit): void {
  if (!circuit || !Number.isInteger(circuit.qubits)) {
    throw new Error("A circuit must specify an integer qubit count.");
  }
  assertQubitCount(circuit.qubits);
  if (!Array.isArray(circuit.operations)) {
    throw new Error("A circuit must contain an operations array.");
  }
  for (const operation of circuit.operations) {
    if (operation.gate === "CNOT") {
      assertQubit(operation.control, circuit.qubits, "control");
      assertQubit(operation.target, circuit.qubits, "target");
      if (operation.control === operation.target) {
        throw new Error("A CNOT control and target must be different qubits.");
      }
    } else {
      if (!["H", "X", "Y", "Z"].includes(operation.gate)) {
        throw new Error(`Unsupported gate: ${String(operation.gate)}.`);
      }
      assertQubit(operation.qubit, circuit.qubits);
    }
  }
}

export function formatComplex(value: Complex, precision = 4): string {
  const re = Math.abs(value.re) < 10 ** -precision ? 0 : value.re;
  const im = Math.abs(value.im) < 10 ** -precision ? 0 : value.im;
  if (im === 0) return re.toFixed(precision);
  if (re === 0) return `${im.toFixed(precision)}i`;
  return `${re.toFixed(precision)} ${im < 0 ? "-" : "+"} ${Math.abs(im).toFixed(precision)}i`;
}

export class QuantumSimulator {
  readonly qubits: number;
  private amplitudes: Complex[];

  constructor(qubits: number) {
    assertQubitCount(qubits);
    this.qubits = qubits;
    this.amplitudes = Array.from({ length: 2 ** qubits }, () => complex());
    this.amplitudes[0] = complex(1);
  }

  /** Returns a copy, so callers cannot mutate the simulator accidentally. */
  get state(): readonly Complex[] {
    return this.amplitudes.map((amplitude) => complex(amplitude.re, amplitude.im));
  }

  reset(): this {
    this.amplitudes = Array.from({ length: 2 ** this.qubits }, () => complex());
    this.amplitudes[0] = complex(1);
    return this;
  }

  apply(gate: SingleQubitGate, qubit: number): this {
    assertQubit(qubit, this.qubits);
    for (let index = 0; index < this.amplitudes.length; index++) {
      if (((index >> qubit) & 1) !== 0) continue;
      const paired = index | (1 << qubit);
      const zero = this.amplitudes[index];
      const one = this.amplitudes[paired];
      if (gate === "X") {
        this.amplitudes[index] = one;
        this.amplitudes[paired] = zero;
      } else if (gate === "Y") {
        this.amplitudes[index] = complex(one.im, -one.re);
        this.amplitudes[paired] = complex(-zero.im, zero.re);
      } else if (gate === "Z") {
        this.amplitudes[paired] = scale(one, -1);
      } else if (gate === "H") {
        this.amplitudes[index] = scale(add(zero, one), SQRT_HALF);
        this.amplitudes[paired] = scale(add(zero, scale(one, -1)), SQRT_HALF);
      }
    }
    return this;
  }

  h(qubit: number): this {
    return this.apply("H", qubit);
  }

  x(qubit: number): this {
    return this.apply("X", qubit);
  }

  y(qubit: number): this {
    return this.apply("Y", qubit);
  }

  z(qubit: number): this {
    return this.apply("Z", qubit);
  }

  cnot(control: number, target: number): this {
    assertQubit(control, this.qubits, "control");
    assertQubit(target, this.qubits, "target");
    if (control === target) throw new Error("A CNOT control and target must be different qubits.");
    for (let index = 0; index < this.amplitudes.length; index++) {
      if (((index >> control) & 1) === 0 || ((index >> target) & 1) !== 0) continue;
      const paired = index | (1 << target);
      [this.amplitudes[index], this.amplitudes[paired]] = [
        this.amplitudes[paired],
        this.amplitudes[index],
      ];
    }
    return this;
  }

  run(circuit: QuantumCircuit): this {
    validateCircuit(circuit);
    if (circuit.qubits !== this.qubits) {
      throw new Error("Circuit qubit count must match the simulator.");
    }
    for (const operation of circuit.operations) {
      if (operation.gate === "CNOT") this.cnot(operation.control, operation.target);
      else this.apply(operation.gate, operation.qubit);
    }
    return this;
  }

  probabilities(): readonly number[] {
    return this.amplitudes.map(magnitudeSquared);
  }

  probability(basisIndex: number): number {
    if (!Number.isInteger(basisIndex) || basisIndex < 0 || basisIndex >= this.amplitudes.length) {
      throw new Error(`Basis index must be an integer from 0 to ${this.amplitudes.length - 1}.`);
    }
    return magnitudeSquared(this.amplitudes[basisIndex]);
  }

  formatState(precision = 4): string {
    return this.amplitudes
      .map((amplitude, index) => {
        const basis = index.toString(2).padStart(this.qubits, "0");
        return `${formatComplex(amplitude, precision)}|${basis}>`;
      })
      .join(" + ");
  }
}

/** Validate and execute a circuit from the all-zero initial state. */
export function simulateCircuit(circuit: QuantumCircuit): QuantumSimulator {
  validateCircuit(circuit);
  return new QuantumSimulator(circuit.qubits).run(circuit);
}
