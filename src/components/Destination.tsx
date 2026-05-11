import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function TacticalOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden mix-blend-screen opacity-60">
      {/* Scan lines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
      
      {/* Target Crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[var(--cyan-neon)]/30 rounded-full flex items-center justify-center">
        <div className="w-full h-[1px] bg-[var(--cyan-neon)]/20 absolute" />
        <div className="h-full w-[1px] bg-[var(--cyan-neon)]/20 absolute" />
        <div className="w-64 h-64 border border-[var(--cyan-neon)]/50 rounded-full animate-ping [animation-duration:3s]" />
      </div>

      {/* Grid corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[var(--cyan-neon)]/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[var(--cyan-neon)]/50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[var(--cyan-neon)]/50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[var(--cyan-neon)]/50" />
    </div>
  );
}

export default function Destination() {
  const ref = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start start", "end end"] 
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    mass: 0.5
  });

  // Deep zoom effect across the 400vh scroll
  const earthScale = useTransform(smoothProgress, [0, 0.4], [1, 25]);
  const earthOpacity = useTransform(smoothProgress, [0.3, 0.4], [1, 0]);

  const mapScale = useTransform(smoothProgress, [0.3, 0.7], [0.5, 10]);
  const mapOpacity = useTransform(smoothProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);

  const venueScale = useTransform(smoothProgress, [0.6, 1], [0.8, 1.2]);
  const venueOpacity = useTransform(smoothProgress, [0.6, 0.7], [0, 1]);

  const textY = useTransform(smoothProgress, [0.7, 1], ["50%", "0%"]);
  const textOpacity = useTransform(smoothProgress, [0.7, 0.9], [0, 1]);

  const coordinatesOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    return smoothProgress.on("change", (v) => {
      // Lerp from random start to Ecole Nationale Polytechnique coordinates
      const targetLat = 36.7233;
      const targetLng = 3.1508;
      setCoords({
        lat: 10 + (targetLat - 10) * v,
        lng: -20 + (targetLng + 20) * v
      });
    });
  }, [smoothProgress]);

  return (
    <section ref={ref} id="destination" className="relative h-[400vh] bg-black text-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <TacticalOverlay />

        {/* --- STAGE 1: EARTH VIEW --- */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center origin-center"
          style={{ scale: earthScale, opacity: earthOpacity }}
        >
          <img
            src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000"
            alt="Earth from space"
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>

        {/* --- STAGE 2: ALGERIA TACTICAL MAP --- */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center origin-center mix-blend-screen"
          style={{ scale: mapScale, opacity: mapOpacity }}
        >
          {/* Abstract map lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)] z-10" />
          <svg className="absolute w-[200%] h-[200%] stroke-[var(--cyan-neon)]/40" viewBox="0 0 100 100">
             <path d="M 0 50 Q 25 20, 50 50 T 100 50" fill="none" strokeWidth="0.2" className="animate-pulse" />
             <path d="M 50 0 L 50 100" fill="none" strokeWidth="0.1" strokeDasharray="1 1" />
             <path d="M 0 50 L 100 50" fill="none" strokeWidth="0.1" strokeDasharray="1 1" />
             {/* glowing node */}
             <circle cx="50" cy="50" r="1" fill="var(--cyan-neon)" className="animate-ping" />
          </svg>
        </motion.div>

        {/* --- STAGE 3: VENUE REVEAL --- */}
        <motion.div 
          className="absolute inset-0 origin-center pointer-events-none"
          style={{ scale: venueScale, opacity: venueOpacity }}
        >
          <div className="w-full h-full bg-zinc-950">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.974294040845!2d3.15076710000001!3d36.72317859999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e52692905dcdf%3A0x2bb008bbddc747d3!2sNational%20Polytechnic%20School%20of%20Algiers!5e0!3m2!1sen!2sdz!4v1778432169903!5m2!1sen!2sdz"
              className="w-full h-full border-0 opacity-60 invert grayscale contrast-125"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {/* Red pulse on venue */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_30px_10px_rgba(239,68,68,0.6)] animate-pulse" />
          </div>
        </motion.div>

        {/* --- TACTICAL COORDINATES (Always on) --- */}
        <motion.div 
          className="absolute top-12 left-12 font-mono text-xs tracking-widest text-[var(--cyan-neon)] z-40"
          style={{ opacity: coordinatesOpacity }}
        >
          <div className="mb-2 uppercase border-b border-[var(--cyan-neon)]/30 pb-1 w-32">
            SYS: NAV_LOCK
          </div>
          <div>LAT {coords.lat.toFixed(4)}° N</div>
          <div>LNG {Math.abs(coords.lng).toFixed(4)}° {coords.lng > 0 ? 'E' : 'W'}</div>
          <div className="mt-4 truncate w-48 opacity-60">
            {`> TRK_${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
          </div>
        </motion.div>

        {/* --- FINAL TYPOGRAPHY REVEAL --- */}
        <motion.div 
          className="absolute bottom-12 left-0 w-full px-12 z-40 flex flex-col items-start"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div className="font-bebas tracking-[0.5em] text-[var(--cyan-neon)] text-sm mb-4">
            TARGET ACQUIRED · POLYMAZE 2026
          </div>
          <h2 className="font-display text-[clamp(60px,12vw,200px)] leading-[0.8] mb-8 mix-blend-screen">
            ALGIERS
          </h2>
          <div className="max-w-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-sm">
            <p className="font-mono text-xs leading-relaxed text-zinc-300">
              MISSION BRIEFING / REGION 1: THE WHITE CITY<br/><br/>
              WHERE THE MEDITERRANEAN MEETS THE FUTURE. THE HISTORIC METROPOLIS BECOMES THE WORLD'S ROBOTICS CAPITAL FOR ONE UNFORGETTABLE WEEK OF ENGINEERING SPECTACLE.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
