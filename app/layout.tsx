import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallPrompt from "./InstallPrompt";

export const metadata: Metadata = {
  title: "Soulmate Score",
  description: "See your compatibility with everyone here — by love, by chemistry, by vibe.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Soulmate Score",
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
