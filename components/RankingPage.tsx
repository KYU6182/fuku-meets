"use client";

import {
  ArrowRight,
  Bookmark,
  Building2,
  Coffee,
  Crown,
  Edit3,
  Home,
  MapPin,
  MessageCircle,
  Moon,
  ShoppingBasket,
  Soup,
  Store,
  ThumbsUp,
  Train,
  TrendingUp,
  Trophy,
  Utensils,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { ElementType } from "react";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import { addToLocalList, useToast } from "./Toast";
import { rankingThemeAliases } from "@/lib/data/rankings";
import { storageKeys } from "@/lib/storageKeys";

type CategoryId = "food" | "people" | "daily" | "night" | "area";

type RankingItem = {
  rank: number;
  name: string;
  votes: string;
  image: string;
  note?: string;
};

type RankingTheme = {
  id: string;
  title: string;
  description: string;
  period: string;
  icon: ElementType;
  image: string;
  top3: string[];
  items: RankingItem[];
};

const rankingCategories: { id: CategoryId; label: string }[] = [
  { id: "food", label: "FOOD" },
  { id: "people", label: "PEOPLE" },
  { id: "daily", label: "DAILY" },
  { id: "night", label: "NIGHT" },
  { id: "area", label: "AREA" },
];

const dailyPeriod = "2024.05.01 - 2024.05.31";

const rankingThemes: Record<CategoryId, RankingTheme[]> = {
  daily: [
    {
      id: "supermarket",
      title: "好きなスーパー",
      description: "日常の味方！通いやすくて、品ぞろえも◎",
      period: dailyPeriod,
      icon: ShoppingBasket,
      image: "/images/ranking/super-bonrepas.jpg",
      top3: ["ボンラパス", "ハローデイ", "サニー"],
      items: [
        { rank: 1, name: "ボンラパス", votes: "1,842票", image: "/images/ranking/super-bonrepas.jpg" },
        { rank: 2, name: "ハローデイ", votes: "1,233票", image: "/images/ranking/super-halloday.jpg" },
        { rank: 3, name: "サニー", votes: "987票", image: "/images/ranking/super-sunny.jpg" },
        { rank: 4, name: "マックスバリュ", votes: "845票", image: "/images/ranking/super-maxvalu.jpg", note: "あと32票でTOP3" },
        { rank: 5, name: "にしてつストア", votes: "792票", image: "/images/ranking/super-nishitetsu.jpg", note: "あと50票でTOP3" },
        { rank: 6, name: "TRIAL", votes: "701票", image: "/images/ranking/super-trial.jpg", note: "急上昇" },
        { rank: 7, name: "業務スーパー", votes: "655票", image: "/images/ranking/super-gyomu.jpg" },
        { rank: 8, name: "レガネット", votes: "602票", image: "/images/ranking/super-reganet.jpg" },
        { rank: 9, name: "マキイ", votes: "588票", image: "/images/ranking/super-makii.jpg", note: "急上昇" },
        { rank: 10, name: "ロピア", votes: "540票", image: "/images/ranking/super-lopia.jpg" },
      ],
    },
    {
      id: "station",
      title: "好きな駅",
      description: "通勤・通学も、おでかけも。よく使う駅はここ！",
      period: dailyPeriod,
      icon: Train,
      image: "/images/ranking/station-yakuin.jpg",
      top3: ["薬院駅", "天神駅", "博多駅"],
      items: [
        { rank: 1, name: "薬院駅", votes: "2,109票", image: "/images/ranking/station-yakuin.jpg" },
        { rank: 2, name: "天神駅", votes: "1,732票", image: "/images/ranking/station-tenjin.jpg" },
        { rank: 3, name: "博多駅", votes: "1,421票", image: "/images/ranking/station-hakata.jpg" },
        { rank: 4, name: "西新駅", votes: "1,098票", image: "/images/ranking/station-nishijin.jpg" },
        { rank: 5, name: "六本松駅", votes: "1,086票", image: "/images/ranking/station-ropponmatsu.jpg" },
        { rank: 6, name: "大橋駅", votes: "945票", image: "/images/ranking/station-ohashi.jpg", note: "急上昇" },
        { rank: 7, name: "赤坂駅", votes: "822票", image: "/images/ranking/station-akasaka.jpg" },
        { rank: 8, name: "中洲川端駅", votes: "788票", image: "/images/ranking/station-nakasu.jpg" },
        { rank: 9, name: "平尾駅", votes: "741票", image: "/images/ranking/station-hirao.jpg" },
        { rank: 10, name: "千早駅", votes: "690票", image: "/images/ranking/station-chihaya.jpg" },
      ],
    },
    {
      id: "city",
      title: "住みたい街",
      description: "住むならこんな街に暮らしたい！",
      period: dailyPeriod,
      icon: Home,
      image: "/images/ranking/city-yakuin.jpg",
      top3: ["薬院", "大名", "六本松"],
      items: [
        { rank: 1, name: "薬院", votes: "1,876票", image: "/images/ranking/city-yakuin.jpg" },
        { rank: 2, name: "大名", votes: "1,312票", image: "/images/ranking/city-daimyo.jpg" },
        { rank: 3, name: "六本松", votes: "1,086票", image: "/images/ranking/city-ropponmatsu.jpg" },
        { rank: 4, name: "西新", votes: "1,020票", image: "/images/ranking/city-nishijin.jpg", note: "あと66票でTOP3" },
        { rank: 5, name: "平尾", votes: "911票", image: "/images/ranking/city-hirao.jpg" },
        { rank: 6, name: "大濠公園", votes: "880票", image: "/images/ranking/city-ohori.jpg" },
        { rank: 7, name: "今泉", votes: "812票", image: "/images/ranking/city-imaizumi.jpg" },
        { rank: 8, name: "赤坂", votes: "799票", image: "/images/ranking/city-akasaka.jpg" },
        { rank: 9, name: "千早", votes: "740票", image: "/images/ranking/city-chihaya.jpg", note: "急上昇" },
        { rank: 10, name: "博多", votes: "701票", image: "/images/ranking/city-hakata.jpg" },
      ],
    },
    {
      id: "night-help",
      title: "深夜助かる場所",
      description: "遅くなった日も、ここがあると安心。",
      period: dailyPeriod,
      icon: Moon,
      image: "/images/ranking/night-seven.jpg",
      top3: ["セブン-イレブン", "TRIAL GO", "すき家"],
      items: [
        { rank: 1, name: "セブン-イレブン", votes: "2,243票", image: "/images/ranking/night-seven.jpg" },
        { rank: 2, name: "TRIAL GO", votes: "1,498票", image: "/images/ranking/night-trial.jpg" },
        { rank: 3, name: "すき家", votes: "1,205票", image: "/images/ranking/night-sukiya.jpg" },
        { rank: 4, name: "ドン・キホーテ", votes: "1,118票", image: "/images/ranking/night-donki.jpg" },
        { rank: 5, name: "一蘭", votes: "1,030票", image: "/images/ranking/night-ichiran.jpg", note: "急上昇" },
        { rank: 6, name: "マックスバリュ", votes: "944票", image: "/images/ranking/night-maxvalu.jpg" },
        { rank: 7, name: "ファミリーマート", votes: "902票", image: "/images/ranking/night-familymart.jpg" },
        { rank: 8, name: "松屋", votes: "855票", image: "/images/ranking/night-matsuya.jpg" },
        { rank: 9, name: "サニー", votes: "811票", image: "/images/ranking/night-sunny.jpg" },
        { rank: 10, name: "ウエスト", votes: "780票", image: "/images/ranking/night-west.jpg" },
      ],
    },
  ],
  food: [
    makeSimpleTheme("cafe", "カフェ", "ひとり時間もデートも使える人気カフェ。", Coffee, ["manu coffee", "café mitu", "Sabrina Coffee"]),
    makeSimpleTheme("izakaya", "居酒屋", "仕事終わりに寄りたい福岡の夜ごはん。", Utensils, ["大名の隠れ家", "今泉酒場", "薬院二軒目"]),
    makeSimpleTheme("ramen", "ラーメン", "飲んだあとに締めたい一杯。", Soup, ["大名深夜麺", "博多豚骨", "中洲の一杯"]),
    makeSimpleTheme("bakery", "パン", "週末の朝に行きたいパン屋。", Store, ["大濠ベーカリー", "薬院クロワッサン", "六本松ブレッド"]),
  ],
  people: [
    makeSimpleTheme("model", "モデル", "福岡で注目されるモデルランキング。", Crown, ["YUI", "RENA", "ANNA"]),
    makeSimpleTheme("hair", "美容師", "髪を任せたい人気美容師。", Trophy, ["MIO", "SORA", "HARU"]),
    makeSimpleTheme("dj", "DJ", "福岡の夜をつくるDJ。", TrendingUp, ["KEITA", "NANA", "RYO"]),
    makeSimpleTheme("creator", "クリエイター", "街の空気を発信する人たち。", Edit3, ["KENTO", "RINA", "AOI"]),
  ],
  night: [
    makeSimpleTheme("club", "クラブ", "週末に行きたいイベント。", Moon, ["中洲NIGHT", "天神DJ", "大名HOUSE"]),
    makeSimpleTheme("shisha", "シーシャ", "ゆっくり話せる夜スポット。", Store, ["大名チル", "今泉ラウンジ", "中洲深夜"]),
    makeSimpleTheme("bar", "バー", "一人でも使いやすいバー。", Utensils, ["赤坂BAR", "薬院カウンター", "大名ワイン"]),
  ],
  area: [
    makeSimpleTheme("tenjin", "天神", "買い物も夜も強い中心エリア。", MapPin, ["天神カフェ", "天神駅", "天神夜市"]),
    makeSimpleTheme("daimyo", "大名", "カルチャーとごはんが集まる街。", MapPin, ["大名居酒屋", "大名美容室", "大名古着"]),
    makeSimpleTheme("imaizumi", "今泉", "散歩したくなる店が多い街。", MapPin, ["今泉カフェ", "今泉バー", "今泉サロン"]),
    makeSimpleTheme("yakuin", "薬院", "暮らしと食がちょうどいい街。", MapPin, ["薬院駅", "薬院カフェ", "薬院ランチ"]),
    makeSimpleTheme("hakata", "博多", "仕事帰りにも観光にも便利。", MapPin, ["博多駅", "博多豚骨", "博多ホテル"]),
    makeSimpleTheme("nakasu", "中洲", "夜の福岡を楽しむエリア。", MapPin, ["中洲クラブ", "中洲バー", "中洲屋台"]),
  ],
};

function makeSimpleTheme(
  id: string,
  title: string,
  description: string,
  icon: ElementType,
  top3: string[],
): RankingTheme {
  return {
    id,
    title,
    description,
    period: dailyPeriod,
    icon,
    image: `/images/ranking/${id}-1.jpg`,
    top3,
    items: Array.from({ length: 6 }, (_, index) => ({
      rank: index + 1,
      name: top3[index] ?? `${title} ${index + 1}`,
      votes: `${1420 - index * 137}票`,
      image: `/images/ranking/${id}-${index + 1}.jpg`,
      note: index === 3 ? "急上昇" : undefined,
    })),
  };
}

const comments = [
  { target: "ボンラパス", text: "品ぞろえが良くて、ちょっと良い日常感がある。" },
  { target: "ハローデイ", text: "惣菜が強い。仕事帰りに助かる。" },
  { target: "サニー", text: "結局いちばん行く、安心感がある。" },
];

function showGlobalToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fuku-toast", { detail: message }));
}

function vote() {
  addToLocalList(storageKeys.votedItems, `ranking:${Date.now()}`);
  showGlobalToast("投票しました");
}

function save() {
  addToLocalList(storageKeys.savedNews, `ranking:${Date.now()}`);
  showGlobalToast("保存しました");
}

function RankingHero() {
  return (
    <section className="relative overflow-hidden border-b border-fuku-border bg-white px-5 pb-7 pt-7">
      <div className="absolute right-4 top-16 h-28 w-36 rounded-full bg-[#fff1f1]" />
      <div className="absolute right-9 top-24 h-24 w-px bg-fuku-red/40" />
      <div className="absolute right-16 top-36 h-10 w-28 border-b border-r border-fuku-red/25" />
      <div className="relative">
        <h1 className="headline-condensed text-[54px] uppercase leading-[0.85] text-fuku-black">
          FUKUOKA RANKING
        </h1>
        <p className="mt-4 text-[16px] font-black leading-relaxed text-fuku-red">
          みんなの“好き”で、福岡のランキングが変わる。
        </p>
        <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-black">
          カフェ、居酒屋、スーパー、駅、街、人。
          <br />
          福岡のリアルな人気を、みんなの投票でチェック。
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { icon: TrendingUp, label: "今週の投票数", value: "12,845票" },
            { icon: Trophy, label: "開催中ランキング", value: "28件" },
            { icon: Crown, label: "急上昇", value: "7ジャンル" },
          ].map(({ icon: Icon, label, value }) => (
            <article key={label} className="rounded-[10px] border border-fuku-border bg-white p-3">
              <Icon size={20} className="text-fuku-red" />
              <p className="mt-2 text-[9px] font-black text-fuku-gray">{label}</p>
              <p className="mt-1 text-[16px] font-black text-fuku-black">{value}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={vote}
          className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full bg-fuku-red text-[15px] font-black text-white"
        >
          今すぐ投票する
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function RankingCategoryTabs({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: CategoryId;
  onSelect: (category: CategoryId) => void;
}) {
  return (
    <div className="sticky top-[116px] z-30 border-b border-fuku-border bg-white px-4 py-4">
      <div className="grid grid-cols-5 overflow-hidden rounded-full border border-fuku-border bg-white shadow-soft">
        {rankingCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`min-h-[42px] text-[12px] font-black ${
              selectedCategory === category.id ? "bg-fuku-red text-white" : "text-fuku-black"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PickupRankingThemes({
  themes,
  selectedRanking,
  onSelect,
}: {
  themes: RankingTheme[];
  selectedRanking: string;
  onSelect: (themeId: string) => void;
}) {
  return (
    <section className="bg-white px-4 py-5">
      <h2 className="mb-4 flex items-center gap-2 text-[18px] font-black text-fuku-black">
        <Crown size={20} className="text-fuku-red" />
        今週の注目ランキング
      </h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {themes.map((theme) => {
          const Icon = theme.icon;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelect(theme.id)}
              className={`min-w-[174px] rounded-[12px] border bg-white p-3 text-left ${
                selectedRanking === theme.id ? "border-fuku-red" : "border-fuku-border"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-fuku-red text-white">
                  <Icon size={19} />
                </span>
                <span className="rounded-[5px] border border-fuku-red px-2 py-1 text-[10px] font-black text-fuku-red">
                  TOP3
                </span>
              </div>
              <div
                className="mt-3 h-[68px] rounded-[7px] bg-fuku-light bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.15), rgba(17,17,17,.15)), url('${theme.image}')`,
                }}
              />
              <h3 className="mt-3 text-[14px] font-black text-fuku-black">{theme.title}</h3>
              <ol className="mt-2 space-y-1 text-[11px] font-bold text-fuku-black">
                {theme.top3.map((name, index) => (
                  <li key={name}>
                    {index + 1}　{name}
                  </li>
                ))}
              </ol>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RankingTopCard({ item }: { item: RankingItem }) {
  const badgeClass =
    item.rank === 1 ? "bg-[#f5b400]" : item.rank === 2 ? "bg-[#9ca3af]" : "bg-[#c9824a]";

  return (
    <article className="overflow-hidden rounded-[12px] border border-fuku-border bg-white">
      <div
        className="relative h-[112px] bg-fuku-light bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.12), rgba(17,17,17,.16)), url('${item.image}')`,
        }}
      >
        <span className={`absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full text-[17px] font-black text-white ${badgeClass}`}>
          {item.rank}
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-[15px] font-black text-fuku-black">{item.name}</h3>
        <p className="mt-1 text-[18px] font-black text-fuku-red">{item.votes}</p>
        <div className="mt-3 grid grid-cols-[44px_1fr] gap-2">
          <button
            type="button"
            onClick={save}
            className="grid min-h-[40px] place-items-center rounded-[8px] border border-fuku-border"
            aria-label={`${item.name}を保存`}
          >
            <Bookmark size={18} />
          </button>
          <button
            type="button"
            onClick={vote}
            className="min-h-[40px] rounded-[8px] bg-fuku-red text-[12px] font-black text-white"
          >
            投票する
          </button>
        </div>
      </div>
    </article>
  );
}

function RankingListItem({ item }: { item: RankingItem }) {
  return (
    <li className="grid grid-cols-[34px_1fr_auto] items-center gap-2 border-b border-fuku-border py-2">
      <span className="text-center text-[19px] font-black text-fuku-black">{item.rank}</span>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-black text-fuku-black">{item.name}</p>
        {item.note ? (
          <span className="mt-1 inline-flex rounded-full bg-[#ffe1e1] px-2 py-1 text-[10px] font-black text-fuku-red">
            {item.note}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-[13px] font-black text-fuku-black">{item.votes}</span>
        <button type="button" onClick={save} className="grid h-8 w-8 place-items-center rounded-[7px] border border-fuku-border" aria-label="保存">
          <Bookmark size={15} />
        </button>
        <button type="button" onClick={vote} className="min-h-[32px] rounded-[7px] bg-fuku-red px-3 text-[11px] font-black text-white">
          投票する
        </button>
      </div>
    </li>
  );
}

function SelectedRankingSection({ theme }: { theme: RankingTheme }) {
  const top3 = theme.items.slice(0, 3);
  const rest = theme.items.slice(3);

  return (
    <section className="border-t border-fuku-border bg-white px-4 py-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-black text-fuku-black">{theme.title}</h2>
          <p className="mt-1 text-[13px] font-black text-fuku-black">{theme.description}</p>
          <p className="mt-2 text-[11px] font-bold text-fuku-gray">集計期間：{theme.period}</p>
        </div>
        <a href={`/ranking?theme=${theme.id}`} className="mt-2 shrink-0 rounded-full border border-fuku-border px-4 py-2 text-[11px] font-black text-fuku-black">
          すべて見る 〉
        </a>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {top3.map((item) => (
          <RankingTopCard key={item.name} item={item} />
        ))}
      </div>
      <ol className="mt-4 rounded-[12px] border border-fuku-border bg-white px-3">
        {rest.map((item) => (
          <RankingListItem key={item.name} item={item} />
        ))}
      </ol>
    </section>
  );
}

function RankingVoteBanner() {
  return (
    <section className="bg-white px-4 py-5">
      <div className="relative overflow-hidden rounded-[16px] border border-[#f5caca] bg-[#fff1f1] p-5">
        <div className="relative z-10 max-w-[282px] pr-16">
          <p className="headline-condensed text-[36px] uppercase leading-none text-fuku-red">FUKU VOTE</p>
          <h2 className="mt-2 text-[15px] font-black text-fuku-black">あなたの“いつもの福岡”を教えて！</h2>
          <p className="mt-1 text-[12px] font-bold text-fuku-gray">みんなの投票で、ランキングが変わる！</p>
          <button type="button" onClick={vote} className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fuku-red px-5 text-[12px] font-black text-white">
            今すぐ投票する
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="absolute -right-1 bottom-4 h-[92px] w-[52px] rotate-[10deg] rounded-[13px] border-[4px] border-fuku-black bg-white">
          <div className="mx-auto mt-2 h-1 w-5 rounded-full bg-fuku-black" />
          <div className="mx-auto mt-6 h-7 w-7 rounded-full bg-fuku-red/15" />
        </div>
      </div>
    </section>
  );
}

function LatestComments() {
  return (
    <section className="bg-white px-4 py-2">
      <h2 className="mb-3 flex items-center gap-2 text-[17px] font-black text-fuku-black">
        <MessageCircle size={19} />
        みんなの推しコメント
      </h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-3">
        {comments.map((comment) => (
          <article key={comment.target} className="min-w-[210px] rounded-[12px] border border-fuku-border bg-white p-4">
            <p className="text-[34px] font-black leading-none text-fuku-red/25">“</p>
            <p className="-mt-3 text-[13px] font-bold leading-relaxed text-fuku-black">{comment.text}</p>
            <p className="mt-4 text-[11px] font-black text-fuku-black">● {comment.target}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RankingThemeRequest() {
  return (
    <section className="bg-white px-4 pb-28 pt-4">
      <div className="rounded-[14px] border border-dashed border-fuku-red bg-white p-4">
        <h2 className="flex items-center gap-2 text-[17px] font-black text-fuku-black">
          <Edit3 size={18} className="text-fuku-red" />
          次に見たいランキングを教えて！
        </h2>
        <p className="mt-2 text-[12px] font-bold leading-relaxed text-fuku-gray">
          福岡で好きなプリン、雨の日に行きたい場所、一人暮らしにおすすめの街など、次に作ってほしいランキングを募集しています。
        </p>
        <div className="mt-4 rounded-[10px] bg-fuku-light px-4 py-3 text-[11px] font-bold text-fuku-gray">
          例）福岡で好きなプリン / 雨の日に行きたい場所 / 一人暮らしにおすすめの街
        </div>
        <a
          href="/forms/ranking-theme"
          className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-fuku-red text-[13px] font-black text-white"
        >
          テーマを提案する
          <Edit3 size={15} />
        </a>
      </div>
    </section>
  );
}

export default function RankingPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("daily");
  const [selectedRanking, setSelectedRanking] = useState("supermarket");
  const themes = rankingThemes[selectedCategory];
  const selectedTheme = themes.find((theme) => theme.id === selectedRanking) ?? themes[0];
  const mode = searchParams.get("mode");

  useEffect(() => {
    const category = searchParams.get("category") as CategoryId | null;
    const themeParam = searchParams.get("theme");
    const aliasedTheme = themeParam ? (rankingThemeAliases[themeParam] ?? themeParam) : null;
    const nextCategory =
      category && rankingThemes[category]
        ? category
        : aliasedTheme
          ? (Object.keys(rankingThemes).find((key) =>
              rankingThemes[key as CategoryId].some((theme) => theme.id === aliasedTheme),
            ) as CategoryId | undefined)
          : undefined;

    if (nextCategory) {
      setSelectedCategory(nextCategory);
      const nextTheme = aliasedTheme && rankingThemes[nextCategory].some((theme) => theme.id === aliasedTheme)
        ? aliasedTheme
        : rankingThemes[nextCategory][0].id;
      setSelectedRanking(nextTheme);
    }
  }, [searchParams]);

  function handleCategory(category: CategoryId) {
    setSelectedCategory(category);
    setSelectedRanking(rankingThemes[category][0].id);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main>
        <RankingHero />
        <RankingCategoryTabs selectedCategory={selectedCategory} onSelect={handleCategory} />
        {mode === "vote" ? <VoteModePanel themes={themes} onSelect={setSelectedRanking} /> : null}
        <PickupRankingThemes
          themes={themes}
          selectedRanking={selectedTheme.id}
          onSelect={setSelectedRanking}
        />
        <SelectedRankingSection theme={selectedTheme} />
        <RankingVoteBanner />
        <LatestComments />
        <RankingThemeRequest />
      </main>
      <BottomNav active="ranking" />
      <PageToastBridge />
    </div>
  );
}

function VoteModePanel({ themes, onSelect }: { themes: RankingTheme[]; onSelect: (id: string) => void }) {
  return (
    <section className="border-b border-fuku-border bg-[#fff1f1] px-4 py-4">
      <h2 className="text-[17px] font-black text-fuku-black">投票できるランキング</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className="min-h-[46px] rounded-[10px] bg-white px-3 text-left text-[12px] font-black text-fuku-black"
          >
            {theme.title}
          </button>
        ))}
      </div>
    </section>
  );
}

function PageToastBridge() {
  const { showToast, ToastViewport } = useToast();

  useEffect(() => {
    const handler = (event: Event) => {
      const message = (event as CustomEvent<string>).detail;
      showToast(message);
    };
    window.addEventListener("fuku-toast", handler);
    return () => window.removeEventListener("fuku-toast", handler);
  }, [showToast]);

  return <ToastViewport />;
}
