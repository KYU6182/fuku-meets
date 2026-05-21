"use client";

import {
  CalendarDays,
  ChevronDown,
  LockKeyhole,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import CommunityGenderRatio from "./CommunityGenderRatio";
import CommunityJoinButton from "./CommunityJoinButton";
import Header from "./Header";
import { defaultCommunities, getCommunityBySlugAsync, getCommunityParticipants } from "@/lib/communityMeet";
import type { CommunityMeet } from "@/types/communityMeet";
import { getCurrentUser } from "@/lib/userAuth";

function pct(value?: number) {
  return Math.max(0, Math.min(100, Math.round(value ?? 0)));
}

function MiniBar({ label, value, caption }: { label: string; value: number; caption?: string }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[12px] font-black text-fuku-black">{label}</p>
        <p className="text-[15px] font-black text-fuku-red">{value}%</p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#eee9e2]">
        <div className="h-full rounded-full bg-fuku-red" style={{ width: `${value}%` }} />
      </div>
      {caption ? <p className="mt-1 text-[10px] font-bold text-fuku-gray">{caption}</p> : null}
    </div>
  );
}

function RelatedMeetCard({ meet }: { meet: CommunityMeet }) {
  return (
    <a href={`/meet/${meet.slug}`} className="block min-w-[190px] overflow-hidden rounded-[14px] border border-fuku-border bg-white">
      <div
        className="h-24 bg-fuku-light bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.34)),url('${meet.image || "/images/meet/creep-live.jpg"}')` }}
      />
      <div className="p-3">
        <p className="line-clamp-1 text-[13px] font-black text-fuku-black">{meet.title}</p>
        <p className="mt-1 text-[10px] font-bold text-fuku-gray">{meet.area} / {meet.startTime}〜</p>
        <p className="mt-2 inline-flex rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-black text-fuku-red">参加予定 {meet.participantCount}人</p>
      </div>
    </a>
  );
}

export default function CommunityDetailPage({ slug }: { slug: string }) {
  const fallback = defaultCommunities.find((item) => item.slug === slug || item.id === slug) ?? defaultCommunities[0];
  const [community, setCommunity] = useState(fallback);
  const [isParticipant, setIsParticipant] = useState(false);
  const [activeRelatedTab, setActiveRelatedTab] = useState(community.relatedMeetTabs?.[0]?.label ?? "女性限定");

  useEffect(() => {
    let mounted = true;
    void getCommunityBySlugAsync(slug).then((item) => {
      if (!mounted || !item) return;
      setCommunity(item);
      setActiveRelatedTab(item.relatedMeetTabs?.[0]?.label ?? "女性限定");
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    const user = getCurrentUser();
    setIsParticipant(Boolean(user && getCommunityParticipants().some((item) => item.userId === user.userId && item.communityId === community.id && item.status === "joined")));
  }, [community.id]);

  const heroImage = community.heroImage || community.image || "/images/meet/creep-live.jpg";
  const publicLocation = community.publicAreaLabel ?? `${community.area}エリア`;
  const fee = community.fee ?? 800;
  const safety = community.safety ?? {};
  const femaleCount = safety.femaleCount ?? Math.round((community.participantCount * community.femaleRatio) / 100);
  const maleCount = safety.maleCount ?? Math.max(0, community.participantCount - femaleCount);
  const firstTimerRate = pct(safety.firstTimerRate ?? 85);
  const localRate = pct(safety.localRate ?? 60);
  const travelerRate = pct(safety.travelerRate ?? 40);
  const profiles = community.participantProfiles ?? [];
  const privateLocation = community.privateLocation ?? {};
  const faqs = [...(community.faqs ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const relatedTabs = community.relatedMeetTabs ?? [];
  const activeTab = relatedTabs.find((tab) => tab.label === activeRelatedTab) ?? relatedTabs[0];
  const relatedMeets = useMemo(() => {
    const slugs = activeTab?.meetSlugs ?? [];
    return slugs
      .map((meetSlug) => defaultCommunities.find((item) => item.slug === meetSlug || item.id === meetSlug))
      .filter((item): item is CommunityMeet => Boolean(item))
      .filter((item) => item.slug !== community.slug);
  }, [activeTab?.meetSlugs, community.slug]);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-[#fbfaf7] shadow-phone">
      <Header />
      <main className="pb-44">
        <section className="px-4 pt-4">
          <a href="/meet" className="mb-3 inline-flex text-[13px] font-black text-fuku-black">← MEET一覧に戻る</a>
          <div className="overflow-hidden rounded-[22px] border border-fuku-border bg-white shadow-soft">
            <div
              className="relative min-h-[330px] bg-fuku-black bg-cover bg-center p-4 text-white"
              style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.82)),url('${heroImage}')` }}
            >
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex rounded-[7px] bg-fuku-red px-3 py-1.5 text-[11px] font-black">{community.category}</span>
                <h1 className="mt-3 text-[34px] font-black leading-tight tracking-[-0.02em]">{community.title}</h1>
                <p className="mt-2 text-[14px] font-bold leading-relaxed">
                  {community.artist?.name ? `${community.artist.name}のライブ後、` : ""}
                  余韻をそのまま話せる少人数MEET。
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-black">
                  <span className="rounded-full bg-white/14 px-3 py-2 backdrop-blur"><MapPin size={13} className="mr-1 inline" />{publicLocation}</span>
                  <span className="rounded-full bg-white/14 px-3 py-2 backdrop-blur"><CalendarDays size={13} className="mr-1 inline" />05.25 {community.startTime}〜</span>
                  <span className="rounded-full bg-white/14 px-3 py-2 backdrop-blur"><Users size={13} className="mr-1 inline" />参加予定 {community.participantCount}人</span>
                  <span className="rounded-full bg-white/14 px-3 py-2 backdrop-blur">女性比率 {community.femaleRatio}%</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {community.tags.slice(0, 6).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#fff1f1] px-3 py-2 text-[11px] font-black text-fuku-red">{tag}</span>
                ))}
              </div>
              <div className="mt-4">
                <CommunityJoinButton community={community} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-4 mt-4 rounded-[18px] border border-fuku-border bg-white p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              [`${community.participantCount}名`, "現在の参加者"],
              [`${community.femaleRatio}%`, "女性比率"],
              [`${firstTimerRate}%`, "初参加・一人参加"],
              [`${travelerRate}%`, "遠征組"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[14px] bg-[#fbfaf7] px-2 py-3">
                <p className="text-[20px] font-black text-fuku-red">{value}</p>
                <p className="mt-1 text-[9px] font-black leading-tight text-fuku-gray">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["身分証確認済みユーザーのみ", "店舗詳細は参加確定後に共有", "個別会計推奨"].map((item) => (
              <span key={item} className="rounded-full border border-[#f5caca] bg-[#fff1f1] px-3 py-1.5 text-[10px] font-black text-fuku-red">{item}</span>
            ))}
          </div>
        </section>

        <section className="mx-4 mt-4 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">このMEETについて</h2>
          <p className="mt-3 whitespace-pre-line text-[13px] font-bold leading-relaxed text-fuku-black">
            クリープハイプのライブ後、{"\n"}今日のセトリ、好きな曲、余韻をそのまま話せる飲み会です。{"\n\n"}
            一人参加・遠征参加も歓迎。ライブTシャツやタオルのまま来ても大丈夫です。{"\n\n"}
            お店は天神エリア。詳しい店舗名・住所・予約名は、参加確定後にだけ共有します。
          </p>
          <div className="mt-4 rounded-[14px] border border-[#f5caca] bg-[#fff1f1] p-4 text-[12px] font-bold leading-relaxed text-fuku-black">
            <p>連絡先交換の強要、勧誘、迷惑行為は禁止です。</p>
            <p className="mt-1">20歳未満の飲酒は禁止です。</p>
          </div>
        </section>

        <section className="mt-5">
          <div className="mx-4 flex items-end justify-between">
            <h2 className="text-[21px] font-black text-fuku-black">参加メンバーの雰囲気</h2>
            <p className="text-[10px] font-bold text-fuku-gray">実名・連絡先は非表示</p>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
            {(profiles.length ? profiles : []).map((profile, index) => (
              <article key={profile.id} className="min-w-[188px] rounded-[18px] border border-fuku-border bg-white p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-full bg-[#f3efe7] bg-cover bg-center text-[13px] font-black text-fuku-red"
                    style={{ backgroundImage: profile.iconUrl ? `url('${profile.iconUrl}')` : undefined }}
                  >
                    {!profile.iconUrl ? `P${index + 1}` : null}
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-fuku-black">{profile.genderLabel} / {profile.ageLabel}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-fuku-gray">{profile.areaLabel}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-[11px] font-bold text-fuku-black">
                  <p>ファン歴：{profile.fanHistory}</p>
                  <p>推し曲：{profile.favoriteSong}</p>
                  <p className="rounded-[10px] bg-[#fbfaf7] p-3 leading-relaxed">{profile.comment}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">参加者バランス</h2>
          <div className="mt-4 grid grid-cols-[1fr_112px] gap-4 rounded-[14px] bg-[#fbfaf7] p-4">
            <div className="space-y-3">
              <p className="text-[13px] font-black text-fuku-black">現在の参加者：{community.participantCount}名</p>
              <p className="text-[12px] font-bold text-fuku-gray">男性 {maleCount}名 / 女性 {femaleCount}名</p>
              <MiniBar label="初参加・一人参加率" value={firstTimerRate} />
              <MiniBar label="遠征組" value={travelerRate} caption={`地元民 ${localRate}% / 遠征組 ${travelerRate}%`} />
            </div>
            <CommunityGenderRatio maleRatio={community.maleRatio} femaleRatio={community.femaleRatio} size={82} />
          </div>
        </section>

        <section id="location" className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">店舗・集合場所</h2>
          {isParticipant ? (
            <div className="mt-3 space-y-2 rounded-[14px] bg-[#fbfaf7] p-4 text-[13px] font-bold leading-relaxed text-fuku-black">
              <p><b>店舗名：</b>{privateLocation.venueName || community.participantVenueName || "参加者向けに個別共有"}</p>
              <p><b>住所：</b>{privateLocation.address || community.participantAddress || "参加者向けに個別共有"}</p>
              <p><b>Google Map：</b>{privateLocation.googleMapUrl || "参加後チャットで共有"}</p>
              <p><b>予約名：</b>{privateLocation.reservationName || "参加後チャットで共有"}</p>
              <p><b>集合メモ：</b>{privateLocation.meetingMemo || community.participantMemo || "開催前に詳しい案内をお送りします。"}</p>
              <p><b>幹事への連絡方法：</b>{privateLocation.hostContactMemo || "参加後チャットで案内します。"}</p>
            </div>
          ) : (
            <div className="mt-3 rounded-[14px] bg-[#fff1f1] p-4 text-[13px] font-bold leading-relaxed text-fuku-black">
              <p className="font-black text-fuku-red">店舗詳細は参加確定後に共有されます</p>
              <p className="mt-2">公開ページでは大まかなエリアだけ表示しています。参加確定後に、店舗名・住所・Google Map・予約名・集合メモ・幹事への連絡方法をお送りします。</p>
              <p className="mt-3 rounded-[10px] bg-white px-3 py-2 text-[12px] font-black text-fuku-red">安全のため、店舗詳細は参加者だけに共有します。</p>
            </div>
          )}
        </section>

        <section className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <h2 className="text-[21px] font-black text-fuku-black">参加後チャット</h2>
          </div>
          <p className="mt-3 text-[13px] font-bold leading-relaxed text-fuku-gray">参加者だけが見られる当日用チャットです。ライブ後の合流、遅刻連絡、物販状況などをゆるく共有できます。</p>
          <div className="mt-4 space-y-2 rounded-[14px] bg-[#fbfaf7] p-4 text-[12px] font-bold text-fuku-black blur-[1px]">
            <p className="rounded-[12px] bg-white p-3">鹿児島から今新幹線乗りました！</p>
            <p className="rounded-[12px] bg-white p-3">物販の並びエグいです笑</p>
            <p className="rounded-[12px] bg-white p-3">終演後、天神向かいます！</p>
          </div>
          <a href="/mypage/meets" className="mt-3 flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-fuku-border bg-white text-[12px] font-black text-fuku-black">
            <LockKeyhole size={15} /> 参加確定後にマイページで表示されます
          </a>
        </section>

        <section className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">キャンセル・キャンセル待ち</h2>
          <div className="mt-3 grid gap-3 text-[13px] font-bold leading-relaxed text-fuku-black">
            <p className="rounded-[14px] bg-[#fbfaf7] p-4">キャンセル期限：{community.cancelPolicy?.cancelUntil ?? "開催前までにマイページから申請できます。"}</p>
            <p className="rounded-[14px] bg-[#fbfaf7] p-4">満席時はキャンセル待ちに登録できます。空きが出た場合、順番に案内します。</p>
            <p className="rounded-[14px] bg-[#fff1f1] p-4 text-fuku-red">途中参加・途中退室もOK。申請時に希望を選べるので、当日も気まずくなりません。</p>
          </div>
        </section>

        <section className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">FAQ</h2>
          <div className="mt-3 divide-y divide-fuku-border">
            {faqs.map((faq) => (
              <details key={faq.id} className="group py-3" open={faq.order === 1}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-black text-fuku-black">
                  <span><span className="mr-2 text-fuku-red">Q.</span>{faq.question}</span>
                  <ChevronDown size={16} className="shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 pl-6 text-[12px] font-bold leading-relaxed text-fuku-gray">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <div className="mx-4 flex items-end justify-between">
            <h2 className="text-[21px] font-black text-fuku-black">{community.artist?.name ?? "同一アーティスト"}関連MEET</h2>
            <a href={`/meet?artist=${community.artist?.slug ?? ""}`} className="text-[12px] font-black text-fuku-black">もっと見る →</a>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto px-4">
            {relatedTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveRelatedTab(tab.label)}
                className={`min-h-[38px] shrink-0 rounded-full px-4 text-[12px] font-black ${activeRelatedTab === tab.label ? "bg-fuku-red text-white" : "border border-fuku-border bg-white text-fuku-black"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
            {(relatedMeets.length ? relatedMeets : defaultCommunities.filter((item) => item.slug !== community.slug).slice(0, 3)).map((meet) => (
              <RelatedMeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        </section>

        <section className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">幹事情報・レビュー</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${community.hostAvatar}')` }} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-black text-fuku-black">{community.hostName}</p>
              <p className="mt-1 text-[11px] font-bold text-fuku-gray">開催{community.hostEventCount}回 / レビュー {community.hostReviewScore} / 本人確認済み</p>
            </div>
            <Star className="text-[#f5b400]" />
          </div>
          <div className="mt-4 grid gap-2 text-[11px] font-black text-fuku-red">
            <span className="rounded-full bg-[#fff1f1] px-3 py-2">運営確認済み幹事</span>
            <span className="rounded-full bg-[#fff1f1] px-3 py-2">通報・ブロック対応あり</span>
            <span className="rounded-full bg-[#fff1f1] px-3 py-2">当日は女性サポートメンバー同席</span>
          </div>
        </section>

        <section className="mx-4 mt-5 rounded-[18px] border border-fuku-border bg-white p-5">
          <h2 className="text-[21px] font-black text-fuku-black">安心ルール</h2>
          <div className="mt-3 grid gap-2">
            {[
              "20歳未満の飲酒は禁止です",
              "飲酒を伴うMEETは20歳以上のみ参加できます",
              "連絡先交換の強要は禁止です",
              "セクハラ・勧誘・迷惑行為は禁止です",
              "通報・ブロック機能があります",
              "店舗情報は参加確定者にのみ共有される場合があります",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-[12px] bg-[#fbfaf7] px-3 py-2 text-[12px] font-bold text-fuku-black">
                <ShieldCheck size={15} className="text-fuku-red" /> {item}
              </span>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-[74px] z-40 mx-auto max-w-[430px] border-t border-fuku-border bg-white/96 px-4 py-3 shadow-[0_-8px_20px_rgba(17,17,17,.08)] backdrop-blur">
        <CommunityJoinButton community={community} joinedLabel={isParticipant ? "参加確定済み" : undefined} />
      </div>
      <BottomNav active="meet" />
    </div>
  );
}
