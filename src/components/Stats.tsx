import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const STATS = [
  { value: 32, label: "TEAMS", suffix: "" },
  { value: 24, label: "ROBOTS", suffix: "" },
  { value: 48, label: "HOURS", suffix: "H" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { stiffness: 60, damping: 20 });
  const txt = useTransform(sv, (v) => Math.round(v).toString() + suffix);
  useEffect(() => { if (inView) mv.set(to); }, [inView, mv, to]);
  return <motion.span ref={ref}>{txt}</motion.span>;
}

export default function Stats() {
  return (
    <section id="stats" className="relative bg-white py-32 border-t border-zinc-200">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="flex items-end justify-between mb-16">
          <h2 className="font-display text-[clamp(40px,6vw,96px)] leading-[0.9]">
            BY THE<br/>NUMBERS<span className="text-[color:var(--electric)]">.</span>
          </h2>
          <div className="hidden md:block font-bebas text-xs tracking-[0.3em] text-zinc-500 max-w-xs">
            A SINGLE WEEK. ONE ARENA. THE WORLD'S MOST AMBITIOUS ROBOTICS COMPETITION.
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-14 border-t border-zinc-900">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.77, 0, 0.18, 1] }}
              className="pt-6 border-t border-zinc-900 first:border-t-0 md:border-t-0"
            >
              <div className="font-display text-[clamp(64px,9vw,180px)] leading-[0.85]">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 font-bebas tracking-[0.3em] text-xs text-zinc-500">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
