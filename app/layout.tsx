import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIRVANA | Quantum Learning Lab",
  description: "A modern quantum learning platform for exploring circuits, concepts, and state evolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try { if (localStorage.getItem('quantumlab-theme') !== 'light') document.documentElement.classList.add('dark'); } catch (error) {}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
