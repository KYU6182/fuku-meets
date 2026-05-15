import BottomNav from "./BottomNav";
import Button from "./Button";
import Header from "./Header";
import PageHero from "./PageHero";

export default function InfoPage({ title, copy, body }: { title: string; copy: string; body: string }) {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title={title} copy={copy} />
        <section className="space-y-4 px-4 py-5">
          <div className="rounded-[16px] border border-fuku-border bg-white p-5 text-[13px] font-bold leading-relaxed text-fuku-gray">
            {body}
          </div>
          <Button href="/forms/contact" className="w-full">お問い合わせ</Button>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
