import { motion } from "framer-motion";

interface StepProps {
  isActive: boolean;
  stepNumber: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  hideNavigation?: boolean;
  children: React.ReactNode;
}

export default function Step({
  isActive,
  stepNumber: _stepNumber,
  onNext,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  hideNavigation = false,
  children,
}: StepProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xl"
    >
      {children}

      {!hideNavigation && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {!isFirstStep && (
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-bebas tracking-widest text-zinc-900 transition hover:border-zinc-500"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-bebas tracking-widest text-white transition hover:bg-[var(--cyan-neon)]"
          >
            {isLastStep ? "Submit" : "Next"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
