import type { ReactNode } from "react";

export default function AdminCard({
  title,
  value,
  caption,
  children,
}: {
  title: string;
  value?: string | number;
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-[14px] border border-fuku-border bg-white p-5 shadow-sm">
      <p className="text-[12px] font-black text-fuku-gray">{title}</p>
      {value !== undefined ? <p className="mt-2 text-[28px] font-black text-fuku-black">{value}</p> : null}
      {caption ? <p className="mt-1 text-[12px] font-bold text-fuku-gray">{caption}</p> : null}
      {children}
    </section>
  );
}
