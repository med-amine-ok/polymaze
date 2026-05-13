import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  className?: string;
}

export default function FormInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className,
}: FormInputProps) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-white mb-2 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-neon)] focus:border-transparent",
          className,
        )}
      />
    </div>
  );
}
