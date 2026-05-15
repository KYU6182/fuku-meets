import { AdminEditPage } from "@/components/admin/AdminResourcePage";

export default async function AdminRankingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditPage kind="rankings" mode="edit" id={id} />;
}
