"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Renders AI responses that contain Markdown formatting (headers, bold, lists)
// and LaTeX math (using $...$ for inline and $$...$$ for block equations).
// Used anywhere the AI's raw text would otherwise show up as literal
// "###" or "\alpha" symbols instead of proper formatting.
export default function MarkdownMessage({ text }: { text: string }) {
  return (
    <div className="markdown-message text-sm leading-6">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
