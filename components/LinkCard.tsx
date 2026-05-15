import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export default function LinkCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <a href={href} className="flex min-h-[86px] items-center gap-4 rounded-[14px] border border-fuku-border bg-white p-4">
      {icon ? (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-fuku-light text-fuku-red">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-black text-fuku-black">{title}</span>
        <span className="mt-1 block text-[11px] font-bold leading-relaxed text-fuku-gray">
          {description}
        </span>
      </span>
      <ArrowRight size={18} className="shrink-0" />
    </a>
  );
}
