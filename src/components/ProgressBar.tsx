interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const safeTotal = Math.max(totalSteps, 1);
  const activeStep = Math.min(currentStep, safeTotal - 1);
  const percent = (activeStep / (safeTotal - 1 || 1)) * 100;

  return (
    <div className="w-full max-w-3xl mb-8">
      <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
        <div
          className="h-full bg-[var(--cyan-neon)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-900">
        {Array.from({ length: safeTotal }).map((_, index) => (
          <span
            key={`step-${index}`}
            className={index <= activeStep ? "text-zinc-900" : "text-zinc-400"}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
