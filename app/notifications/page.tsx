import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";

const notifications = [
  { title: "投票したランキングの結果が更新されました", read: false },
  { title: "保存した店がランクインしました", read: false },
  { title: "FUKU ICONSの新着インタビュー", read: true },
  { title: "週末イベントのお知らせ", read: true },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="NOTIFICATIONS" copy="お知らせ" />
        <section className="space-y-3 px-4 py-5">
          {notifications.map((item) => (
            <article key={item.title} className="flex items-center justify-between rounded-[14px] border border-fuku-border bg-white p-4">
              <p className="text-[13px] font-black text-fuku-black">{item.title}</p>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black ${item.read ? "bg-fuku-light text-fuku-gray" : "bg-[#fff1f1] text-fuku-red"}`}>
                {item.read ? "既読" : "未読"}
              </span>
            </article>
          ))}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
