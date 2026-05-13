"use client";
import { Input } from "@/components/ui/input";


export interface MemberInformationsDetailsProps {
  formData: {
    teamAction: string;
    teamId: string;
    teamName: string;
    teamMembers: string;
    membersCount: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    dob: string;
    university: string;
    fos: string;
    yos: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MemberInformationsDetails({
  formData,
  handleInputChange,
}: MemberInformationsDetailsProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 tracking-[0.06em] uppercase">
        Personal Details
      </h2>

      <FieldInput
        id="firstName"
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="Enter your first name"
        required
      />

      <FieldInput
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Enter your last name"
        required
      />

      <FieldInput
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email address"
        required
      />

      <FieldInput
        id="phone"
        name="phone"
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Enter your phone number"
        required
      />

      <FieldInput
        id="dob"
        name="dob"
        label="Date of Birth"
        type="date"
        value={formData.dob as string}
        onChange={handleInputChange}
        required
      />

      <FieldInput
        id="wilaya"
        name="wilaya"
        label="Wilaya"
        type="text"
        placeholder="Enter your Wilaya"
        value={formData.wilaya as string}
        onChange={handleInputChange}
        required
      />

      <FieldInput
        id="university"
        name="university"
        label="University"
        type="text"
        placeholder="Enter your University"
        value={formData.university as string}
        onChange={handleInputChange}
        required
      />
      <FieldInput
        id="fos"
        name="fos"
        label="Field of Study"
        type="text"
        value={formData.fos as string}
        onChange={handleInputChange}
        placeholder="Enter your Field of Study"
        required
      />

      <FieldInput
        id="yos"
        name="yos"
        label="Year of Study"
        placeholder="Enter the Year of Study"
        type="text"
        value={formData.yos as string}
        onChange={handleInputChange}
        required
      />
    </>
  );
}

const FieldInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
}) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs"
    >
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
      className="w-full bg-white text-zinc-900 border border-zinc-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-neon)] focus:border-transparent"
    />
  </div>
);
