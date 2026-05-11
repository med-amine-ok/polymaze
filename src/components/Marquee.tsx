import { motion } from "framer-motion";

const ITEMS = ["POLYMAZE 2026", "ALGIERS", "ROBOTICS", "VIC", "JUNE ", "24 TEAMS", "24 ROBOTS"];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-zinc-900 bg-white py-6">
      <div className="marquee-track" style={{ animationDirection: reverse ? "reverse" : "normal" }}>
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-10 pr-10">
            <span className="font-display text-[clamp(40px,7vw,110px)] leading-none">{t}</span>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="inline-block text-[color:var(--electric)] font-display text-[clamp(40px,7vw,110px)]"
            >
              ✺
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
