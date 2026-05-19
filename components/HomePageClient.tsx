"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import FukuIconsSection from "@/components/FukuIconsSection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HomeFollowUsSection from "@/components/HomeFollowUsSection";
import LocalMediaSection from "@/components/LocalMediaSection";
import PaperSection from "@/components/PaperSection";
import RankingMeetSection from "@/components/RankingMeetSection";
import TonightInFukuokaSection from "@/components/TonightInFukuokaSection";
import { getDefaultHomeCmsData, getPublishedHomeAsync } from "@/lib/cms";
import type { HomeCmsData, HomeSectionId } from "@/types/cms";

const iconsData = [
  { rank: 1, image: "/images/yui.jpg", name: "YUI", genre: "model・creator", votes: "1.2k" },
  { rank: 2, image: "/images/rena.jpg", name: "RENA", genre: "model", votes: "987" },
  { rank: 3, image: "/images/keita.jpg", name: "KEITA", genre: "artist", votes: "873" },
];

const footerLinks = [
  { title: "ABOUT", links: ["FUKU-MEETSについて", "ランキングについて", "FUKU ICONS"] },
  { title: "CONTACT", links: ["お問い合わせ", "掲載について", "イベント投稿"] },
  { title: "参加する", links: ["店舗推薦", "ランキングテーマ提案", "フリーペーパー設置申請"] },
  { title: "FUKU ICONS", links: ["一般エントリー", "推しを推薦", "表紙投票"] },
];

const visibleHomeSectionOrder: HomeSectionId[] = [
  "hero",
  "tonight",
  "ranking",
  "fukuIcons",
  "localMedia",
  "magazine",
  "followUs",
];

function sanitizeHomeOrder(order: HomeSectionId[]) {
  const allowed = new Set<HomeSectionId>(visibleHomeSectionOrder);
  const ordered = order.filter((sectionId) => allowed.has(sectionId));
  return [
    ...ordered,
    ...visibleHomeSectionOrder.filter((sectionId) => !ordered.includes(sectionId)),
  ];
}

export default function HomePageClient({ initialCms }: { initialCms?: HomeCmsData }) {
  const [cms, setCms] = useState<HomeCmsData>(() => initialCms ?? getDefaultHomeCmsData());

  useEffect(() => {
    let mounted = true;
    void getPublishedHomeAsync().then((data) => {
      if (mounted) setCms(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  function renderSection(sectionId: HomeSectionId) {
    switch (sectionId) {
      case "hero":
        return <HeroSection cms={cms.hero} />;
      case "tonight":
        return <TonightInFukuokaSection cms={cms.tonight} />;
      case "ranking":
        return <RankingMeetSection cms={cms.ranking} />;
      case "fukuIcons":
        return <FukuIconsSection cms={cms.fukuIcons} iconsData={iconsData} />;
      case "localMedia":
        return <LocalMediaSection cms={cms.localMedia} />;
      case "startGuide":
        return null;
      case "safety":
        return null;
      case "magazine":
        return <PaperSection cms={cms.magazine} />;
      case "followUs":
        return <HomeFollowUsSection cms={cms.followUs} />;
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-phone">
      <Header />
      <main>
        {sanitizeHomeOrder(cms.sectionOrder).map((sectionId) => (
          <div key={sectionId}>{renderSection(sectionId)}</div>
        ))}
      </main>
      <Footer footerLinks={footerLinks} />
      <BottomNav />
    </div>
  );
}
