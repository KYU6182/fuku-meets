import { ArrowRight, Mail } from "lucide-react";

type FooterLinkGroup = {
  title: string;
  links: string[];
};

type FooterProps = {
  footerLinks: FooterLinkGroup[];
};

const footerHrefMap: Record<string, string> = {
  "FUKU-MEETSについて": "/about",
  "ランキングについて": "/about/ranking",
  "FUKU ICONS": "/about/fuku-icons",
  お問い合わせ: "/forms/contact",
  掲載について: "/listing",
  イベント投稿: "/forms/event-submit",
  店舗推薦: "/forms/shop-recommend",
  ランキングテーマ提案: "/forms/ranking-theme",
  フリーペーパー設置申請: "/forms/paper-placement",
  一般エントリー: "/forms/icon-entry",
  推しを推薦: "/forms/icon-recommend",
  表紙投票: "/icons/cover-vote",
};

export default function Footer({ footerLinks }: FooterProps) {
  return (
    <footer className="bg-[#fbfaf7] px-5 pb-28 pt-9">
      <div className="rounded-t-[18px] border border-fuku-border bg-white px-5 py-7">
        <p className="headline-condensed text-[44px] uppercase leading-none text-fuku-black">
          FUKU-MEETS
        </p>
        <p className="mt-3 text-[13px] font-black tracking-wide text-fuku-black">
          福岡のリアルに、会いにいく。
        </p>
        <p className="mt-7 text-[13px] font-bold leading-[2] text-fuku-black">
          FUKU-MEETSは、福岡の“好き”を見つけて、リアルに会いにいく参加型ローカルプラットフォームです。
        </p>
        <div className="mt-7 h-[92px] rounded-[10px] border border-fuku-border bg-[linear-gradient(180deg,#fff,#f2eee8)]" />
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 border-x border-fuku-border bg-white px-5 py-7">
        {footerLinks.map((group) => (
          <div key={group.title}>
            <h3 className="headline-condensed text-[22px] uppercase leading-none text-fuku-black">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link}>
                  <a href={footerHrefMap[link] ?? "/about"} className="text-[11px] font-bold leading-relaxed text-fuku-gray">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border border-fuku-border bg-white px-5 py-5">
        <a
          href="/forms/newsletter"
          className="grid gap-4 rounded-[16px] border border-[#f5caca] bg-[#fff6f6] p-5 min-[390px]:grid-cols-[auto_1fr_auto] min-[390px]:items-center"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-fuku-red shadow-soft">
            <Mail size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-[16px] font-black leading-tight text-fuku-black">最新情報を受け取る</span>
            <span className="mt-2 block text-[12px] font-bold leading-relaxed text-fuku-gray">
              メールマガジンで、福岡の“いま”をお届け。
            </span>
          </span>
          <span className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-fuku-red px-5 text-[12px] font-black text-white min-[390px]:w-auto">
            登録する
            <ArrowRight size={14} />
          </span>
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-x border-b border-fuku-border bg-white px-5 py-5 text-[10px] font-bold text-fuku-gray">
        <div className="flex gap-4">
          <a href="/terms">利用規約</a>
          <a href="/privacy">プライバシーポリシー</a>
        </div>
        <p>© FUKU-MEETS All Rights Reserved.</p>
      </div>
    </footer>
  );
}
