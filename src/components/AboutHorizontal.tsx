import { motion, useScroll, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useEffect, useMemo, useState } from "react";

import ModelViewer from "./ModelViewer";

/* ─── helpers ─── */
const PANEL_COUNT = 7;
const SECTION_HEIGHT = "1200vh"; // Increased total height for slower scrolling



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

/* ─── Code Rain ─── */
function TechLabelsOverlay() {
  const [hovered, setHovered] = useState<string | null>(null);

  const callouts = [
    {
      id: "arduino",
      label: "ARDUINO NANO",
      path: "M 42 50 L 25 50 L 25 35",
      anchor: { cx: 42, cy: 50 },
      textPos: { top: "35%", right: "75%" },
    },
    {
      id: "ultrasonic",
      label: "ULTRASONIC SENSOR",
      path: "M 55 40 L 75 40 L 75 30",
      anchor: { cx: 55, cy: 40 },
      textPos: { top: "30%", left: "75%" },
    },
    {
      id: "ir",
      label: "IR SENSOR ARRAY",
      path: "M 43 65 L 25 65 L 25 80 L 10 80",
      anchor: { cx: 43, cy: 65 },
      textPos: { top: "80%", right: "75%" },
    },
    {
      id: "motor",
      label: "L298N MOTOR DRIVER",
      path: "M 58 60 L 80 60 L 80 85 L 95 85",
      anchor: { cx: 58, cy: 60 },
      textPos: { top: "85%", left: "80%" },
    }
  ];

  return (
    <div className="absolute inset-[-10%] pointer-events-none z-20">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {callouts.map((c, i) => {
          const isHovered = hovered === c.id;
          return (
            <g key={c.id} style={{ filter: "url(#neon-glow)" }}>
              {/* Animated Line */}
              <motion.path
                d={c.path}
                fill="none"
                stroke={isHovered ? "var(--electric)" : "rgba(0, 0, 0, 0.4)"}
                strokeWidth="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.3, ease: "easeInOut" }}
              />
              {/* Traveling pulse */}
              <motion.path
                d={c.path}
                fill="none"
                stroke="white"
                strokeWidth="0.4"
                strokeDasharray="2 100"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 2 + i * 0.5, ease: "linear" }}
                style={{ opacity: 0.8 }}
              />
              {/* Anchor Dot */}
              <motion.circle
                cx={c.anchor.cx}
                cy={c.anchor.cy}
                r="0.6"
                fill={isHovered ? "white" : "var(--electric)"}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.3 }}
              />
              {/* Ping animation on anchor */}
              <motion.circle
                cx={c.anchor.cx}
                cy={c.anchor.cy}
                r="0.6"
                fill="none"
                stroke="var(--electric)"
                strokeWidth="0.1"
                animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML Labels */}
      {callouts.map((c, i) => {
        const isHovered = hovered === c.id;
        return (
          <motion.div
            key={`text-${c.id}`}
            className="absolute font-mono text-[10px] tracking-[0.2em] pointer-events-auto cursor-crosshair transition-all duration-300"
            style={{
              ...c.textPos,
              color: isHovered ? "white" : "var(--electric)",
              textShadow: isHovered ? "0 0 8px var(--electric)" : "0 0 4px rgba(0,255,170,0.4)",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.9, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.5 + i * 0.3 }}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={`flex flex-col ${c.textPos.right ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-2">
                {c.textPos.right && <div className="w-[1px] h-3 bg-[var(--electric)] opacity-50" />}
                <span className="font-bebas text-[14px] tracking-[0.3em]">{c.label}</span>
                {!c.textPos.right && <div className="w-[1px] h-3 bg-[var(--electric)] opacity-50" />}
              </div>
              <div className="text-[8px] text-zinc-500 opacity-80 mt-1">SYS.OP.{c.id.toUpperCase()}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
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
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden">
      <GridBg progress={progress} />
      <Particles count={20} />
      <MazeSVG progress={progress} />
      <div className="relative z-10 text-center px-8">
        <div className="font-display text-[clamp(60px,14vw,220px)] leading-[0.85] tracking-tight text-zinc-900">
          <WordReveal text="WHAT IS" />
        </div>
        <div className="mt-6 font-display text-[clamp(20px,3.5vw,52px)] leading-[1.1] tracking-tight text-zinc-700 max-w-[900px] mx-auto">
          <WordReveal text="POLYMAZE" />
        </div>
        <motion.div
          className="mt-10 w-[60px] h-[2px] bg-zinc-900 mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </div>
    </div>
  );
}

function Panel2({ progress }: { progress: any }) {
  const scale = useTransform(progress, [0.04, 0.12], [0.6, 1]);
  const bgX = useTransform(progress, [0.04, 0.12], [0, -100]);
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden">
      <Particles count={15} />
      {/* Maze lines behind */}
      <div className="absolute inset-0 opacity-[0.06]">
        <MazeSVG progress={progress} />
      </div>
      <motion.div style={{ scale }} className="relative z-10">
        <motion.div
          className="font-display text-[clamp(100px,22vw,360px)] leading-[0.8] tracking-tighter text-center"
          style={{
            backgroundImage: "linear-gradient(135deg, #18181b 0%, var(--electric) 50%, #18181b 100%)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <motion.span
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage: "linear-gradient(135deg, #18181b 0%, var(--electric) 50%, #18181b 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            THIS IS NOT JUST A ROBOTICS EVENT
          </motion.span>
        </motion.div>
        <motion.p
          className="text-center font-bebas tracking-[0.5em] text-xs text-zinc-500 mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          WHERE INTELLIGENCE MEETS THE MAZE
        </motion.p>
      </motion.div>
    </div>
  );
}
function Panel7({ progress }: { progress: any }) {
  const mazeScale = useTransform(progress, [0.12, 0.20], [0.7, 1.1]);
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Dark panel for contrast */}
      <motion.div style={{ scale: mazeScale }} className="absolute inset-0">
        <MazeSVG progress={progress} glow />
      </motion.div>
      {/* Radar */}
      <div className="absolute top-[15%] right-[10%] opacity-30">
        <RadarPulse />
      </div>
      <ScanLine />
      <Particles count={25} />
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        <motion.div
          className="font-display text-[clamp(40px,10vw,140px)] leading-[0.85] text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <WordReveal text="THE CHALLENGE" className="text-white" />
        </motion.div>
        <motion.div
          className="mt-8 w-[80px] h-[2px] bg-[var(--electric)] mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
        <motion.p
          className="mt-8 text-base md:text-xl lg:text-2xl text-zinc-300 leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <strong className="text-white font-normal">POLYMAZE</strong> is a maze-solving competition hosted by the Vision & Innovation Club. Designed robots rely on their programming and sensors to independently navigate the maze, showcasing impressive robotic abilities.
        </motion.p>
      </div>
    </div>
  );
}
function Panel3({ progress }: { progress: any }) {
  const imgY = useTransform(progress, [0.20, 0.28], [60, -60]);
  const imgScale = useTransform(progress, [0.20, 0.28], [0.9, 1.05]);
  const overlayOp = useTransform(progress, [0.22, 0.28], [0, 0.7]);
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden">
      <ScanLine />
      {/* Robot visual area */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="relative w-[70vw] max-w-[700px] aspect-square">
        {/* Blueprint grid */}
        <div className="absolute inset-[-20%] grid-lines opacity-10" />
        {/* Robot placeholder — large geometric shape */}
        <div className="absolute inset-0 flex items-center justify-center scale-[0.9] translate-y-20">
          <ModelViewer />
        </div>
        {/* Technical labels overlay */}
        <TechLabelsOverlay />
      </motion.div>
      {/* Corner labels */}
      <div className="absolute top-8 left-8 font-bebas text-[12px] tracking-[0.4em] text-[var(--electric)] font-bold drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
        MICROMOUSE · ROBOTICS
      </div>
      <div className="absolute bottom-8 right-8 font-bebas text-[12px] tracking-[0.4em] text-[var(--electric)] font-bold drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
        MAZE SOLVER · COMPONENT VIEW
      </div>
      <style>{`
        .clip-robot {
          clip-path: polygon(30% 0%, 70% 0%, 85% 15%, 85% 45%, 100% 55%, 100% 75%, 80% 100%, 20% 100%, 0% 75%, 0% 55%, 15% 45%, 15% 15%);
        }
      `}</style>
    </div>
  );
}

function Panel4({ progress }: { progress: any }) {
  const mazeScale = useTransform(progress, [0.28, 0.36], [0.7, 1.1]);
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Dark panel for contrast */}
      <motion.div style={{ scale: mazeScale }} className="absolute inset-0">
        <MazeSVG progress={progress} glow />
      </motion.div>
      {/* Radar */}
      <div className="absolute top-[15%] right-[10%] opacity-30">
        <RadarPulse />
      </div>
      <ScanLine />
      <Particles count={25} />
      <div className="relative z-10 text-center px-8">
        <motion.div
          className="font-display text-[clamp(50px,12vw,180px)] leading-[0.85] text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <WordReveal text="SOLVE THE IMPOSSIBLE" className="text-white" />
        </motion.div>
        <motion.div
          className="mt-8 w-[80px] h-[2px] bg-[var(--electric)] mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
        <motion.p
          className="mt-6 font-bebas tracking-[0.4em] text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          NAVIGATE · ADAPT · CONQUER
        </motion.p>
      </div>
    </div>
  );
}

function Panel8({ progress }: { progress: any }) {
  // Each picture appears one by one, dropping in from close to the camera (Z=1000)
  // and settling into its final collage position. They stay fully visible (opacity 1) once placed.
  const zVals = Array.from({ length: 12 }, (_, i) => {
    const start = 0.45 + i * 0.03;
    return useTransform(progress, [start, start + 0.04], [1000, i * 15]);
  });
  
  const yVals = Array.from({ length: 12 }, (_, i) => {
    const start = 0.45 + i * 0.03;
    // Drop in from slightly above
    return useTransform(progress, [start, start + 0.04], [-200, 0]);
  });
  
  const opVals = Array.from({ length: 12 }, (_, i) => {
    const start = 0.45 + i * 0.03;
    return useTransform(progress, [start, start + 0.04], [0, 1]);
  });

  const rotVals = Array.from({ length: 12 }, (_, i) => {
    const start = 0.45 + i * 0.03;
    // Dynamic twisting as they land
    return useTransform(progress, [start, start + 0.04], [i % 2 === 0 ? -15 : 15, 0]);
  });

  const scaleVals = Array.from({ length: 12 }, (_, i) => {
    const start = 0.45 + i * 0.03;
    return useTransform(progress, [start, start + 0.04], [1.5, 1]);
  });

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

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Sequence from Original Assets */}
        <motion.div style={{ z: zVals[10], y: yVals[10], opacity: opVals[10], rotate: rotVals[10], scale: scaleVals[10] }} className="absolute w-[35vw] aspect-video top-[15%] left-[5%] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
          <img src="/pics/participate.webp" className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 text-[8px] font-mono text-[var(--electric)] uppercase bg-black/40 px-1">CAM_01 / EST_DIST_FAR</div>
        </motion.div>
        
        <motion.div style={{ z: zVals[1], y: yVals[1], opacity: opVals[1], rotate: rotVals[1], scale: scaleVals[1] }} className="absolute w-[45vw] aspect-[4/3] bottom-[15%] right-[5%] shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-[var(--electric)]/20">
          <div className="absolute inset-0 bg-[var(--electric)]/10 mix-blend-overlay z-10" />
          <img src="/pics/young.webp" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[var(--electric)] uppercase bg-black/50 px-1">SYS_OPT_02</div>
        </motion.div>
        
        <motion.div style={{ z: zVals[2], y: yVals[2], opacity: opVals[2], rotate: rotVals[2], scale: scaleVals[2] }} className="absolute w-[35vw] aspect-square top-[35%] left-[20%] shadow-[0_0_80px_rgba(0,0,0,1)] border border-white/20">
          <img src="/pics/robot.webp" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white tracking-widest bg-black/40 px-1">AUTONOMOUS ENGAGEMENT</div>
        </motion.div>
        
        <motion.div style={{ z: zVals[3], y: yVals[3], opacity: opVals[3], rotate: rotVals[3], scale: scaleVals[3] }} className="absolute w-[50vw] aspect-video top-[10%] right-[15%] shadow-[0_0_100px_rgba(0,0,0,1)] border border-[var(--electric)]/40">
          <img src="/pics/prepare.webp" className="w-full h-full object-cover mix-blend-luminosity" />
          <div className="absolute inset-0 border-[1px] border-[var(--electric)]/20 scale-[0.98]" />
        </motion.div>
        
        <motion.div style={{ z: zVals[4], y: yVals[4], opacity: opVals[4], rotate: rotVals[4], scale: scaleVals[4] }} className="absolute w-[80vw] aspect-video bottom-[20%] left-[10%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/30">
           <img src="/pics/your.webp" className="w-full h-full object-cover" />
           <div className="absolute top-4 left-4 text-xs font-bebas text-white tracking-[0.5em] bg-black/80 px-2 py-1 border border-white/20">PRE-CALCULATION</div>
        </motion.div>

        {/* Sequence from New Assets 1 - 7 */}
        <motion.div style={{ z: zVals[5], y: yVals[5], opacity: opVals[5], rotate: rotVals[5], scale: scaleVals[5] }} className="absolute w-[35vw] aspect-[4/3] top-[25%] right-[20%] shadow-[0_0_80px_rgba(0,0,0,1)] border border-white/20">
          <img src="/pics/1.webp" className="w-full h-full object-cover brightness-75" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[var(--electric)] uppercase bg-black/40 px-1">RECALIBRATE_01</div>
        </motion.div>

        <motion.div style={{ z: zVals[6], y: yVals[6], opacity: opVals[6], rotate: rotVals[6], scale: scaleVals[6] }} className="absolute w-[45vw] aspect-video bottom-[10%] left-[15%] shadow-[0_0_100px_rgba(0,0,0,1)] border border-[var(--electric)]/20">
          <div className="absolute inset-0 bg-[var(--electric)]/10 mix-blend-overlay z-10" />
          <img src="/pics/2.webp" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 text-[8px] font-mono text-[var(--electric)] uppercase bg-black/50 px-1">SYS_MEM_02</div>
        </motion.div>

        <motion.div style={{ z: zVals[7], y: yVals[7], opacity: opVals[7], rotate: rotVals[7], scale: scaleVals[7] }} className="absolute w-[30vw] aspect-[3/4] top-[10%] left-[10%] shadow-[0_0_120px_rgba(0,0,0,1)] border border-white/30">
          <img src="/pics/3.webp" className="w-full h-full object-cover mix-blend-luminosity" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white tracking-widest bg-black/50 px-1">ANALYTICS_ON</div>
        </motion.div>

        <motion.div style={{ z: zVals[8], y: yVals[8], opacity: opVals[8], rotate: rotVals[8], scale: scaleVals[8] }} className="absolute w-[50vw] aspect-video top-[40%] right-[5%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-[var(--electric)]/40">
          <img src="/pics/4.webp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-[1px] border-[var(--electric)]/20 scale-[0.98]" />
          <div className="absolute bottom-4 left-4 text-xs font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-white/20">SENSOR_SYNC</div>
        </motion.div>

        <motion.div style={{ z: zVals[11], y: yVals[11], opacity: opVals[11], rotate: rotVals[11], scale: scaleVals[11] }} className="absolute w-[60vw] aspect-[16/9] bottom-[20%] left-[20%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/30">
           <img src="/pics/5.webp" className="w-full h-full object-cover " />
           <div className="absolute top-4 left-4 text-xs font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-[var(--electric)]/30">DATA_LINK_ESTABLISHED</div>
        </motion.div>

        <motion.div style={{ z: zVals[0], y: yVals[0], opacity: opVals[0], rotate: rotVals[0], scale: scaleVals[0] }} className="absolute w-[55vw] aspect-video top-[15%] right-[15%] shadow-[0_0_150px_rgba(0,0,0,1)] border border-[var(--electric)]/30">
           <img src="/pics/6.webp" className="w-full h-full object-cover" />
           <div className="absolute bottom-4 right-4 text-xs font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-white/20">SYSTEM_OVERRIDE</div>
        </motion.div>

        <motion.div style={{ z: zVals[9], y: yVals[9], opacity: opVals[9], rotate: rotVals[9], scale: scaleVals[9] }} className="absolute w-[80vw] aspect-video bottom-[10%] left-[10%] shadow-[0_0_200px_rgba(0,0,0,1)] border border-[var(--electric)]">
           <div className="absolute inset-0 bg-[var(--electric)]/5 mix-blend-overlay z-10" />
           <img src="/pics/7.webp" className="w-full h-full object-cover" />
           <div className="absolute top-4 left-4 text-sm font-bebas text-[var(--electric)] tracking-[0.5em] bg-black/80 px-2 py-1 border border-[var(--electric)]">FINAL_RND_VIEW</div>
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
    </div>
  );
}

function Panel6({ progress }: { progress: any }) {
  const scale = useTransform(progress, [0.84, 1], [0.95, 1]);
  const bgOp = useTransform(progress, [0.84, 0.95], [0, 0.15]);
  return (
    <div className="relative flex-shrink-0 w-screen min-w-[100vw] h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Animated lights */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: bgOp }}
      >
        {[
          { x: "20%", y: "30%", size: 400, color: "var(--electric)" },
          { x: "80%", y: "60%", size: 300, color: "var(--cyan-neon)" },
          { x: "50%", y: "80%", size: 350, color: "var(--deep-red)" },
        ].map((light, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-[120px]"
            style={{
              left: light.x,
              top: light.y,
              width: light.size,
              height: light.size,
              background: light.color,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 1.5 }}
          />
        ))}
      </motion.div>
      <Particles count={35} />
      <ScanLine />
      <motion.div style={{ scale }} className="relative z-10 text-center px-8">
        <motion.div
          className="font-display text-[clamp(48px,11vw,170px)] leading-[0.85] text-white"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <WordReveal text="THE FUTURE OF ROBOTICS" className="text-white" />
        </motion.div>
        {/* Stats row */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-12 md:gap-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { val: "24", label: "TEAMS" },
            { val: "10", label: "COUNTRIES" },
            { val: "120", label: "ROBOTS" },
            { val: "72H", label: "NON-STOP" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-[clamp(32px,5vw,72px)] text-white leading-none">{s.val}</div>
              <div className="mt-2 font-bebas tracking-[0.4em] text-[10px] text-zinc-500">{s.label}</div>
            </div>
          ))}
        </motion.div>
        {/* Final CTA */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
        >
          <div className="font-display text-[clamp(28px,6vw,90px)] leading-[0.9] tracking-tight">
            <span className="text-white">POLYMAZE 2026</span>
            <span className="text-[var(--electric)]"> — </span>
            <span className="text-zinc-500">ALGIERS</span>
          </div>
          <div className="mt-4 font-bebas tracking-[0.5em] text-xs text-zinc-600">
            JUNE
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN HORIZONTAL SCROLL COMPONENT
   ═══════════════════════════════════════════════════ */

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

  // Custom mapping for horizontal scroll: stalling at -500vw so Panel8 fits precisely
  const x = useTransform(
    scrollYProgress,
    [0, 0.08, 0.16, 0.24, 0.32, 0.48, 0.84, 0.92, 1],
    ["0vw", "-100vw", "-200vw", "-300vw", "-400vw", "-500vw", "-500vw", "-600vw", "-600vw"]
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
        {/* Horizontal track — explicitly 600vw wide to contain all 6 panels */}
        <motion.div
          ref={trackRef}
          style={{ x, width: `${PANEL_COUNT * 100}vw` }}
          className="flex flex-nowrap h-screen will-change-transform"
        >
          <Panel1 progress={smoothProgress} />
          <Panel2 progress={smoothProgress} />
          <Panel7 progress={smoothProgress} />
          <Panel3 progress={smoothProgress} />
          <Panel4 progress={smoothProgress} />
          <Panel8 progress={smoothProgress} />
          <Panel6 progress={smoothProgress} />
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
