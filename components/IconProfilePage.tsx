"use client";

import { ArrowRight, Bookmark, Camera, Heart, Instagram, MapPin, Share2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { FukuIcon } from "@/lib/data/icons";
import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import IconVoteButton from "./IconVoteButton";
import { addToLocalList, useToast } from "./Toast";
import { storageKeys } from "@/lib/storageKeys";

export default function IconProfilePage({ icon }: { icon: FukuIcon }) {
  const [votes, setVotes] = useState(icon.votes);
  const [voted, setVoted] = useState(false);
  const { showToast, ToastViewport } = useToast();
  const heroImage = icon.heroImage || icon.image;
  const gallery = (icon.galleryImages?.length ? icon.galleryImages : [heroImage, icon.image, "/images/spots/cafe-yakuin.jpg"]).filter(Boolean);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <section className="bg-white px-4 py-5">
          <div
            className="h-[360px] rounded-[16px] bg-fuku-light bg-cover bg-[center_30%] min-[390px]:h-[420px]"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,.05), rgba(17,17,17,.28)), url('${heroImage}')`,
            }}
          />
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[34px] font-black leading-none text-fuku-black">{icon.name}</h1>
              <p className="mt-2 text-[13px] font-bold text-fuku-gray">{icon.category}</p>
              <p className="mt-2 text-[12px] font-black text-fuku-black">{icon.instagram}</p>
            </div>
          </div>
          <p className="mt-4 text-[14px] font-black leading-relaxed text-fuku-black">{icon.copy}</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Info label="エリア" value={icon.area.replace("エリア", "")} />
            <Info label="注目度" value={icon.attention} />
            <Info label="投票数" value={votes.toLocaleString()} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <IconVoteButton
              slug={icon.slug}
              className="min-h-[44px] rounded-full px-5 text-[13px]"
              onVoted={(payload) => {
                setVotes(payload?.votes ?? votes + 1);
                setVoted(true);
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                addToLocalList(storageKeys.savedIcons, icon.slug);
                showToast("保存しました");
              }}
            >
              保存する
            </Button>
          </div>
          {voted ? (
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(`${icon.name}をFUKU ICONSで応援しました`)}`}
              className="mt-3 flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-fuku-border bg-white text-[12px] font-black"
            >
              <Share2 size={16} />
              シェアする
            </a>
          ) : null}
        </section>

        <section className="bg-white px-4 py-6">
          <h2 className="headline-condensed text-[30px] uppercase leading-none">PHOTO GALLERY</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {gallery.slice(0, 6).map((image, item) => (
              <div
                key={`${image}-${item}`}
                className="aspect-square rounded-[12px] bg-fuku-light bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
              />
            ))}
          </div>
        </section>

        <Section title="PROFILE" icon={<MapPin size={18} />}>
          <div className="flex flex-wrap gap-2">
            {icon.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-fuku-border px-3 py-2 text-[11px] font-black">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[13px] font-bold leading-relaxed text-fuku-gray">
            {icon.profileText || "福岡を拠点に活動しながら、街の空気やカルチャーを発信。自然体の表現で支持を集めています。"}
          </p>
        </Section>

        <Section title="INTERVIEW" icon={<Camera size={18} />}>
          <p className="text-[13px] font-bold leading-relaxed text-fuku-gray">
            {icon.interviewText || "福岡で好きな場所、活動を始めたきっかけ、これから挑戦したいことを聞きました。"}
          </p>
        </Section>

        <Section title="よく行く店" icon={<Bookmark size={18} />}>
          <div className="space-y-2">
            {icon.favoriteSpots.map((spot) => (
              <a key={spot} href="/spots/tenjin-night-cafe" className="flex min-h-[48px] items-center justify-between rounded-[10px] bg-fuku-light px-4 text-[12px] font-black">
                {spot}
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </Section>

        <Section title="推しコメント" icon={<Heart size={18} />}>
          <div className="space-y-3">
            {icon.comments.map((comment) => (
              <article key={comment.user} className="flex gap-3 rounded-[12px] border border-fuku-border bg-white p-4">
                <div className="h-9 w-9 shrink-0 rounded-full bg-fuku-light bg-cover bg-center" style={{ backgroundImage: comment.avatarUrl ? `url('${comment.avatarUrl}')` : undefined }}>
                  {!comment.avatarUrl ? <span className="grid h-full w-full place-items-center text-[11px] font-black text-fuku-red">{comment.user.replace("@", "").slice(0, 1).toUpperCase()}</span> : null}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-relaxed text-fuku-black">{comment.text}</p>
                  <p className="mt-3 text-[11px] font-black text-fuku-gray">{comment.user}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <section className="bg-white px-4 py-6">
          <div className="grid grid-cols-1 gap-3">
            <Button href="https://instagram.com/fuku_meets.jp" variant="light">
              <Instagram size={15} />
              Instagram
            </Button>
          </div>
        </section>
      </main>
      <BottomNav />
      <ToastViewport />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-fuku-border bg-white p-3">
      <p className="text-[10px] font-black text-fuku-gray">{label}</p>
      <p className="mt-1 text-[14px] font-black text-fuku-black">{value}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-fuku-border bg-white px-4 py-6">
      <h2 className="mb-4 flex items-center gap-2 text-[18px] font-black text-fuku-black">
        <span className="text-fuku-red">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
