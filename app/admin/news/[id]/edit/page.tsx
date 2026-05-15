import { AdminEditPage } from "@/components/admin/AdminResourcePage";

export default async function AdminNewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditPage kind="news" mode="edit" id={id} />;
}
