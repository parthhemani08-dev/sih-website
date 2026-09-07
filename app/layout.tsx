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
