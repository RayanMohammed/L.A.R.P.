/** Glowing lockup — readable everywhere; complements the pixel avatar. */
export function TelemetryAsciiBanner() {
  return (
    <div className="w-full overflow-hidden mb-7 flex justify-start">
      <div className="flex flex-col items-start">
        <div
          className="text-cyber font-mono whitespace-pre text-left"
          style={{
            fontSize: "18px",
            lineHeight: 1.15,
            letterSpacing: "0.04em",
            textShadow:
              "0 0 6px color-mix(in oklab, var(--color-cyber) 90%, transparent), 0 0 18px color-mix(in oklab, var(--color-cyber) 35%, transparent), 0 0 40px color-mix(in oklab, var(--color-cyber) 12%, transparent)",
          }}
        >
          {` ██╗         █████╗    ██████╗    ██████╗ 
 ██║        ██╔══██╗   ██╔══██╗   ██╔══██╗
 ██║        ███████║   ██████╔╝   ██████╔╝
 ██║        ██╔══██║   ██╔══██╗   ██╔═══╝ 
 ███████╗██╗██║  ██║██╗██║  ██║██╗██║██╗  
 ╚══════╝╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╚═╝  `}
        </div>
        <p className="font-label mt-5 text-xs font-bold uppercase tracking-[0.22em] text-cyber-bright sm:text-sm">
          Learn, Apply, Reflect, Progress
        </p>
      </div>
    </div>
  );
}
