import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
      question: "Am I allowed to participate alone?",
      answer:
        "Absolutely, the choice is yours! If you want to have complete freedom in designing and building your robot based on your own vision, POLYMAZE offers participation options for both soloists and teams.",
    },
    {
      question: "What is the maximum number of participants allowed in a team?",
      answer:
        "A team can have a maximum of 4 people. This size helps the team communicate and collaborate better in order to build and design a proper robot.",
    },
    {
      question: "Do all team members need to fill the form?",
      answer:
        "Yes, each member must fill out the form. Only one creates the team; others join by entering the exact Team Code.",
    },
    {
      question: "Are there any pre-competition workshops scheduled?",
      answer:
        "We are pleased to confirm that we offer workshops for POLYMAZE participants, and it is going to be led by skilled trainers.",
    },
    {
      question:
        "How can I find out if I've been accepted to compete in POLYMAZE?",
      answer:
        "All POLYMAZE applicants are going to receive an email about their acceptance status after the registration form closes.",
    },
  
];

function FAQItem({ question, answer }: { index: number; question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-12 group focus:outline-none"
      >
        <motion.span 
          animate={{ scale: isOpen ? 1.02 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`font-display text-[clamp(24px,4vw,56px)] tracking-tight leading-[0.9] text-left transition-colors duration-500 origin-left ${isOpen ? "text-[var(--cyan-neon)]" : "text-zinc-900 group-hover:text-zinc-400"}`}
        >
          {question}
        </motion.span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 ml-8 flex items-center justify-center w-14 h-14 rounded-full border border-zinc-200 group-hover:border-zinc-400 transition-colors"
        >
          <span className="text-2xl font-light text-zinc-900">＋</span>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-12 max-w-2xl font-mono text-[13px] leading-relaxed text-zinc-500 uppercase tracking-[0.1em]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-white py-32 lg:py-56 z-10">
      {/* Background grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* LEFT: Sticky Title */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-40">
              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="font-bebas tracking-[0.4em] text-xs text-zinc-400 mb-8 uppercase flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-zinc-300" />
                  Essential Information
                </div>
                <h2 className="font-display text-[clamp(100px,16vw,240px)] leading-[0.8] tracking-tight text-zinc-900">
                  FAQ<span className="text-[var(--cyan-neon)]">.</span>
                </h2>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Questions */}
          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border-t border-zinc-200">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FAQItem index={i} question={faq.question} answer={faq.answer} />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
