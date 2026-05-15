"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { magazineLocations } from "@/lib/data/magazine";

export default function MagazineLocationsPage() {
  const [area, setArea] = useState("すべて");
  const filtered = area === "すべて" ? magazineLocations : magazineLocations.filter((location) => location.area === area);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-fuku-bg shadow-phone">
      <Header />
      <main className="pb-28">
        <PageHero title="MAGAZINE LOCATIONS" copy="FUKU-MEETS MAGAZINE設置場所。" />
        <section className="space-y-4 px-4 py-5">
          <div className="flex gap-2">
            {["すべて", "薬院", "大名", "天神"].map((item) => (
              <button key={item} type="button" onClick={() => setArea(item)} className={`min-h-[36px] rounded-full px-4 text-[12px] font-black ${area === item ? "bg-fuku-red text-white" : "border border-fuku-border bg-white"}`}>{item}</button>
            ))}
          </div>
          <div className="h-40 rounded-[16px] bg-[linear-gradient(135deg,#f2eee8,#fff1f1)] p-4 text-[12px] font-black text-fuku-gray">地図風UI</div>
          {filtered.map((location) => (
            <article key={location.slug} className="flex items-center gap-3 rounded-[14px] border border-fuku-border bg-white p-4">
              <MapPin size={18} className="text-fuku-red" />
              <div>
                <p className="text-[14px] font-black">{location.name}</p>
                <p className="text-[11px] font-bold text-fuku-gray">{location.area}エリア</p>
              </div>
            </article>
          ))}
          <Button href="/forms/paper-placement" className="w-full">設置申請する</Button>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
