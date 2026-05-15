import { CheckCircle2, Circle } from "lucide-react";

const missions = ["1回投票する", "推しコメントを書く", "店舗を1件保存する", "FUKU ICONSを応援する", "ランキングテーマを提案する"];

export default function MyPageActionMission({ completed = 3 }: { completed?: number }) {
  return (
    <section className="rounded-[16px] border border-fuku-border bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-black text-fuku-black">今週のFUKU ACTION</h2>
        <span className="text-[25px] font-black text-fuku-red">{completed}<span className="text-fuku-black">/5</span></span>
      </div>
      <div className="space-y-3">
        {missions.map((mission, index) => {
          const done = index < completed;
          return (
            <div key={mission} className="flex items-center gap-3 text-[13px] font-bold text-fuku-black">
              {done ? <CheckCircle2 className="text-fuku-red" size={18} /> : <Circle size={18} />}
              {mission}
            </div>
          );
        })}
      </div>
      <p className="mt-4 rounded-[10px] bg-fuku-light px-4 py-3 text-[12px] font-black text-fuku-black">
        今週あと{Math.max(5 - completed, 0)}つでバッジGET
      </p>
    </section>
  );
}
