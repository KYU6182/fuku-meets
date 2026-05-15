type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  href?: string;
  className?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  href = "/",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-5 flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="headline-condensed text-[34px] uppercase leading-none text-fuku-black">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-[13px] font-semibold leading-relaxed tracking-wide text-fuku-black">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actionLabel ? (
        <a
          href={href}
          className="mt-2 shrink-0 text-[11px] font-bold tracking-wide text-fuku-black"
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
