import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-white text-zinc-900 border-t border-zinc-200 overflow-hidden z-50">
      {/* Marquee Banner */}
      <div className="border-b border-zinc-900 overflow-hidden py-3">
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-bebas tracking-[0.4em] text-xs px-8">
              POLYMAZE 2026 · ALGIERS · ROBOTICS WORLD CHAMPIONSHIP · TICKETS NOW LIVE ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid-lines w-full h-full px-8 py-12 lg:px-20 lg:py-14 flex flex-col lg:justify-between">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .2, duration: .6, ease: "easeOut" }}
        >
          <div className="flex flex-col items-start gap-2">
            <p className="font-display uppercase text-zinc-900 text-[30px] lg:text-[60px]">WHO ARE WE</p>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center mt-4 lg:mt-6 gap-6 lg:gap-20">
            {/* If VIC logo is white by default, it might need invert filter to show on white bg depending on the image */}
            <img src="/vic.png" className="w-[117px] h-[47px] lg:w-[213px] lg:h-[86px] object-contain " alt="VIC Logo" />

            <div className="h-[250px] w-px bg-zinc-300 hidden lg:inline" />
            <div className="w-[250px] h-px bg-zinc-300 lg:hidden" />

            <div className="flex flex-col gap-2 lg:gap-0">
              <p className="text-[18px] lg:text-[40px] font-display text-zinc-900">VISION & INNOVATION CLUB</p>
              <p className="text-[10px] lg:text-[20px] font-display text-zinc-600 lg:max-w-[650px]">
                {` A scientific club founded in 2014 at the National Polytechnic School of Algiers under the supervision of the scientific and cultural association "EL–MAARIFA", which aims to foster creativity, communication, and innovation among students.
               `}
              </p>
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 mt-4 lg:mt-4">
                <p className="uppercase text-[12px] lg:text-[22px] font-display text-zinc-900"> <span className="font-display text-[20px] lg:text-[35px] mr-2 text-[var(--electric)]">10+</span> Major Events</p>
                <div className="w-[100px] h-px bg-[var(--electric)] lg:hidden" />
                <p className="uppercase text-[12px] lg:text-[22px] font-display text-zinc-900"> <span className="font-display text-[20px] lg:text-[35px] mr-2 text-[color:var(--electric)]">200+</span> Active Members</p>
                <div className="w-[100px] h-px bg-zinc-300 lg:hidden" />
              </div>
            </div>

          </div>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: .2, duration: .6, ease: "easeOut" }}
        >
          <div className="w-full pt-10 lg:pt-16">
            <div className="h-px w-full bg-zinc-300 lg:mb-8" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16 mb-8 mt-4 lg:mt-0 lg:mb-12">
              <div className="flex gap-10 lg:justify-start lg:gap-20">
                <div className="flex flex-col gap-1 lg:gap-2 uppercase font-bebas tracking-widest text-zinc-500 font-medium text-[10px] lg:text-[14px]">
                  <a href="https://www.enp.edu.dz/en/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[var(--electric)] transition-colors">NATIONAL POLYTECHNIC SCHOOL</a>
                  <a href="mailto:vic@g.enp.edu.dz" className="cursor-pointer hover:text-[var(--electric)] transition-colors">vic@g.enp.edu.dz</a>
                </div>
                <div className="flex flex-col gap-1 lg:gap-2 uppercase font-bebas tracking-widest text-zinc-500 font-medium text-[10px] lg:text-[14px]">
                  <button className="cursor-pointer hover:text-[var(--electric)] transition-colors text-left">WHAT IS POLYMAZE</button>
                  <button className="cursor-pointer hover:text-[var(--electric)] transition-colors text-left">ABOUT US</button>
                </div>
                <div className="flex flex-col gap-1 lg:gap-2 uppercase font-bebas tracking-widest text-zinc-500 font-medium text-[10px] lg:text-[14px]">
                  <a href="https://www.facebook.com/vic.enpa" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[var(--electric)] transition-colors">FACEBOOK</a>
                  <a href="https://www.instagram.com/vic.enp/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[var(--electric)] transition-colors">INSTAGRAM</a>
                  <a href="https://www.linkedin.com/company/vicenp/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[var(--electric)] transition-colors">LINKEDIN</a>
                  <a href="https://www.tiktok.com/@vic.enp" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[var(--electric)] transition-colors">TIKTOK</a>
                </div>
              </div>
              
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: .2, duration: .6, ease: "easeOut" }}
                className="w-full flex justify-center lg:justify-end"
              >
                <img
                  src="/plmz.png"
                  alt="Polymaze"
                  className="mt-1 w-[70vw] max-w-[70vw] lg:w-[320px] lg:max-w-[320px] h-auto object-contain"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
