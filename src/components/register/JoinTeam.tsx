"use client";

import { Input } from "@/components/ui/input";

export interface JoinTeamProps {
  code: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function JoinTeam({ code, onChange }: JoinTeamProps) {
  return (
    <div className="mb-6">
      <label htmlFor="code" className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
        Team Code <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        id="code"
        name="code"
        value={code}
        onChange={onChange}
        placeholder="Enter the team Code to join"
        required
        className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-neon)] focus:border-transparent"
      />
      <p className="text-zinc-900 text-xs mt-2 tracking-[0.02em]">
        Enter the team code provided by your team leader
      </p>
    </div>
  );
}
