import { AlertTriangle } from "lucide-react";
import { adminForms, adminIcons, adminLogs, adminNews, adminRankings, adminShops } from "@/lib/adminData";
import AdminCard from "@/components/admin/AdminCard";
import AdminLayout from "@/components/admin/AdminLayout";

const metrics = [
  ["今日の投票数", "1,284"],
  ["未承認フォーム", adminForms.filter((item) => item.status === "new").length],
  ["公開中NEWS", adminNews.length],
  ["公開中店舗", adminShops.filter((item) => item.status === "published").length],
  ["ランキング数", adminRankings.length],
  ["FUKU ICONS掲載数", adminIcons.length],
  ["未承認FUKU ICONSエントリー", 3],
  ["フリーペーパー設置申請", 6],
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([title, value]) => <AdminCard key={title} title={String(title)} value={value} />)}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <AdminCard title="最近の操作ログ">
          <div className="mt-3 space-y-3">
            {adminLogs.map((log) => (
              <div key={log.id} className="rounded-[10px] bg-fuku-light p-3">
                <p className="text-[13px] font-black">{log.action}</p>
                <p className="mt-1 text-[11px] font-bold text-fuku-gray">{log.createdAt}</p>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="未対応タスク">
          <div className="mt-3 grid gap-3">
            {["未承認店舗", "未承認イベント", "未返信お問い合わせ", "画像未設定の記事"].map((task) => (
              <div key={task} className="flex items-center gap-3 rounded-[10px] border border-fuku-border bg-white p-3">
                <AlertTriangle size={18} className="text-fuku-red" />
                <span className="text-[13px] font-black">{task}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
