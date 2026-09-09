export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type ConceptLesson = {
  id: string;
  title: string;
  badge: string;
  category: string;
  level: string;
  summary: string;
  introduction: string;
  intuition: string;
  formal: string;
  equations: string[];
  workedExample: string;
  visualization: string;
  circuitExample: string;
  practical: string;
  misconceptions: string[];
  resources: { label: string; href: string }[];
  quiz: QuizQuestion[];
};

export const conceptLessons: ConceptLesson[] = [
  {
    id: "qubits", title: "Qubits", badge: "01", category: "Foundations", level: "Beginner",
    summary: "The basic unit of quantum information: a state described by amplitudes, not a single classical value.",
    introduction: "A qubit is a controllable two-level quantum system. The computational basis states |0⟩ and |1⟩ are its reference states, while a general state may combine both with complex amplitudes.",
    intuition: "A useful intuition is a compass needle: its direction carries information about the state. Gates rotate that direction and measurement asks a basis-specific question. The analogy is not a literal hidden classical arrow, because phase and measurement probabilities have no classical equivalent.",
    formal: "Every pure qubit state can be written |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes. Normalization requires |α|² + |β|² = 1.",
    equations: ["|ψ⟩ = α|0⟩ + β|1⟩", "P(0) = |α|²", "P(1) = |β|²", "|α|² + |β|² = 1"],
    workedExample: "For |+⟩ = (|0⟩ + |1⟩)/√2, α = β = 1/√2. A computational-basis measurement therefore returns 0 or 1 with probability 1/2 each.",
    visualization: "The Bloch sphere maps every pure single-qubit state to a point on a sphere. The north and south poles represent |0⟩ and |1⟩; the equator contains equal-magnitude superpositions with different phases.",
    circuitExample: "q0 ── H ── M\n\nH rotates |0⟩ to |+⟩; M samples the state in the computational basis.",
    practical: "Physical qubits can be implemented with superconducting circuits, trapped ions, photons, spins, and other two-level systems. Circuit Lab lets you inspect the state vector and probabilities without hiding the mathematics.",
    misconceptions: ["A qubit is not simply a classical bit that secretly contains both values.", "One measurement returns one classical result, not both basis values.", "A qubit does not automatically provide unlimited classical storage."],
    resources: [{ label: "IBM Quantum Learning: Qubits", href: "https://learning.quantum.ibm.com/" }, { label: "NIST: Quantum Information Science", href: "https://www.nist.gov/topics/physics/quantum-information-science" }],
    quiz: [
      { question: "What does α represent in |ψ⟩ = α|0⟩ + β|1⟩?", options: ["A probability amplitude", "A gate name", "A measurement device", "A qubit count"], answer: 0, explanation: "α is a complex probability amplitude; its squared magnitude gives P(0)." },
      { question: "What condition must a normalized qubit satisfy?", options: ["α + β = 0", "|α|² + |β|² = 1", "α = β", "P(0) = 0"], answer: 1, explanation: "The total probability must equal one." },
      { question: "What does a computational measurement return?", options: ["A vector", "Both amplitudes", "A classical 0 or 1", "A new qubit"], answer: 2, explanation: "Measurement produces a classical basis-state outcome." },
      { question: "If α = 1/√2, what is P(0)?", options: ["0%", "25%", "50%", "100%"], answer: 2, explanation: "The probability is |α|² = 1/2, or 50%." },
      { question: "Which system can physically implement a qubit?", options: ["Only a laptop bit", "A trapped ion", "Only a printed circuit diagram", "A probability table"], answer: 1, explanation: "Trapped ions are one of several physical qubit platforms." },
    ],
  },
  {
    id: "superposition", title: "Superposition", badge: "02", category: "States", level: "Beginner",
    summary: "A linear combination of basis states whose amplitudes interfere before measurement.",
    introduction: "Superposition describes a quantum state that is not restricted to one computational-basis state. It is a precise statement about amplitudes, not the claim that a qubit is two classical objects at once.",
    intuition: "Before measurement, amplitudes can combine constructively or destructively. The phase relationship matters: |+⟩ and |−⟩ have the same measurement probabilities in the computational basis but respond differently to later gates.",
    formal: "A superposition has the form α|0⟩ + β|1⟩ with normalized amplitudes. The equal state |+⟩ = (|0⟩ + |1⟩)/√2 gives P(0) = P(1) = 50%.",
    equations: ["|+⟩ = (|0⟩ + |1⟩)/√2", "|−⟩ = (|0⟩ − |1⟩)/√2", "H|0⟩ = |+⟩", "H|1⟩ = |−⟩"],
    workedExample: "Start in |0⟩, apply H, then measure repeatedly. Each individual shot is 0 or 1, while many shots approach a 50/50 histogram.",
    visualization: "On the Bloch sphere, H moves |0⟩ from the north pole to the +X equator. The state vector and probability distribution show the same transformation from different perspectives.",
    circuitExample: "q0 ── H ── M\n\nRun the circuit repeatedly to see the distribution emerge from individual classical outcomes.",
    practical: "Superposition is useful only when later operations exploit interference. Simply placing many qubits in superposition does not solve every possible problem automatically.",
    misconceptions: ["Superposition is not ordinary lack of knowledge about a definite classical value.", "One measurement does not reveal both components.", "Superposition by itself is not quantum speedup; interference and algorithm structure matter."],
    resources: [{ label: "IBM Quantum Learning", href: "https://learning.quantum.ibm.com/" }, { label: "OpenLearn: Quantum mechanics", href: "https://www.open.edu/openlearn/science-maths-technology/physics-and-maths/quantum-mechanics/content-section-overview" }],
    quiz: [
      { question: "What is |+⟩ in the computational basis?", options: ["|0⟩ − |1⟩", "(|0⟩ + |1⟩)/√2", "|0⟩ only", "|1⟩ only"], answer: 1, explanation: "The plus state is the equal positive superposition." },
      { question: "What does one measurement of |+⟩ produce?", options: ["Both 0 and 1", "Always 0", "One classical result", "A phase angle"], answer: 2, explanation: "Each shot returns one basis-state result." },
      { question: "Why do repeated shots approach 50/50?", options: ["Because the gate is random", "Because probabilities are determined by squared amplitudes", "Because measurement copies the state", "Because H is irreversible"], answer: 1, explanation: "The amplitudes produce a probability distribution sampled over shots." },
      { question: "What does the relative phase distinguish?", options: ["|+⟩ from |−⟩", "|0⟩ from a classical byte", "A qubit from a gate", "A shot from a circuit"], answer: 0, explanation: "The plus and minus states differ by a relative phase and can interfere differently." },
      { question: "What does superposition alone guarantee?", options: ["A quantum speedup", "Both values are read out", "A normalized amplitude combination", "A deterministic result"], answer: 2, explanation: "Superposition describes the state; useful speedups require algorithmic interference." },
    ],
  },
  {
    id: "measurement", title: "Measurement", badge: "03", category: "Readout", level: "Beginner",
    summary: "The process that maps a quantum state to a classical outcome with probabilities set by amplitudes.",
    introduction: "Measurement is the interface between a quantum system and a classical record. Choosing a measurement basis determines which question is being asked of the state.",
    intuition: "A state vector contains potential outcomes and phase relationships. Measurement samples one allowed outcome and leaves the system in the corresponding post-measurement state.",
    formal: "In the computational basis, |ψ⟩ = α|0⟩ + β|1⟩ yields 0 with |α|² and 1 with |β|². For multiple qubits, each basis state's probability is the squared magnitude of its amplitude.",
    equations: ["P(0) = |α|²", "P(1) = |β|²", "Σx P(x) = 1", "|+⟩ → 0 (50%) or 1 (50%)"],
    workedExample: "A single shot from H|0⟩ may be 0. That does not contradict the 50/50 state; repeating the same circuit produces a histogram that converges toward the predicted distribution.",
    visualization: "Circuit Lab's probability panel turns amplitudes into a histogram. The state vector shows complex amplitudes, while the histogram shows their squared magnitudes.",
    circuitExample: "q0 ── H ── M\n\nUse the measurement panel in Circuit Lab and compare a single shot with the predicted distribution.",
    practical: "Measurement is essential for reading algorithm output, benchmarking circuits, and comparing simulated probabilities with hardware results.",
    misconceptions: ["Measurement is not passive observation of a classical hidden value.", "A 50% probability does not mean half a qubit was measured.", "A finite number of shots may differ from the exact probability."],
    resources: [{ label: "IBM Quantum Learning", href: "https://learning.quantum.ibm.com/" }, { label: "NIST Quantum Information Science", href: "https://www.nist.gov/topics/physics/quantum-information-science" }],
    quiz: [
      { question: "What determines computational-basis probabilities?", options: ["Amplitude squared magnitudes", "Gate labels only", "The number of qubits alone", "The screen size"], answer: 0, explanation: "Born's rule uses squared amplitude magnitudes." },
      { question: "What does a shot mean?", options: ["A gate matrix", "One circuit execution and readout", "A qubit reset only", "A phase angle"], answer: 1, explanation: "Shots are repeated executions used to estimate a distribution." },
      { question: "After measuring |+⟩ and getting 0, what is the ideal post-measurement basis state?", options: ["|1⟩", "|+⟩ always", "|0⟩", "A three-qubit state"], answer: 2, explanation: "The result projects the state to |0⟩ in that basis." },
      { question: "Why can a finite histogram differ from exact probabilities?", options: ["Sampling variation", "The Born rule changes", "The qubit becomes classical forever", "Gates stop being unitary"], answer: 0, explanation: "Finite samples fluctuate around the underlying probability distribution." },
      { question: "What is a measurement basis?", options: ["The question used to resolve a quantum state", "A hardware battery", "A gate depth counter", "A circuit filename"], answer: 0, explanation: "Changing basis changes which observables and outcomes are being read." },
    ],
  },
  {
    id: "gates", title: "Quantum Gates", badge: "04", category: "Operations", level: "Intermediate",
    summary: "Reversible unitary transformations that change amplitudes and phases while preserving total probability.",
    introduction: "Quantum gates are the instructions of a circuit. Unlike measurement, ideal gates are reversible and preserve the norm of the state vector.",
    intuition: "Single-qubit gates rotate a state on the Bloch sphere. Controlled gates make an operation conditional on another qubit and can create correlations.",
    formal: "An ideal gate is represented by a unitary matrix U satisfying U†U = I. Applying it means multiplying U by the state vector.",
    equations: ["U†U = I", "X = [[0,1],[1,0]]", "H = 1/√2 [[1,1],[1,−1]]", "Z|1⟩ = −|1⟩"],
    workedExample: "X maps |0⟩ to |1⟩. H maps |0⟩ to |+⟩. Applying H twice returns |0⟩, illustrating reversibility.",
    visualization: "The circuit workspace shows gates by time column; Quantum State Evolution exposes the state after each applied column.",
    circuitExample: "q0 ── H ── Z ── H\n\nThe sequence demonstrates how a phase operation can become a measurable bit flip.",
    practical: "Gate libraries are the bridge between an algorithm description and hardware-native pulses. Circuit Lab supports H, X, Y, Z, CNOT, and Measure.",
    misconceptions: ["A gate is not a measurement and does not randomly choose an output.", "Unitary does not mean every gate leaves probabilities unchanged; amplitudes can move between basis states.", "Controlled gates act on a joint state, not on an isolated target in every context."],
    resources: [{ label: "IBM Quantum Learning: Quantum gates", href: "https://learning.quantum.ibm.com/" }, { label: "TU Delft Quantum Inspire", href: "https://www.quantum-inspire.com/" }],
    quiz: [
      { question: "What property makes an ideal quantum gate reversible?", options: ["It is unitary", "It measures first", "It deletes phase", "It is classical"], answer: 0, explanation: "Unitary matrices have inverses given by their adjoints." },
      { question: "What does X do to |0⟩?", options: ["Leaves it unchanged", "Maps it to |1⟩", "Measures it", "Creates three qubits"], answer: 1, explanation: "X is the quantum bit-flip gate." },
      { question: "What can CNOT create?", options: ["Only classical text", "Correlations and entanglement", "A measurement device", "A non-normalized state"], answer: 1, explanation: "CNOT conditionally flips a target and can entangle qubits." },
      { question: "Which gate applies a phase of −1 to |1⟩ while leaving |0⟩ unchanged?", options: ["X", "H", "Z", "CNOT"], answer: 2, explanation: "Z|0⟩ = |0⟩ and Z|1⟩ = −|1⟩." },
      { question: "What does a controlled operation use?", options: ["A control condition on another qubit", "A classical screenshot", "A random measurement first", "An unnormalized vector"], answer: 0, explanation: "The target operation is applied conditionally on the control state." },
    ],
  },
  {
    id: "entanglement", title: "Entanglement", badge: "05", category: "Correlations", level: "Intermediate",
    summary: "A joint quantum state whose correlations cannot be described as independent states for each qubit.",
    introduction: "Entanglement is a property of a composite state. It appears when the joint state cannot be factored into one state for each subsystem.",
    intuition: "The pair must be described together. Measuring one part gives information about correlations in the other, but it does not send a controllable message faster than light.",
    formal: "The Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 is entangled because it cannot be written as |a⟩⊗|b⟩. Its marginal qubits are individually random but jointly correlated.",
    equations: ["|Φ+⟩ = (|00⟩ + |11⟩)/√2", "P(00) = 50%", "P(11) = 50%", "P(01) = P(10) = 0%"],
    workedExample: "Begin with |00⟩, apply H to q0, then CNOT with q0 as control and q1 as target. The result is |Φ+⟩.",
    visualization: "Circuit Lab's reduced-state purity and correlation readouts help distinguish local mixedness from correlations in the full state.",
    circuitExample: "q0 ── H ── ● ──\n             │\nq1 ─────── X ──",
    practical: "Entanglement underlies teleportation, error correction, distributed protocols, and many quantum algorithms, but it must be interpreted together with measurement and communication.",
    misconceptions: ["Entanglement is not faster-than-light communication.", "The two outcomes are not individually predetermined classical values in the Bell-state description.", "Entanglement is a property of the joint state, not a mysterious force between particles."],
    resources: [{ label: "IBM Quantum Learning", href: "https://learning.quantum.ibm.com/" }, { label: "University of Waterloo IQC", href: "https://uwaterloo.ca/institute-for-quantum-computing/" }],
    quiz: [
      { question: "Which state is a Bell state?", options: ["|00⟩", "(|00⟩ + |11⟩)/√2", "|01⟩", "|0⟩ + |1⟩ without normalization"], answer: 1, explanation: "The normalized Bell state is an entangled two-qubit state." },
      { question: "What are the ideal outcomes for |Φ+⟩?", options: ["00 and 11", "01 and 10", "Only 01", "All four equally"], answer: 0, explanation: "Only the correlated basis states have nonzero probability." },
      { question: "Can entanglement alone transmit a controllable message instantly?", options: ["Yes", "Only with a third qubit", "No", "Only after deleting measurement"], answer: 2, explanation: "Correlations still require classical communication to compare results." },
      { question: "What circuit creates |Φ+⟩ from |00⟩?", options: ["X then X", "H on q0 then CNOT", "Z then Measure", "Measure then H"], answer: 1, explanation: "H creates the branch superposition and CNOT correlates the pair." },
      { question: "What is true of an entangled state?", options: ["It always factors into two independent states", "Its joint state cannot be written as a simple tensor product", "It cannot be measured", "It is always classical"], answer: 1, explanation: "Non-factorizability is the mathematical signature of entanglement." },
    ],
  },
  {
    id: "algorithms", title: "Quantum Algorithms", badge: "06", category: "Applications", level: "Advanced",
    summary: "Circuit-based procedures that use interference, phase, and entanglement to solve structured problems.",
    introduction: "A quantum algorithm is more than a list of gates: it is a strategy for shaping amplitudes so useful outcomes become more likely when measured.",
    intuition: "Quantum advantage comes from coordinating interference. Superposition creates possibilities, but the algorithm must arrange phases so paths reinforce or cancel in a useful way.",
    formal: "Algorithms are expressed as unitary circuits followed by measurement. Oracles encode a problem, while amplitude amplification and phase estimation are recurring design patterns.",
    equations: ["U_algorithm = U_n … U_2 U_1", "Grover iterations ≈ π√N/4", "Interference: amplitudes add before probabilities are squared"],
    workedExample: "Deutsch–Jozsa prepares a query register, applies an oracle, then interferes the result with Hadamards. The final measurement distinguishes constant from balanced functions in the ideal promise setting.",
    visualization: "For algorithms beyond the local simulator's current scope, NIRVANA presents circuit structure and concepts rather than inventing execution results.",
    circuitExample: "Explore H and CNOT building blocks in Circuit Lab; use them to understand the components of Bell-state preparation and teleportation.",
    practical: "Grover's search illustrates amplitude amplification; teleportation illustrates a protocol using entanglement and classical bits; Shor's algorithm introduces period finding and the quantum Fourier transform.",
    misconceptions: ["Quantum algorithms do not make every problem exponentially faster.", "The algorithm still needs a useful problem structure and a readable measurement.", "Shor, Grover, and Deutsch–Jozsa are different algorithms with different assumptions and goals."],
    resources: [{ label: "IBM Quantum Learning", href: "https://learning.quantum.ibm.com/" }, { label: "NIST Quantum Information Science", href: "https://www.nist.gov/topics/physics/quantum-information-science" }],
    quiz: [
      { question: "What does interference help an algorithm do?", options: ["Shape amplitudes toward useful outcomes", "Remove all measurement", "Make every answer certain", "Replace the oracle"], answer: 0, explanation: "Interference is used to amplify or cancel computational paths." },
      { question: "What does Grover's algorithm illustrate?", options: ["Amplitude amplification", "Classical sorting only", "Qubit cooling", "State deletion"], answer: 0, explanation: "Grover amplifies the amplitude of marked states." },
      { question: "Why are some algorithms presented conceptually here?", options: ["They do not use circuits", "The current local simulator does not implement every algorithm", "They cannot be explained", "They require no mathematics"], answer: 1, explanation: "NIRVANA avoids fabricating results outside the simulator's supported scope." },
      { question: "What is Grover's algorithm primarily designed to improve?", options: ["Unstructured search", "Qubit fabrication", "Classical file compression", "Measurement duration"], answer: 0, explanation: "Grover provides a quadratic query improvement for unstructured search." },
      { question: "What does the quantum Fourier transform help expose?", options: ["Periodic/phase structure", "Only bit flips", "The screen layout", "A replacement for measurement"], answer: 0, explanation: "The QFT is a key tool for revealing periodic phase information." },
    ],
  },
];
