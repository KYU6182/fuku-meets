import { Crown, Home, Newspaper, Search, User } from "lucide-react";

type BottomNavActive = "home" | "ranking" | "news" | "search" | "mypage";

const tabs = [
  { id: "home", label: "HOME", href: "/", icon: Home },
  { id: "ranking", label: "RANKING", href: "/ranking", icon: Crown },
  { id: "news", label: "NEWS", href: "/news", icon: Newspaper },
  { id: "search", label: "SEARCH", href: "/search", icon: Search },
  { id: "mypage", label: "MY PAGE", href: "/mypage", icon: User },
];

export default function BottomNav({ active = "home" }: { active?: BottomNavActive }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-fuku-border bg-white/[0.96] px-3 pb-4 pt-2 shadow-[0_-12px_30px_rgba(17,17,17,0.08)] backdrop-blur"
      aria-label="Bottom navigation"
    >
      <div className="grid grid-cols-5">
        {tabs.map(({ id, label, href, icon: Icon }) => {
          const isActive = id === active;

          return (
          <a
            key={label}
            href={href}
            className={`flex min-h-[56px] flex-col items-center justify-center gap-1 text-[9px] font-black tracking-wide ${
              isActive ? "text-fuku-red" : "text-fuku-black"
            }`}
          >
            <Icon size={23} strokeWidth={isActive ? 2.8 : 2} />
            <span>{label}</span>
          </a>
          );
        })}
      </div>
      <div className="mx-auto mt-1 h-1 w-28 rounded-full bg-fuku-black" />
    </nav>
  );
}
