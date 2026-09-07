import type { AssistantContext } from "./assistant-context";

export type AssistantMessage = { role: "assistant" | "user"; text: string };

// Calls our own /api/chat route (never call Groq directly from the browser —
// that would expose the API key). Replaces the old rule-based mock logic.
export async function getAssistantResponse(
  message: string,
  context: AssistantContext,
  history: AssistantMessage[] = []
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, history }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Assistant API error:", data.error);
      return "Sorry, I ran into an issue answering that. Please try again.";
    }

    return data.reply;
  } catch (err) {
    console.error(err);
    return "I couldn't reach the server. Check your connection and try again.";
  }
}
