import { Link } from "@tanstack/react-router";

import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const MENU_ITEMS = [
  { label: "ABOUT", id: "about", image: "/pics/1.webp" },
  // { label: "STATS", id: "stats", image: "/pics/2.webp" },
  // { label: "DESTINATION", id: "destination", image: "/pics/3.webp" },
  { label: "FAQ", id: "faq", image: "/pics/4.webp" },
  { label: "VIC", id: "contact", image: "/pics/5.webp" },
];

function FullscreenMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // When menu opens, block body scroll.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
          className="fixed inset-0 z-[90] bg-white text-zinc-900 overflow-hidden flex flex-col"
        >
          {/* Cinematic Image Backgrounds */}
          {MENU_ITEMS.map((item, i) => (
            <motion.img
              key={i}
              src={item.image}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: hoveredIndex === i ? 0.6 : (hoveredIndex === null && i === 0 ? 0.2 : 0),
                scale: hoveredIndex === i ? 1 : 1.05 
              }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-luminosity"
            />
          ))}

          {/* Grid lines and Noise Texture */}
          <div className="absolute inset-0 noise mix-blend-multiply pointer-events-none opacity-40" />
          <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

          {/* Massive Background Text */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] font-black text-zinc-200 whitespace-nowrap pointer-events-none mix-blend-multiply opacity-50 tracking-tighter"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {hoveredIndex !== null ? MENU_ITEMS[hoveredIndex].label : "POLYMAZE"}
          </motion.div>

          <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 w-full h-full mt-15">
            {MENU_ITEMS.map((item, i) => (
              <div key={item.id} className="overflow-hidden py-1 md:py-2 w-full flex justify-center">
                <motion.a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }, 800); // Wait for menu to close
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ y: "120%", rotate: 4 }}
                  animate={{ y: "0%", rotate: 0 }}
                  exit={{ y: "120%", rotate: -4 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.1 + (i * 0.05), 
                    ease: [0.77, 0, 0.18, 1] 
                  }}
                  className="group relative block font-display  uppercase leading-[0.8] tracking-tighter text-[12vw] md:text-[8vw] cursor-pointer hover:text-[var(--electric)] transition-colors duration-500"
                >
                  <motion.span
                    className="inline-block relative z-10"
                    animate={{ x: hoveredIndex === i ? 20 : 0 }}
                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {item.label}
                  </motion.span>
                  <motion.span 
                    className="absolute left-0 bottom-[10%] h-[4px] md:h-[8px] bg-[var(--electric)] z-[-1]"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredIndex === i ? "100%" : 0 }}
                    transition={{ duration: 0.5, ease: [0.77, 0, 0.18, 1] }}
                  />
                </motion.a>
              </div>
            ))}
          </div>

          {/* Footer of the menu */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-center text-zinc-900 font-bebas tracking-widest text-sm z-10"
          >
            <span>POLYMAZE</span>
            <span>VIC</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Height and Background transitions
  const height = useTransform(scrollY, [0, 100], ["80px", "64px"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.85]);

  const bgLight = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;
  const bgDark = useMotionTemplate`rgba(9, 9, 11, ${bgOpacity})`;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.77, 0, 0.18, 1] }}
        style={{ 
          height, 
          backdropFilter: isMenuOpen ? "none" : blur,
          backgroundColor: isMenuOpen ? "transparent" : (isDark ? bgDark : bgLight),
          borderColor: "rgba(255,255,255,0.1)" 
        }}
        className={`fixed top-0 inset-x-0 z-[100] border-b transition-colors duration-700 text-zinc-900`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--cyan-neon)] to-transparent" />
          <div className="absolute top-0 right-10 w-[1px] h-full bg-[var(--cyan-neon)] animate-pulse" />
        </div>

        <div className="h-full mx-auto max-w-[1600px] px-8 flex items-center justify-between gap-6">
          {/* Left spacer for centering logo */}
          <div className="flex-1 hidden md:block" />

          {/* Center docking zone */}
          <div id="logo-dock" className="relative flex-none w-[180px] h-full flex items-center justify-start md:justify-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
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

          {/* Menu Button */}
          <div className="flex-1 flex items-center justify-end gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full border border-[var(--electric)] px-4 py-2 text-xs font-bebas tracking-widest text-zinc-900 transition-all hover:bg-[var(--electric)] hover:text-white md:px-5 md:text-sm"
              >
                REGISTER
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="font-bebas tracking-widest text-lg md:text-xl flex items-center gap-2.5 p-4 -mr-4 transition-all hover:text-[var(--electric)] relative z-[101] cursor-pointer"
              >
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isMenuOpen ? 'bg-[var(--electric)]' : 'bg-[var(--cyan-neon)]'}`} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center gap-2"
                >
                  {isMenuOpen ? <X size={22} className="stroke-[2.5]" /> : <Menu size={22} className="stroke-[2.5]" />}
                  <span>{isMenuOpen ? "CLOSE" : "MENU"}</span>
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
