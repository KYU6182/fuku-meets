import { ArrowRight, CalendarDays, CircleHelp, Info, Mail, MapPin, Megaphone, ShieldCheck, Store, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FooterLinkGroup = {
  title: string;
  links: string[];
};

type FooterProps = {
  footerLinks?: FooterLinkGroup[];
};

const aboutLinks = [
  { label: "FUKU-MEETSについて", href: "/about", icon: Info },
  { label: "ランキングについて", href: "/about/ranking", icon: ShieldCheck },
  { label: "利用規約", href: "/terms", icon: Info },
  { label: "プライバシーポリシー", href: "/privacy", icon: ShieldCheck },
];

const contactLinks = [
  { label: "お問い合わせ", href: "/forms/contact", icon: Mail },
  { label: "掲載について", href: "/listing", icon: Store },
  { label: "運営について", href: "/about", icon: Megaphone },
  { label: "よくあるご質問", href: "/forms/contact", icon: CircleHelp },
];

const featureItems = [
  { label: "福岡の魅力を\n発見する", icon: MapPin },
  { label: "人とつながる\nきっかけに", icon: UsersRound },
  { label: "イベントや\n体験に参加", icon: CalendarDays },
  { label: "お気に入りの\nお店を見つける", icon: Store },
];

export default function Footer({ footerLinks }: FooterProps) {
  void footerLinks;

  return (
    <footer className="bg-[#fbfaf7] px-4 pb-28 pt-10">
      <div className="overflow-hidden rounded-[28px] border border-[#eadfd8] bg-white p-6 shadow-soft">
        <div className="absolute" />
        <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#fffaf7_0%,#ffffff_48%,#fff1f1_100%)] p-5">
          <div className="absolute right-5 top-5 grid grid-cols-6 gap-2 opacity-40">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} className="h-1 w-1 rounded-full bg-fuku-red" />
            ))}
          </div>
          <div className="absolute bottom-16 right-2 h-28 w-36 rounded-full bg-[#f8d9d6]/70 blur-sm" />
          <p className="headline-condensed text-[48px] uppercase leading-none text-fuku-black">FUKU-MEETS</p>
          <p className="mt-4 text-[17px] font-black text-fuku-black">福岡のリアルに、会いにいく。</p>
          <div className="mt-5 h-[3px] w-11 rounded-full bg-[#e7a3a5]" />
          <p className="mt-7 text-[14px] font-bold leading-[2] text-fuku-black">
            FUKU-MEETSは、福岡の“好き”を見つけて、
            <br />
            リアルに会いにいく参加型ローカルプラットフォームです。
          </p>

          <div className="mt-8 grid grid-cols-4 text-center">
            {featureItems.map(({ label, icon: Icon }, index) => (
              <div key={label} className={`px-2 ${index > 0 ? "border-l border-dashed border-[#e9b6b7]" : ""}`}>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-fuku-red shadow-soft">
                  <Icon size={25} />
                </span>
                <p className="mt-3 whitespace-pre-line text-[10px] font-black leading-relaxed text-fuku-black">{label}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[20px] border border-[#efcaca] bg-[linear-gradient(90deg,#fff4f4_0%,rgba(255,244,244,.88)_52%,rgba(255,255,255,.2)_100%)] p-5">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(90deg,rgba(255,244,244,.86),rgba(229,36,33,.08)),url('/images/fukuoka-city.jpg')] bg-cover bg-center opacity-90" />
            <div className="relative max-w-[250px]">
              <h3 className="text-[22px] font-black leading-snug text-fuku-red">一緒につくる、福岡の未来。</h3>
              <p className="mt-4 text-[12px] font-bold leading-relaxed text-fuku-black">
                あなたの“好き”が、まちをもっとおもしろくする。さあ、FUKU-MEETSで新しい時間を。
              </p>
              <a
                href="/meet"
                className="mt-5 inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-fuku-red px-6 text-[14px] font-black text-white shadow-[0_12px_28px_rgba(229,36,33,0.22)]"
              >
                今夜のMEETを見る
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 rounded-[22px] border border-[#eadfd8] bg-white p-5 min-[390px]:grid-cols-2">
          <FooterColumn title="ABOUT" links={aboutLinks} />
          <FooterColumn title="CONTACT" links={contactLinks} />
        </div>

        <p className="mt-6 text-center text-[10px] font-bold text-fuku-gray">© FUKU-MEETS All Rights Reserved.</p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; icon: LucideIcon }[];
}) {
  return (
    <div>
      <h3 className="headline-condensed text-[28px] uppercase leading-none text-fuku-black">{title}</h3>
      <div className="mt-2 h-[3px] w-8 rounded-full bg-[#e7a3a5]" />
      <ul className="mt-4 space-y-3">
        {links.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a href={href} className="flex min-h-[34px] items-center gap-3 text-[12px] font-bold text-fuku-black">
              <Icon size={16} className="shrink-0 text-fuku-black/70" />
              <span className="min-w-0 flex-1">{label}</span>
              <ArrowRight size={14} className="shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
