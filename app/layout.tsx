import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIRVANA | Smarter communities, better tomorrows",
  description:
    "NIRVANA is a human-centred platform for building more resilient, connected communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
