"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// The AI sometimes writes math using \[ ... \] and \( ... \) (old-style LaTeX
// delimiters) instead of the $$ ... $$ / $ ... $ format our Markdown renderer
// expects. Convert them here so math renders correctly either way, regardless
// of which style the model happens to use in a given response.
function normalizeMathDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => `$$${expr}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, expr) => `$${expr}$`)
    // Catches math the model wrote in plain parentheses, e.g. (|\alpha|^{2})
    // — only matches when it contains a LaTeX command (a backslash + letters)
    // so normal parenthetical sentences are left untouched.
    .replace(/\(([^()]*\\[a-zA-Z]+[^()]*)\)/g, (_, expr) => `$${expr}$`);
}

// Renders AI responses that contain Markdown formatting (headers, bold, lists)
// and LaTeX math. Used anywhere the AI's raw text would otherwise show up as
// literal "###" or "\alpha" symbols instead of proper formatting.
export default function MarkdownMessage({ text }: { text: string }) {
  return (
    <div className="markdown-message text-sm leading-6">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {normalizeMathDelimiters(text)}
      </ReactMarkdown>
    </div>
  );
}
