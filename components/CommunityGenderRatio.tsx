export default function CommunityGenderRatio({ maleRatio, femaleRatio, size = 74 }: { maleRatio: number; femaleRatio: number; size?: number }) {
  const gradient = `conic-gradient(#2f7dd1 0 ${maleRatio}%, #e83b75 ${maleRatio}% 100%)`;
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-1 text-[10px] font-black text-fuku-black">男女比</p>
      <div className="grid place-items-center rounded-full" style={{ width: size, height: size, background: gradient }}>
        <div className="h-[54%] w-[54%] rounded-full bg-white" />
      </div>
      <div className="mt-1 flex gap-2 text-[11px] font-black leading-none">
        <span className="text-[#2f7dd1]">{maleRatio}%<br />男性</span>
        <span className="text-[#e83b75]">{femaleRatio}%<br />女性</span>
      </div>
    </div>
  );
}
