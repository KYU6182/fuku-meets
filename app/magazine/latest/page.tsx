import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { icons } from "@/lib/data/icons";
import { magazineIssues } from "@/lib/data/magazine";
import { spots } from "@/lib/data/spots";

export default function MagazineLatestPage() {
  const issue = magazineIssues[0];

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="LATEST ISSUE" copy={issue.title} description={issue.feature} />
        <section className="space-y-5 px-4 py-5">
          <div className="mx-auto h-[300px] w-[210px] rotate-[3deg] rounded-[6px] border-[8px] border-white bg-fuku-light bg-cover bg-center shadow-phone" style={{ backgroundImage: `url('${issue.image}')` }} />
          <Info title="巻頭特集" items={["福岡のいまを歩く", "人、店、まちのこと", "次に会いたいローカルアイコン"]} />
          <Info title="掲載FUKU ICONS" items={icons.slice(0, 3).map((icon) => icon.name)} />
          <Info title="掲載店舗" items={spots.slice(0, 3).map((spot) => spot.name)} />
          <div className="grid grid-cols-2 gap-3">
            <Button href="/news">Webで読む</Button>
            <Button href="/magazine/locations" variant="outline">設置場所を見る</Button>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[16px] border border-fuku-border bg-white p-5">
      <h2 className="text-[18px] font-black">{title}</h2>
      <ul className="mt-3 space-y-2 text-[13px] font-bold text-fuku-gray">
        {items.map((item) => <li key={item}>・{item}</li>)}
      </ul>
    </section>
  );
}
