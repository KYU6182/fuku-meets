import { Edit, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getShopGuides } from "@/lib/shopGuides";

export default function AdminShopGuidesPage() {
  const guides = getShopGuides();

  return (
    <AdminLayout title="ショップガイド管理">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-black uppercase tracking-widest text-fuku-red">Visitor / Shop Guides</p>
          <h2 className="mt-1 text-[28px] font-black text-fuku-black">ショップガイド一覧</h2>
          <p className="mt-1 text-[13px] font-bold text-fuku-gray">
            店まとめや遠征ガイドは、NEWS管理で記事タイプを shop_guide / visitor_guide にして作成・編集します。
          </p>
        </div>
        <a href="/admin/news/new" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fuku-red px-5 text-[13px] font-black text-white">
          <Plus size={16} />
          ガイド記事を作成
        </a>
      </div>

      <div className="grid gap-3">
        {guides.map((guide) => (
          <article key={guide.slug} className="rounded-[14px] border border-fuku-border bg-white p-4 shadow-soft">
            <div className="flex gap-4">
              <div className="h-24 w-32 shrink-0 rounded-[12px] bg-fuku-light bg-cover bg-center" style={{ backgroundImage: `url('${guide.image}')` }} />
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[10px] font-black text-fuku-red">{guide.category}</span>
                <h3 className="mt-3 text-[18px] font-black text-fuku-black">{guide.title}</h3>
                <p className="mt-1 text-[12px] font-bold text-fuku-gray">{guide.slug}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/shop-guides/${guide.slug}`} className="rounded-full border border-fuku-border px-3 py-2 text-[11px] font-black text-fuku-black">
                    公開ページ
                  </a>
                  <a href="/admin/news/new" className="inline-flex items-center gap-1 rounded-full bg-fuku-black px-3 py-2 text-[11px] font-black text-white">
                    <Edit size={13} />
                    NEWS管理で編集
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}
