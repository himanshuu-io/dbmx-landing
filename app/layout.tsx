import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DBMX — Orchestrate, test and ship AI agent pipelines",
  description:
    "DBMX gives engineering teams a visual canvas to wire up AI agents, replay them in a sandbox and ship them to production with confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-black font-sans text-white">{children}</body>
    </html>
  );
}
