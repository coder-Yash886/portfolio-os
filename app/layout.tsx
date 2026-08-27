import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yash — Portfolio OS",
  description:
    "An interactive desktop-style portfolio. Open apps, explore projects, and get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
