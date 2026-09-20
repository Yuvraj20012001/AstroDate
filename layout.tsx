import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soulmate Score",
  description: "See your compatibility with everyone here — by love, by chemistry, by vibe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
