import type { ReactNode } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import PageHero from "./PageHero";

export default function GuideLayout({ title, copy, children }: { title: string; copy: string; children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title={title} copy={copy} />
        <section className="space-y-4 px-4 py-5">{children}</section>
      </main>
      <BottomNav />
    </div>
  );
}
