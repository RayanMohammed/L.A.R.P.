"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { type Language, t } from "@/lib/i18n/translations";
import { TypingAnimation } from "@/registry/magicui/typing-animation";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");

  // Responsive scale to fit logic
  useEffect(() => {
    const wrap = document.getElementById("banner-wrap");
    const banner = document.getElementById("banner");
    if (!wrap || !banner) return;
    
    function fit() {
      banner!.style.transform = "none";
      banner!.style.marginBottom = "0";
      const bw = banner!.scrollWidth;
      const ww = wrap!.clientWidth;
      if (bw > ww && bw > 0) {
        const s = ww / bw;
        banner!.style.transform = `scale(${s})`;
        banner!.style.transformOrigin = "top center";
        banner!.style.marginBottom = `-${banner!.offsetHeight * (1 - s)}px`;
      }
    }
    
    fit();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    }
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Color breathe effect
  useEffect(() => {
    const banner = document.getElementById("banner");
    if (!banner) return;
    
    const bases = [
      [245, 195, 65],
      [240, 190, 60],
      [235, 185, 55],
      [230, 180, 50],
      [225, 175, 45],
      [230, 180, 50],
      [235, 185, 55],
      [240, 190, 60],
      [250, 200, 70],
      [255, 205, 75],
      [250, 200, 70],
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % bases.length;
      const b = bases[i];
      banner.style.color = `rgb(${b[0]},${b[1]},${b[2]})`;
      banner.style.textShadow = `0 0 6px rgba(${b[0]},${b[1]},${b[2]},0.9), 0 0 18px rgba(${b[0]},${b[1]},${b[2]},0.35), 0 0 40px rgba(${b[0]},${b[1]},${b[2]},0.12)`;
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-foreground font-mono selection:bg-cyber/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        .ascii-banner {
          color: var(--color-cyber);
          text-shadow: 0 0 6px color-mix(in oklab, var(--color-cyber) 90%, transparent), 0 0 18px color-mix(in oklab, var(--color-cyber) 35%, transparent), 0 0 40px color-mix(in oklab, var(--color-cyber) 12%, transparent);
          transition: color 2s ease, text-shadow 2s ease;
          transform-origin: top center;
        }
      `}} />

      {/* Titlebar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-panel px-4 py-2 pt-[calc(8px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <div className="h-[5px] w-[5px] rounded-full bg-mint shadow-[0_0_5px_color-mix(in_oklab,var(--color-mint)_70%,transparent)] animate-pulse-dot" />
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
            <span className="text-cyber">L.A.R.P.</span> &nbsp;/&nbsp; {t("homeEyebrow", language)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-9 telemetry-grid-bg">
        <div className="flex w-full max-w-[800px] flex-col items-center text-center">
          
          {/* Banner */}
          <div id="banner-wrap" className="mb-10 flex w-full justify-center overflow-hidden">
            <div id="banner" className="ascii-banner font-mono text-[18px] leading-[1.15] whitespace-pre text-center">
              {` ██╗         █████╗    ██████╗    ██████╗ 
 ██║        ██╔══██╗   ██╔══██╗   ██╔══██╗
 ██║        ███████║   ██████╔╝   ██████╔╝
 ██║        ██╔══██║   ██╔══██╗   ██╔═══╝ 
 ███████╗██╗██║  ██║██╗██║  ██║██╗██║██╗  
 ╚══════╝╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╚═╝  `}
            </div>
          </div>
          
          <TypingAnimation
            as="h1"
            duration={45}
            startOnView={false}
            className="mb-6 font-label text-2xl font-bold uppercase tracking-[0.2em] text-foreground"
          >
            {t("homeWelcome", language)}
          </TypingAnimation>

          <Link href={`/plan?lang=${language}`} className="group inline-flex items-center justify-center border border-cyber bg-cyber-dim px-10 py-5 font-label text-sm font-bold uppercase tracking-[0.2em] text-cyber-bright transition-all duration-100 ease-linear hover:bg-cyber hover:text-bg active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
            <span className="flex items-center gap-3">
              {t("homeStartIntake", language)} <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
          
        </div>
      </div>
    </div>
  );
}
