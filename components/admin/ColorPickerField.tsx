"use client";

const presets = ["#e52421", "#111111", "#ffffff", "#f7f4ef", "#fff1f1", "#666666"];

export default function ColorPickerField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="text-[12px] font-black text-fuku-black">{label}</label>
      <div className="mt-2 flex items-center gap-2">
        <input type="color" value={normalizeColor(value)} onChange={(event) => onChange(event.target.value)} className="h-11 w-12 rounded-[10px] border border-fuku-border bg-white p-1" />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-0 flex-1 rounded-[10px] border border-fuku-border px-3 text-[13px] font-bold outline-none focus:border-fuku-red" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((color) => (
          <button key={color} type="button" onClick={() => onChange(color)} className={`h-7 w-7 rounded-full border ${value === color ? "border-fuku-red ring-2 ring-fuku-red/20" : "border-fuku-border"}`} style={{ backgroundColor: color }} aria-label={`${color}を選択`} />
        ))}
      </div>
    </div>
  );
}

function normalizeColor(value: string) {
  return value.startsWith("#") && (value.length === 4 || value.length === 7) ? value : "#111111";
}
