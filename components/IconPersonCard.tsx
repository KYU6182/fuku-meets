type IconPersonCardProps = {
  rank: number;
  image: string;
  name: string;
  genre: string;
  votes: string;
  slug?: string;
};

export default function IconPersonCard({
  rank,
  image,
  name,
  genre,
  votes,
  slug,
}: IconPersonCardProps) {
  return (
    <a
      href={`/icons/${slug ?? name.toLowerCase()}`}
      className="relative flex min-w-0 flex-1 flex-col items-center text-center"
    >
      <span
        className={`absolute left-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-[4px] text-[12px] font-black text-white ${
          rank === 1 ? "bg-[#ffc400]" : rank === 2 ? "bg-[#b8b8b8]" : "bg-[#cf8a53]"
        }`}
      >
        {rank}
      </span>
      <div
        className="h-[92px] w-[92px] rounded-full border border-fuku-border bg-fuku-light bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(242,238,232,0.1), rgba(17,17,17,0.08)), url('${image}')`,
        }}
      />
      <h3 className="mt-3 text-[13px] font-black uppercase tracking-wide text-fuku-black">
        {name}
      </h3>
      <p className="mt-1 text-[10px] font-bold text-fuku-gray">{genre}</p>
      <p className="mt-2 text-[11px] font-black tracking-wide text-fuku-black">{votes}</p>
    </a>
  );
}
