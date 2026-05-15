import { MessageCircle } from "lucide-react";

export default function RankingPickedComments({ comments = [] }: { comments?: string[] }) {
  const visible = comments.slice(0, 2);
  if (!visible.length) {
    return (
      <div className="mt-3 rounded-[9px] border border-fuku-border bg-white px-3 py-2 text-[10px] font-bold text-fuku-gray">
        まだ推しコメントはありません。この候補にコメントする
      </div>
    );
  }
  return (
    <div className="mt-3 space-y-1">
      {visible.map((comment) => (
        <div key={comment} className="flex items-center gap-2 rounded-[9px] border border-fuku-border bg-white px-3 py-2 text-[10px] font-bold text-fuku-black">
          <MessageCircle size={12} className="shrink-0 text-fuku-red" />
          <span className="truncate">{comment}</span>
        </div>
      ))}
    </div>
  );
}
