import type { Complex } from "./simulator";

export type BlochVector = { x: number; y: number; z: number };

/** Computes x,y,z for a normalized single-qubit state a|0> + b|1>. */
export function blochVector(state: readonly Complex[]): BlochVector | null {
  if (state.length !== 2) return null;
  const [a, b] = state;
  return {
    x: 2 * (a.re * b.re + a.im * b.im),
    y: 2 * (a.re * b.im - a.im * b.re),
    z: a.re * a.re + a.im * a.im - b.re * b.re - b.im * b.im,
  };
}

function magnitudeSquared(value: Complex): number {
  return value.re * value.re + value.im * value.im;
}

function multiplyConjugate(left: Complex, right: Complex): Complex {
  return {
    re: left.re * right.re + left.im * right.im,
    im: left.re * right.im - left.im * right.re,
  };
}

/** Returns the reduced single-qubit density matrix for a qubit in a full state vector. */
export function reducedQubitState(state: readonly Complex[], qubits: number, qubit: number): readonly Complex[] | null {
  if (!Number.isInteger(qubits) || qubits < 1 || state.length !== 2 ** qubits || !Number.isInteger(qubit) || qubit < 0 || qubit >= qubits) return null;
  let rho00 = 0;
  let rho11 = 0;
  let rho01 = { re: 0, im: 0 };
  for (let index = 0; index < state.length; index++) {
    if (((index >> qubit) & 1) !== 0) continue;
    const paired = index | (1 << qubit);
    rho00 += magnitudeSquared(state[index]);
    rho11 += magnitudeSquared(state[paired]);
    const coherence = multiplyConjugate(state[index], state[paired]);
    rho01 = { re: rho01.re + coherence.re, im: rho01.im + coherence.im };
  }
  return [{ re: rho00, im: 0 }, rho01, { re: rho01.re, im: -rho01.im }, { re: rho11, im: 0 }];
}

/** Computes a Bloch vector from a reduced density matrix. */
export function blochVectorFromDensityMatrix(densityMatrix: readonly Complex[]): BlochVector | null {
  if (densityMatrix.length !== 4) return null;
  return {
    x: 2 * densityMatrix[1].re,
    y: 2 * densityMatrix[1].im,
    z: densityMatrix[0].re - densityMatrix[3].re,
  };
}

/** Purity is 1 for a pure reduced state and below 1 for an entangled subsystem. */
export function densityMatrixPurity(densityMatrix: readonly Complex[]): number {
  if (densityMatrix.length !== 4) return 0;
  return densityMatrix.reduce((sum, value) => sum + magnitudeSquared(value), 0);
}
