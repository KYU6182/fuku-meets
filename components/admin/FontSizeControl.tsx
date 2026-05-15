"use client";

type Size = "sm" | "md" | "lg" | "xl";

export default function FontSizeControl<T extends Size>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (value: T) => void }) {
  return (
    <div>
      <p className="text-[12px] font-black text-fuku-black">{label}</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`min-h-[38px] rounded-full border text-[12px] font-black uppercase ${value === option ? "border-fuku-red bg-fuku-red text-white" : "border-fuku-border bg-white text-fuku-black"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
