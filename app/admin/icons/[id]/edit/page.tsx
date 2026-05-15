import { AdminEditPage } from "@/components/admin/AdminResourcePage";

export default async function AdminIconEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditPage kind="icons" mode="edit" id={id} />;
}
