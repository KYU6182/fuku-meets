"use client";

import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import CommentGoodButton from "./CommentGoodButton";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "./Toast";
import { addUserComment, getCommentsByTarget, getCurrentUserProfile } from "@/lib/userCommunity";
import { getCurrentUser } from "@/lib/userAuth";
import type { UserComment } from "@/types/community";

const defaultTags = ["雰囲気がいい", "ひとりで行きやすい", "デート向き", "コスパがいい", "店員さんが良い", "写真映え", "地元感がある", "夜に使える"];

export default function SpotCommentForm({
  targetId,
  targetTitle,
  targetType = "spot",
}: {
  targetId: string;
  targetTitle: string;
  targetType?: "spot" | "ranking" | "icon" | "news";
}) {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const { showToast, ToastViewport } = useToast();

  function reload() {
    setComments(getCommentsByTarget(targetType, targetId));
  }

  useEffect(() => {
    setLoggedIn(Boolean(getCurrentUser()));
    reload();
  }, [targetId, targetType]);

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function submit() {
    const user = getCurrentUser();
    const profile = getCurrentUserProfile();
    if (!user || !profile) return;
    if (!body.trim()) {
      showToast("コメントを入力してください");
      return;
    }
    addUserComment({
      userId: user.userId,
      username: profile.username,
      userDisplayName: profile.displayName,
      userAvatar: profile.avatar,
      targetType,
      targetId,
      targetTitle,
      body: body.trim(),
      tags,
      imageUrls: images,
    });
    setBody("");
    setTags([]);
    setImages([]);
    reload();
    showToast("推しコメントを投稿しました");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.length ? comments.map((comment) => <CommentCard key={comment.id} comment={comment} />) : <p className="rounded-[12px] bg-fuku-light p-4 text-[12px] font-bold text-fuku-gray">まだ推しコメントはありません。この候補にコメントしてみよう。</p>}
      </div>
      <div className="rounded-[16px] border border-fuku-border bg-white p-4">
        <h3 className="text-[16px] font-black text-fuku-black">コメントする</h3>
        {!loggedIn ? (
          <div className="mt-4 rounded-[12px] bg-fuku-light p-4 text-center">
            <p className="text-[13px] font-black text-fuku-black">ログインすると推しコメントできます</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button href="/auth/login" variant="black">ログイン</Button>
              <Button href="/auth/register" variant="outline">会員登録</Button>
            </div>
          </div>
        ) : (
          <>
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} placeholder="このお店・ランキングの推しポイントを書いてみよう！" className="mt-3 w-full rounded-[12px] border border-fuku-border px-3 py-3 text-[13px] font-bold outline-none focus:border-fuku-red" />
            <p className="mt-3 text-[11px] font-black text-fuku-black">推しポイントを選択（複数選択OK）</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {defaultTags.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-2 text-[11px] font-black ${tags.includes(tag) ? "border-fuku-red bg-[#fff1f1] text-fuku-red" : "border-fuku-border bg-white text-fuku-black"}`}>
                  {tag}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <ImageUploadField value={images} onChange={setImages} maxImages={3} />
            </div>
            <button type="button" onClick={submit} className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-fuku-red text-[14px] font-black text-white">
              <Send size={16} />
              投稿する
            </button>
          </>
        )}
      </div>
      <ToastViewport />
    </div>
  );
}

function CommentCard({ comment }: { comment: UserComment }) {
  return (
    <article className="rounded-[14px] border border-fuku-border bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-fuku-light">
          {comment.userAvatar ? <img src={comment.userAvatar} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black text-fuku-black">{comment.userDisplayName}</p>
          <p className="text-[10px] font-bold text-fuku-gray">@{comment.username} ・ {new Date(comment.createdAt).toLocaleString("ja-JP")}</p>
          <p className="mt-2 text-[13px] font-bold leading-relaxed text-fuku-black">{comment.body}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {comment.tags.map((tag) => <span key={tag} className="rounded-full bg-fuku-light px-2 py-1 text-[10px] font-black text-fuku-gray">#{tag}</span>)}
          </div>
          {comment.imageUrls.length ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {comment.imageUrls.map((image) => <img key={image} src={image} alt="" className="aspect-square rounded-[8px] object-cover" />)}
            </div>
          ) : null}
          <div className="mt-3">
            <CommentGoodButton commentId={comment.id} initialCount={comment.goodCount} />
          </div>
        </div>
      </div>
    </article>
  );
}
