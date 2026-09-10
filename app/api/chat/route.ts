// app/api/chat/route.ts
// New file. Next.js automatically turns this into a live endpoint at /api/chat.
// Works identically on `next dev` (local) and once deployed to Vercel.

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the AI assistant embedded in NIRVANA, an interactive quantum
computing learning platform (built for SIH problem statement SIH26140).

Your job:
- Explain quantum computing concepts (qubits, superposition, entanglement, gates,
  measurement, algorithms like Deutsch-Jozsa, Grover, Shor, QFT) clearly, with simple
  analogies before diving into math/notation.
- Use the page/circuit context provided to you to give specific, relevant answers —
  e.g. if the user is in the Circuit Lab and their circuit has an H gate on qubit 0
  followed by a CNOT, recognize that as a Bell state and explain the expected
  measurement distribution.
- If given a validation error, explain it in plain language and how to fix it.
- Keep answers focused — prefer 2-4 short paragraphs or a small table over an exhaustive one. If a topic has many parts (e.g. "explain all quantum gates"), cover the 2-3 most important ones fully and offer to continue with the rest, rather than cramming everything in and running out of room mid-explanation.
- Be encouraging and pedagogical — you're a tutor, not just a Q&A bot.

Formatting rules (the chat UI renders Markdown and LaTeX math):
- Use Markdown for structure: **bold**, bullet points, and a few short headers (##, ###) only for longer answers — don't over-format short answers.
- Write ALL math using $ for inline expressions and $$ on its own line for standalone equations. This is mandatory — never use any of these wrong styles: \\( \\), \\[ \\], plain (parentheses), or plain [square brackets] around LaTeX commands.
  Correct:   The state is $\\alpha|0\\rangle + \\beta|1\\rangle$, and $P(0)=|\\alpha|^{2}$.
  Incorrect: (|\\alpha|^{2})  ·  \\(|\\alpha|^{2}\\)  ·  \\[|\\alpha|^{2}\\]  ·  [X|0\\rangle = |1\\rangle]
- NEVER put a matrix (\\begin{pmatrix}...\\end{pmatrix}) or any multi-line equation inside a Markdown table cell — table syntax breaks it. If you want to show a gate's matrix, write it as its own standalone $$...$$ block on its own line, outside of any table. Tables should only contain short plain-text labels.
- CRITICAL: every $, $$, \\begin{...}, and \\bigl/\\bigr pair must be fully closed before you stop writing. Never end your answer in the middle of an equation, a table row, or a matrix — finish the expression first, then wrap up.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // Turn the page/circuit context object into a short text block the model can use.
    const contextSummary = `Current page: ${context?.currentPage ?? "unknown"}.
Current section: ${context?.currentSection ?? "n/a"}.
${
  context?.circuit
    ? `Circuit: ${context.circuit.qubits} qubit(s), gates = ${JSON.stringify(
        context.circuit.gates
      )}. Validation error: ${context.circuit.validationError ?? "none"}. Measurement results: ${JSON.stringify(
        context.circuit.measurementResults ?? {}
      )}.`
    : ""
}`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextSummary },
      ...(history ?? []).map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages,
        temperature: 0.4,
        max_tokens: 1600,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json(
        { error: data.error?.message ?? "Groq API error" },
        { status: response.status }
      );
    }

    const reply = data.choices?.[0]?.message?.content ?? "(no response)";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error, check logs." }, { status: 500 });
  }
}
