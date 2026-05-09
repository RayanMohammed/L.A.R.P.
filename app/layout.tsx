import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
const label = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "L.A.R.P. — start your resume this week",
  description:
    "For first-year UC San Diego students with no resume yet. Pick a role you might want and see exactly what to do this week on campus to start building toward it.",
  metadataBase: new URL("https://larp.local"),
  openGraph: {
    title: "L.A.R.P. — start your resume this week",
    description:
      "Pick a target role, map what you've done, get 3–5 ranked things to do this week on campus.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${label.variable}`}>
      <body className="min-h-dvh bg-bg text-foreground antialiased flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:bg-panel focus:text-foreground focus:border focus:border-cyber"
        >
          Skip to content
        </a>
        <main id="main" className="telemetry-grid-bg flex-1 min-h-0 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
