import { AdminEditPage } from "@/components/admin/AdminResourcePage";

export default async function AdminShopEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditPage kind="shops" mode="edit" id={id} />;
}
