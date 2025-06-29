import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

/* 1️⃣  Load variable fonts (single file each) */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "variable",   // pulls just one variable‑font file
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

/* 2️⃣  Metadata */
export const metadata: Metadata = {
  title: "SmartHire Genie",
  description: "AI‑powered interview practice & feedback",
};

/* 3️⃣  Attach the CSS variables to <body> */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`${inter.variable} ${sora.variable} ${jetBrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
