import { Heart } from "lucide-react";
import type { UserPost } from "@/types/community";

export default function UserPostCard({ post }: { post: UserPost }) {
  return (
    <article className="rounded-[14px] border border-fuku-border bg-white p-4">
      {post.imageUrls[0] ? (
        <img src={post.imageUrls[0]} alt="" className="mb-3 h-28 w-full rounded-[10px] object-cover" />
      ) : null}
      <span className="rounded-[5px] bg-fuku-red px-2 py-1 text-[10px] font-black text-white">{post.type}</span>
      <h3 className="mt-3 text-[15px] font-black text-fuku-black">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-[12px] font-bold leading-relaxed text-fuku-gray">{post.body}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] font-black text-fuku-black">
        <span className="flex items-center gap-1"><Heart size={14} className="text-fuku-red" /> GOOD {post.goodCount}</span>
        <span>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</span>
      </div>
    </article>
  );
}
