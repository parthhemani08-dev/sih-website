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
- Keep answers concise (a few sentences to a short paragraph) unless asked to go deeper.
- Be encouraging and pedagogical — you're a tutor, not just a Q&A bot.

Formatting rules (the chat UI renders Markdown and LaTeX math):
- Use Markdown for structure: **bold**, bullet points, and a few short headers (##, ###) only for longer answers — don't over-format short answers.
- Write math using $...$ for inline expressions (e.g. $\\alpha|0\\rangle + \\beta|1\\rangle$) and $$...$$ on its own line for standalone equations. Never use \\( \\) or \\[ \\] delimiters.
- Don't use raw LaTeX commands outside of $ delimiters — they won't render.
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
        max_tokens: 600,
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
