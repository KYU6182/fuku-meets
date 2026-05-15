type PageHeroProps = {
  title: string;
  eyebrow?: string;
  copy: string;
  description?: string;
};

export default function PageHero({ title, eyebrow, copy, description }: PageHeroProps) {
  return (
    <section className="border-b border-fuku-border bg-white px-5 py-8">
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-fuku-red">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="headline-condensed text-[54px] uppercase leading-[0.88] text-fuku-black">
        {title}
      </h1>
      <p className="mt-4 text-[16px] font-black leading-relaxed text-fuku-black">{copy}</p>
      {description ? (
        <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">{description}</p>
      ) : null}
    </section>
  );
}
