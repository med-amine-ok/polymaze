import { motion, useScroll, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useEffect, useMemo, useState } from "react";

import ModelViewer from "./ModelViewer";


const PANEL_COUNT = 2;
const SECTION_HEIGHT = "600vh"; // Reduced height since we combined panels



/* ─── Animated Grid Background ─── */
function GridBg({ progress }: { progress: any }) {
  const x = useTransform(progress, [0, 1], [0, -200]);
  const y = useTransform(progress, [0, 1], [0, -100]);
  return (
    <motion.div
      style={{ x, y }}
      className="absolute inset-[-200px] pointer-events-none opacity-[0.07]"
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hgrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0V80H0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgrid)" />
      </svg>
    </motion.div>
  );
}

/* ─── Floating Particles ─── */
function Particles({ count = 30 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 8 + Math.random() * 12,
        delay: Math.random() * 5,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-zinc-400"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Maze SVG ─── */
function MazeSVG({ progress, glow = false }: { progress: any; glow?: boolean }) {
  const pathLen = useTransform(progress, [0, 1], [0, 1]);
  const color = glow ? "var(--electric)" : "#18181b";
  const opacity = glow ? 0.6 : 0.12;
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 w-full h-full"
      style={{ opacity }}
    >
      {/* Maze walls */}
      {[
        "M0 40H160V120H80V200H240V120H320V280H240V360H400",
        "M40 0V80H120V160H200V80H280V200H360V320H280V400",
        "M0 200H40V280H120V200H200V320H120V400",
        "M200 0V40H320V120H400",
        "M0 320H40V400",
        "M360 0V40H400",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{ pathLength: pathLen }}
          transition={{ duration: 0 }}
        />
      ))}
      {/* Navigating dot */}
      <motion.circle
        cx="0"
        cy="40"
        r={glow ? 5 : 3}
        fill={glow ? "var(--electric)" : "#18181b"}
      >
        <animateMotion dur="8s" repeatCount="indefinite" path="M0 40H160V120H80V200H240V120H320V280H240V360H400" />
      </motion.circle>
    </svg>
  );
}

/* ─── Counter Component ─── */
const STATS = [
  { value: 32, label: "TEAMS", suffix: "" },
  { value: 24, label: "ROBOTS", suffix: "" },
  { value: 48, label: "HOURS", suffix: "H" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { stiffness: 60, damping: 20 });
  const txt = useTransform(sv, (v) => Math.round(v).toString() + suffix);
  useEffect(() => { if (inView) mv.set(to); }, [inView, mv, to]);
  return <motion.span ref={ref}>{txt}</motion.span>;
}

/* ─── Word-by-word text reveal ─── */
function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ y: 80, opacity: 0, rotateX: -40 }}
          animate={inView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Scanning Line ─── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-40 pointer-events-none"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  );
}

function CodeRain() {
  const lines = [
    "motor.setPWM(255);",
    "sensor.read(IR_FRONT);",
    "if(dist < 10) turn();",
    "path.solve(maze);",
    "robot.navigate();",
    "PID.update(error);",
    "grid.scan(sector);",
    "arm.rotate(90);",
    "lidar.sweep(360);",
    "maze.solve(BFS);",
    "encoder.count++;",
    "servo.write(pos);",
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none font-mono text-[11px] text-zinc-400 opacity-30">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="absolute whitespace-nowrap"
          style={{ left: `${5 + (i % 4) * 25}%`, top: `${(i * 8) % 90}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        >
          {l}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Radar Pulse ─── */
function RadarPulse() {
  return (
    <div className="relative w-[280px] h-[280px]">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-[var(--electric)]"
          animate={{ scale: [0.3, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 rounded-full bg-[var(--electric)]"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      {/* Sweep line */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[140px] h-[1px] bg-gradient-to-r from-[var(--electric)] to-transparent origin-left"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PANELS
   ═══════════════════════════════════════════════════ */

function Panel1({ progress }: { progress: any }) {
  const mazeScale = useTransform(progress, [0, 0.20], [0.7, 1.1]);
  const imgY = useTransform(progress, [0, 0.20], [60, -60]);
  const imgScale = useTransform(progress, [0, 0.20], [0.9, 1.05]);
  
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden ">
      <GridBg progress={progress} />
      {/* Dark panel for contrast */}
      <motion.div style={{ scale: mazeScale }} className="absolute inset-0">
        <MazeSVG progress={progress} glow />
      </motion.div>
      
      {/* Radar */}
      <div className="absolute top-[15%] left-[5%] opacity-30">
        <RadarPulse />
      </div>
      <ScanLine />
      <Particles count={25} />

      {/* LEFT SIDE: Description */}
      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-16 h-[50vh] md:h-full pt-4 md:pt-0">
        <div className="max-w-xl text-left">
          <motion.div
            className="font-display text-[clamp(32px,8vw,140px)] leading-[0.85] text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <WordReveal text="WHAT IS POLYMAZE" className="text-black" />
          </motion.div>
          <motion.div
            className="mt-4 md:mt-8 w-[80px] h-[2px] bg-[var(--electric)]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />
          <motion.p
            className="mt-4 md:mt-8 text-sm md:text-xl lg:text-2xl text-black-300 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <strong className="text-black font-normal">POLYMAZE</strong> is a maze-solving competition hosted by the Vision & Innovation Club. Designed robots rely on their programming and sensors to independently navigate the maze, showcasing impressive robotic abilities.
          </motion.p>
        </div>
      </div>

      {/* RIGHT SIDE: Robot */}
      <div className="relative z-10 w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center pb-32 md:pb-0">
        {/* Robot visual area */}
        <motion.div style={{ y: imgY, scale: imgScale }} className="relative w-[35vh] md:w-[60vw] max-w-[600px] aspect-square -translate-y-8 md:translate-y-0">
          {/* Blueprint grid */}
          <div className="absolute inset-[-20%] grid-lines opacity-10" />
          {/* Robot placeholder — large geometric shape */}
          <div className="absolute inset-0 flex items-center justify-center scale-[1] md:scale-[0.9] md:translate-y-10">
            <ModelViewer />
          </div>
          
        </motion.div>
      </div>

      {/* Corner labels */}
      <div className="absolute top-8 right-8 font-bebas text-[12px] tracking-[0.4em] text-[var(--electric)] font-bold drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
        MICROMOUSE · ROBOTICS
      </div>
      <div className="absolute bottom-8 right-8 font-bebas text-[12px] tracking-[0.4em] text-[var(--electric)] font-bold drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
        MAZE SOLVER · COMPONENT VIEW
      </div>
    </div>
  );
}

function Panel8({ progress }: { progress: any }) {
  // Each picture appears one by one, dropping in from close to the camera (Z=1000)
  // and settling into its final collage position. They stay fully visible (opacity 1) once placed.
  
  const zVals = Array.from({ length: 8 }, (_, i) => {
    const start = 0.45 + i * 0.055;
    return useTransform(progress, [start, start + 0.06], [1000, i * 15]);
  });
  
  const yVals = Array.from({ length: 8 }, (_, i) => {
    const start = 0.45 + i * 0.055;
    // Drop in from slightly above
    return useTransform(progress, [start, start + 0.06], [-200, 0]);
  });
  
  const opVals = Array.from({ length: 8 }, (_, i) => {
    const start = 0.45 + i * 0.055;
    return useTransform(progress, [start, start + 0.06], [0, 1]);
  });

  const rotVals = Array.from({ length: 8 }, (_, i) => {
    const start = 0.45 + i * 0.055;
    // Dynamic twisting as they land
    return useTransform(progress, [start, start + 0.06], [i % 2 === 0 ? -15 : 15, 0]);
  });

  const scaleVals = Array.from({ length: 8 }, (_, i) => {
    const start = 0.45 + i * 0.055;
    return useTransform(progress, [start, start + 0.06], [1.5, 1]);
  });

  const t1Opacity = useTransform(progress, [0.48, 0.56, 0.64], [0, 1, 0]);
  const t1Y = useTransform(progress, [0.48, 0.64], [90, -30]);
  const t1Scale = useTransform(progress, [0.48, 0.64], [0.96, 1.05]);
  const t1Z = useTransform(progress, [0.48, 0.64], [-120, 140]);

  const t2Opacity = useTransform(progress, [0.58, 0.66, 0.73], [0, 1, 0]);
  const t2Y = useTransform(progress, [0.58, 0.73], [70, -20]);
  const t2Scale = useTransform(progress, [0.58, 0.73], [0.98, 1.06]);
  const t2Z = useTransform(progress, [0.58, 0.73], [-80, 120]);

  const t3Opacity = useTransform(progress, [0.66, 0.74, 0.81], [0, 1, 0]);
  const t3X = useTransform(progress, [0.66, 0.81], [-40, 30]);
  const t3Scale = useTransform(progress, [0.66, 0.81], [0.98, 1.08]);
  const t3Z = useTransform(progress, [0.66, 0.81], [-60, 120]);

  const t4Opacity = useTransform(progress, [0.72, 0.80, 0.88], [0, 1, 0]);
  const t4Y = useTransform(progress, [0.72, 0.88], [60, -10]);
  const t4Scale = useTransform(progress, [0.72, 0.88], [0.97, 1.08]);
  const t4Z = useTransform(progress, [0.72, 0.88], [-40, 110]);

  const t5Opacity = useTransform(progress, [0.82, 0.90, 0.98], [0, 1, 0]);
  const t5X = useTransform(progress, [0.82, 0.98], [40, -20]);
  const t5Scale = useTransform(progress, [0.82, 0.98], [0.98, 1.06]);
  const t5Z = useTransform(progress, [0.82, 0.98], [-80, 160]);

  return (
    <div 
      className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden " 
      style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
    >
     
      {/* Cinematic Grain */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-50 pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      <ScanLine />
      <Particles count={40} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />

      {/* Kinetic Typography: behind images */}
      <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        <motion.div
          style={{ opacity: t1Opacity, y: t1Y, scale: t1Scale, z: t1Z }}
          className="absolute left-[4%] top-[4%] w-[92vw] text-white/90 mix-blend-screen"
        >
          <div className="font-display text-[14vw] md:text-[16vw] font-black leading-none tracking-tight uppercase text-[var(--electric)] drop-shadow-[0_0_25px_rgba(0,255,170,0.35)]">
            AUTONOMOUS
          </div>
          <div className="font-display text-[14vw] md:text-[16vw] font-black leading-none tracking-tight uppercase text-white/95">
            INTELLIGENCE
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: t2Opacity, y: t2Y, scale: t2Scale, z: t2Z }}
          className="absolute right-[2%] bottom-[12%] w-[90vw] text-white/80 mix-blend-screen text-right"
        >
          <div className="font-display text-[12vw] md:text-[14vw] font-black leading-none tracking-tight uppercase text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            48 ROBOTS
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Sequence from Original Assets */}
        <motion.div style={{ z: zVals[0], y: yVals[0], opacity: opVals[0], rotate: rotVals[0], scale: scaleVals[0] }} className="absolute w-[35vw] aspect-video top-[15%] left-[5%] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <img src="/pics/6.webp" className="w-full h-full object-cover sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg] brightness-90" />
          <div className="absolute top-2 left-2 text-[8px] font-mono text-[var(--electric)] uppercase bg-black/40 px-1">CAM_01 / EST_DIST_FAR</div>
        </motion.div>
        
        <motion.div style={{ z: zVals[1], y: yVals[1], opacity: opVals[1], rotate: rotVals[1], scale: scaleVals[1] }} className="absolute w-[80vw] aspect-video bottom-[20%] left-[10%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/30">
           <img src="/pics/your.webp" className="w-full h-full object-cover sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg] brightness-90" />
           <div className="absolute top-4 left-4 text-xs font-bebas text-white tracking-[0.5em] bg-black/80 px-2 py-1 border border-white/20">PRE-CALCULATION</div>
        </motion.div>

        {/* Sequence from New Assets 1 - 7 */}
        <motion.div style={{ z: zVals[2], y: yVals[2], opacity: opVals[2], rotate: rotVals[2], scale: scaleVals[2] }} className="absolute w-[35vw] aspect-[4/3] top-[25%] right-[20%] shadow-[0_0_80px_rgba(0,0,0,1)] border border-white/20">
          <img src="/pics/1.webp" className="w-full h-full object-cover brightness-75 sepia-[0.4] contrast-[1.15] saturate-50 hue-rotate-[-10deg]" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[var(--electric)] uppercase bg-black/40 px-1">RECALIBRATE_01</div>
        </motion.div>

        <motion.div style={{ z: zVals[3], y: yVals[3], opacity: opVals[3], rotate: rotVals[3], scale: scaleVals[3] }} className="absolute w-[45vw] aspect-video bottom-[10%] left-[15%] shadow-[0_0_100px_rgba(0,0,0,1)] border border-[var(--electric)]/20">
          <div className="absolute inset-0 bg-[var(--electric)]/10 mix-blend-overlay z-10" />
          <img src="/pics/2.webp" className="w-full h-full object-cover sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg] brightness-90" />
          <div className="absolute top-2 right-2 text-[8px] font-mono text-[var(--electric)] uppercase bg-black/50 px-1">SYS_MEM_02</div>
        </motion.div>

        <motion.div style={{ z: zVals[4], y: yVals[4], opacity: opVals[4], rotate: rotVals[4], scale: scaleVals[4] }} className="absolute w-[30vw] aspect-[3/4] top-[10%] left-[10%] shadow-[0_0_120px_rgba(0,0,0,1)] border border-white/30">
          <img src="/pics/3.webp" className="w-full h-full object-cover mix-blend-luminosity sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg]" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white tracking-widest bg-black/50 px-1">ANALYTICS_ON</div>
        </motion.div>

        <motion.div style={{ z: zVals[5], y: yVals[5], opacity: opVals[5], rotate: rotVals[5], scale: scaleVals[5] }} className="absolute w-[50vw] aspect-video top-[40%] right-[5%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-[var(--electric)]/40">
          <img src="/pics/4.webp" className="w-full h-full object-cover sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg] brightness-90" />
          <div className="absolute inset-0 border-[1px] border-[var(--electric)]/20 scale-[0.98]" />
          <div className="absolute bottom-4 left-4 text-xs font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-white/20">SENSOR_SYNC</div>
        </motion.div>

        <motion.div style={{ z: zVals[6], y: yVals[6], opacity: opVals[6], rotate: rotVals[6], scale: scaleVals[6] }} className="absolute w-[60vw] aspect-[16/9] bottom-[20%] left-[20%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/30">
           <img src="/pics/5.webp" className="w-full h-full object-cover sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg] brightness-90" />
           <div className="absolute top-4 left-4 text-xs font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-[var(--electric)]/30">DATA_LINK_ESTABLISHED</div>
        </motion.div>

        <motion.div style={{ z: zVals[7], y: yVals[7], opacity: opVals[7], rotate: rotVals[7], scale: scaleVals[7] }} className="absolute w-[55vw] aspect-video top-[15%] right-[15%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-[var(--electric)]/30">
           <img src="/pics/participate.webp" className="w-full h-full object-cover sepia-[0.3] contrast-125 saturate-50 hue-rotate-[-10deg] brightness-90" />
           <div className="absolute bottom-4 right-4 text-xs font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-white/20">SYSTEM_OVERRIDE</div>
        </motion.div>

      </motion.div>

      {/* Kinetic Typography: overlapping images */}
      <motion.div className="absolute inset-0 z-25 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        <motion.div
          style={{ opacity: t3Opacity, x: t3X, scale: t3Scale, z: t3Z }}
          className="absolute left-[4%] top-[32%] w-[92vw] text-white/90 mix-blend-lighten"
        >
          <div className="font-display text-[16vw] md:text-[18vw] font-black leading-none tracking-tight uppercase text-white/95 drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]">
            ONE MAZE
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: t4Opacity, y: t4Y, scale: t4Scale, z: t4Z }}
          className="absolute right-[4%] top-[58%] w-[92vw] text-white/85 mix-blend-screen text-right"
        >
          <div className="font-display text-[12vw] md:text-[14vw] font-black leading-none tracking-tight uppercase text-[var(--electric)] drop-shadow-[0_0_25px_rgba(0,255,170,0.35)]">
            48 HOURS
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: t5Opacity, x: t5X, scale: t5Scale, z: t5Z }}
          className="absolute left-[6%] top-[8%] w-[92vw] text-white/95 mix-blend-screen"
        >
          <div className="font-display text-[12vw] md:text-[14vw] font-black leading-none tracking-tight uppercase text-white/95">
            THE FUTURE
          </div>
          <div className="font-display text-[12vw] md:text-[14vw] font-black leading-none tracking-tight uppercase text-[var(--electric)] drop-shadow-[0_0_25px_rgba(0,255,170,0.35)]">
            OF ROBOTICS
          </div>
        </motion.div>
      </motion.div>

     
      {/* Sci-fi Overlay Scope */}
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center opacity-30">
        <div className="w-[80vw] h-[80vh] border-[1px] border-[var(--electric)]/30 rounded-full relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-10 bg-[var(--electric)]" />
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-10 bg-[var(--electric)]" />
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-[2px] bg-[var(--electric)]" />
           <div className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-[2px] bg-[var(--electric)]" />
        </div>
      </div>

      {/* HUGE STATS OVERLAY OVER PICS */}
      {/* <motion.div 
        className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center pt-10"
        style={{ opacity: useTransform(progress, [0.8, 0.95], [0, 1]) }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-32 text-center drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] px-8">
          {STATS.map((s, i) => (
             <div key={i} className="flex flex-col items-center">
               <div className="font-display text-[clamp(60px,10vw,150px)] text-white font-bold leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mix-blend-screen">
                 <Counter to={s.value} suffix={s.suffix} />
               </div>
               <div className="font-bebas text-lg md:text-2xl text-[var(--electric)] tracking-[0.5em] mt-2 drop-shadow-[0_0_5px_rgba(0,255,170,0.8)]">
                 {s.label}
               </div>
             </div>
          ))}
        </div>
      </motion.div> */}
    </div>
  );
}

export default function AboutHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // We use Framer Motion's robust useScroll linked to the section's position in the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Start tracking when the top of the section hits the top of the viewport
    // End tracking when the bottom of the section hits the bottom of the viewport
    offset: ["start start", "end end"],
  });

  // Custom mapping for horizontal scroll: stalling at -100vw so Panel8 fits precisely
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0vw", "-100vw", "-100vw"]
  );

  // We keep a spring strictly for the visual progress bar and panel inner animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{ height: SECTION_HEIGHT }}
    >
      {/* Sticky viewport — locks to screen while parent scrolls */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden bg-zinc-50">
        {/* Horizontal track — explicitly to contain all 2 panels */}
        <motion.div
          ref={trackRef}
          style={{ x, width: `${PANEL_COUNT * 100}vw` }}
          className="flex flex-nowrap h-screen will-change-transform"
        >
          <Panel1 progress={smoothProgress} />
          <Panel8 progress={smoothProgress} />
          </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-zinc-200 z-50 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-zinc-900 origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        {/* Panel indicator */}
        <div className="absolute bottom-6 right-8 font-bebas text-[10px] tracking-[0.4em] text-zinc-400 z-50">
          ABOUT · POLYMAZE
        </div>
      </div>
    </section>
  );
}
