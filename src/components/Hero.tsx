import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";


export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Compute pixel-precise translate from viewport center to navbar dock center.
  const [metrics, setMetrics] = useState({ centerY: 0, dockY: 40, scale: 0.07 });
  useEffect(() => {
    const update = () => {
      const dock = document.getElementById("logo-dock");
      const r = dock?.getBoundingClientRect();
      const dockY = r ? r.top + r.height / 2 : 40;
      const centerY = window.innerHeight / 2;
      // scale so that the "26" height ~= dock height (~50px)
      const targetH = 44;
      // approx rendered height of the logo in px when scale=1 (aspect 2/1 of 90vw width)
      const baseH = Math.min(window.innerWidth * 0.45, 700);
      setMetrics({ centerY, dockY, scale: targetH / baseH });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const yRaw = useTransform(scrollYProgress, [0, 0.7], [0, metrics.dockY - metrics.centerY]);
  const sRaw = useTransform(scrollYProgress, [0, 0.7], [1, metrics.scale]);
  const y = useSpring(yRaw, { stiffness: 120, damping: 24, mass: 0.6 });
  const scale = useSpring(sRaw, { stiffness: 120, damping: 24, mass: 0.6 });

  const subOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const subY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[100vh]">
      {/* Sticky cinematic stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white noise">
        {/* grid */}
        <div className="absolute inset-0 grid-lines opacity-70" />

        {/* corner meta */}
        <div className="absolute top-24 left-6 font-bebas text-xs tracking-[0.3em] text-zinc-500">
          POLYMAZE · VIC . 2026
        </div>
        <div className="absolute top-24 right-6 font-bebas text-xs tracking-[0.3em] text-zinc-500">
          36°45′N · 03°03′E — ALGIERS
        </div>

    
        <motion.div
          style={{ y, scale }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform z-20 pointer-events-none"
        >
          {/* The main logo mask container */}
          <div className="relative w-[clamp(500px,95vw,1600px)] aspect-square md:aspect-[2/1] flex flex-col items-center">
            
            {/* DESKTOP Mask (hidden on mobile) */}
            <div
              className="hidden md:block w-full h-full bg-cover bg-center border border-transparent"
              style={{
                // IMPORTANT: Put your city image (e.g., skyline.jpg) in the 'public' folder
                backgroundImage: "url('/participate.webp')",
                
                // IMPORTANT: Put the 26 logo (black shape with transparent background) in 'public'
                WebkitMaskImage: "url('/plmz.png')",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: "url('/plmz.png')",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />

            {/* MOBILE Mask (hidden on desktop, uses polymaze-02.png) */}
            <div
              className="block md:hidden w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/participate.webp')",
                
                WebkitMaskImage: "url('/polymaze-02.png')",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: "url('/polymaze-02.png')",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />
          </div>
        </motion.div>

        {/* sub label */}
        <motion.div
          style={{ opacity: subOpacity, y: subY }}
          className="absolute left-1/2 -translate-x-1/2 bottom-[14vh] text-center z-20"
        >
         
          <div className="mt-3 font-bebas tracking-[0.4em] text-xs text-zinc-500">
            JUNE · 2026
          </div>
        </motion.div>

        <style>{`
          @keyframes heroMask {
            0% { background-position: 0% 50%; --a: 0deg; }
            100% { background-position: 200% 50%; --a: 360deg; }
          }
        `}</style>
      </div>
    </section>
  );
}
