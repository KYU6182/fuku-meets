import { ArrowRight, LucideIcon } from "lucide-react";

type ActionCardProps = {
  title: string;
  caption: string;
  icon: LucideIcon;
  href: string;
};

export default function ActionCard({ title, caption, icon: Icon, href }: ActionCardProps) {
  return (
    <a
      href={href}
      className="flex min-h-[72px] flex-col justify-between rounded-[8px] border border-fuku-border bg-white p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <Icon size={18} className="text-fuku-red" strokeWidth={2.3} />
        <ArrowRight size={14} className="text-fuku-black" />
      </div>
      <div>
        <p className="text-[12px] font-black tracking-wide text-fuku-black">{title}</p>
        <p className="mt-1 text-[10px] font-bold leading-snug text-fuku-gray">{caption}</p>
      </div>
    </a>
  );
}
