import { adminLogs } from "@/lib/adminData";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTable from "@/components/admin/AdminTable";

export default function AdminLogsPage() {
  return (
    <AdminLayout title="操作ログ">
      <AdminTable
        rows={adminLogs}
        columns={[
          { header: "日時", render: (item) => item.createdAt },
          { header: "管理者", render: (item) => item.adminUserId },
          { header: "操作", render: (item) => item.action },
          { header: "リソース", render: (item) => `${item.resourceType} / ${item.resourceId}` },
          { header: "状態", render: () => <AdminStatusBadge status="done" /> },
        ]}
      />
    </AdminLayout>
  );
}
