type AdminFormFieldProps = {
  label: string;
  type?: "text" | "textarea" | "select" | "file" | "date" | "number";
  placeholder?: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  testId?: string;
};

export default function AdminFormField({ label, type = "text", placeholder, options = [], value, onChange, testId }: AdminFormFieldProps) {
  return (
    <label className="block">
      <span className="text-[12px] font-black text-fuku-black">{label}</span>
      {type === "textarea" ? (
        <textarea data-testid={testId} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="mt-2 min-h-[128px] w-full rounded-[10px] border border-fuku-border px-3 py-3 text-[14px] outline-none focus:border-fuku-red" />
      ) : type === "select" ? (
        <select data-testid={testId} value={value} onChange={(event) => onChange?.(event.target.value)} className="mt-2 h-11 w-full rounded-[10px] border border-fuku-border px-3 text-[14px] outline-none focus:border-fuku-red">
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : type === "file" ? (
        <div data-testid={testId} className="mt-2 rounded-[10px] border border-dashed border-fuku-border bg-fuku-light p-5 text-center text-[12px] font-bold text-fuku-gray">
          jpg / png / webp のみ、SVG禁止、5MB以下
        </div>
      ) : (
        <input data-testid={testId} type={type} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} className="mt-2 h-11 w-full rounded-[10px] border border-fuku-border px-3 text-[14px] outline-none focus:border-fuku-red" />
      )}
    </label>
  );
}
