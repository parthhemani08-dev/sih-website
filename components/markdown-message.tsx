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
  let normalized = text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => `$$${expr}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, expr) => `$${expr}$`)
    // Catches math the model wrote in plain parentheses, e.g. (|\alpha|^{2})
    // — only matches when it contains a LaTeX command (a backslash + letters)
    // so normal parenthetical sentences are left untouched.
    .replace(/\(([^()]*\\[a-zA-Z]+[^()]*)\)/g, (_, expr) => `$${expr}$`)
    // Same idea for plain square brackets used as display-math delimiters,
    // e.g. [ X|0\rangle = |1\rangle ] — avoids misfiring on markdown links
    // by requiring a LaTeX command inside and no nested brackets.
    .replace(/\[([^\[\]]*\\[a-zA-Z]+[^\[\]]*)\]/g, (_, expr) => `$$${expr}$$`);

  // Protect well-formed $$...$$ and $...$ spans from the stray-marker cleanup
  // below, so we only ever touch delimiters that are genuinely unmatched.
  const blocks: string[] = [];
  normalized = normalized.replace(/\$\$([\s\S]*?)\$\$/g, (m) => {
    blocks.push(m);
    return `\u0000B${blocks.length - 1}\u0000`;
  });
  const inlines: string[] = [];
  normalized = normalized.replace(/\$([^$\n]+?)\$/g, (m) => {
    inlines.push(m);
    return `\u0000I${inlines.length - 1}\u0000`;
  });

  // A stray, unmatched delimiter usually means one of two things: the
  // response got cut off right after it (truncation — close it), or it's a
  // one-off glitch somewhere in the middle of a much longer message (in
  // which case blindly closing it at the very end would swallow all the
  // real content in between into one broken equation). We tell those apart
  // by how much text follows: only treat it as truncation when the marker
  // is near the end of the message.
  const stripOrClose = (str: string, marker: string) => {
    const idx = str.indexOf(marker);
    if (idx === -1) return str;
    const remaining = str.length - (idx + marker.length);
    return remaining <= 150 ? str + marker : str.slice(0, idx) + str.slice(idx + marker.length);
  };
  normalized = stripOrClose(normalized, "$$");
  normalized = stripOrClose(normalized, "$");

  normalized = normalized.replace(/\u0000B(\d+)\u0000/g, (_, i) => blocks[Number(i)]);
  normalized = normalized.replace(/\u0000I(\d+)\u0000/g, (_, i) => inlines[Number(i)]);

  return normalized;
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
