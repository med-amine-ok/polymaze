import React from "react";

interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  variant?: "white";
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  variant = "white",
}) => {
  return (
    <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${checked ? "bg-zinc-900" : "border-2 border-zinc-400"}`}
        />
      </div>
      <span className="text-zinc-900 text-xs sm:text-base tracking-[0.03em] uppercase">
        {label}
      </span>
    </label>
  );
};

export default RadioButton;
