import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LEFT = ["ABOUT", "STATS", "DESTINATION"];
const RIGHT = ["FAQ", "VIC"];

function MagneticLink({ label }: { label: string }) {
  // We'll map "contact" to the footer section
  const targetId = label === "VIC" ? "contact" : label.toLowerCase();
  
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const reset = () => { x.set(0); y.set(0); };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.a
      ref={ref}
      href={`#${targetId}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={handleClick}
      style={{ x: sx, y: sy }}
      className="group relative flex items-center justify-center font-bebas text-[22px] tracking-[0.2em] transition-colors duration-300 hover:text-[var(--cyan-neon)]"
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-[var(--cyan-neon)] shadow-[0_0_8px_var(--cyan-neon)] transition-all duration-300 group-hover:w-full group-hover:left-0" />
    </motion.a>
  );
}

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isDark, setIsDark] = useState(false);

  // Height and Background transitions
  const height = useTransform(scrollY, [0, 100], ["80px", "64px"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.85]);

  const bgLight = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;
  const bgDark = useMotionTemplate`rgba(9, 9, 11, ${bgOpacity})`;

  

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
      style={{ 
        height, 
        backdropFilter: blur,
        backgroundColor: isDark ? bgDark : bgLight,
        borderColor: "rgba(255,255,255,0.1)" 
      }}
      className={`fixed top-0 inset-x-0 z-[100] border-b transition-colors duration-700 text-zinc-900`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--cyan-neon)] to-transparent" />
        <div className="absolute top-0 right-10 w-[1px] h-full bg-[var(--cyan-neon)] animate-pulse" />
      </div>

      <div className="h-full mx-auto max-w-[1600px] px-8 flex items-center justify-between gap-6">
        <nav className="hidden lg:flex flex-1 items-center justify-end gap-10">
          {LEFT.map((l) => <MagneticLink key={l} label={l} />)}
        </nav>

        {/* Center docking zone */}
        <div id="logo-dock" className="relative flex-none w-[180px] h-full flex items-center justify-center">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center select-none group relative"
          >
            <img 
              src="/plmz.png" 
              alt="Polymaze Logo" 
              className={`h-10 object-contain transition-all duration-700 ${isDark ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] invert" : ""}`} 
            />
            {/* Tactical scanning dot */}
            <div className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[var(--cyan-neon)] animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <nav className="hidden lg:flex flex-1 items-center justify-start gap-10">
          {RIGHT.map((l) => <MagneticLink key={l} label={l} />)}
        </nav>

        {/* mobile */}
        <button className="lg:hidden font-bebas tracking-widest text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--cyan-neon)] rounded-full animate-pulse" />
          MENU
        </button>
      </div>
    </motion.header>
  );
}
