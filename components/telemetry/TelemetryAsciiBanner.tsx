/** Glowing lockup — readable everywhere; complements the pixel avatar. */
export function TelemetryAsciiBanner() {
  return (
    <div className="w-full overflow-hidden mb-7 flex justify-center">
      <div className="flex flex-col items-center">
        <div
          className="text-cyber font-mono whitespace-pre text-center"
          style={{
            fontSize: "18px",
            lineHeight: 1.15,
            letterSpacing: "0.04em",
            textShadow:
              "0 0 6px rgba(100, 149, 237, 0.9), 0 0 18px rgba(100, 149, 237, 0.35), 0 0 40px rgba(100, 149, 237, 0.12)",
          }}
        >
          {` ██╗           █████╗      ██████╗      ██████╗    
 ██║          ██╔══██╗     ██╔══██╗     ██╔══██╗   
 ██║          ███████║     ██████╔╝     ██████╔╝   
 ██║          ██╔══██║     ██╔══██╗     ██╔═══╝    
 ███████╗██╗  ██║  ██║██╗  ██║  ██║██╗  ██║     ██╗
 ╚══════╝╚═╝  ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═╝╚═╝  ╚═╝     ╚═╝`}
        </div>
        <p className="font-label mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyber-bright sm:text-[11px]">
          Start your resume — this week · UC San Diego
        </p>
      </div>
    </div>
  );
}
