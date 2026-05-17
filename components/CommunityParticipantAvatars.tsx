const avatarImages = ["/images/yui.jpg", "/images/rena.jpg", "/images/icons/haru.jpg", "/images/icons/kento.jpg"];

export default function CommunityParticipantAvatars({ count }: { count: number }) {
  return (
    <div className="flex items-center -space-x-2">
      {avatarImages.slice(0, Math.min(3, count)).map((image) => (
        <span
          key={image}
          className="h-7 w-7 rounded-full border-2 border-white bg-fuku-light bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
      ))}
      <span className="grid h-7 w-7 place-items-center rounded-full border border-fuku-border bg-white text-[10px] font-black text-fuku-gray">
        ...
      </span>
    </div>
  );
}
