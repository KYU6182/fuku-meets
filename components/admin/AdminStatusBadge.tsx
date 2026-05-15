import type { AdminStatus } from "@/types/admin";

const styles: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  private: "bg-zinc-100 text-zinc-700 border-zinc-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  new: "bg-[#fff1f1] text-fuku-red border-[#f5caca]",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  archived: "bg-zinc-100 text-zinc-500 border-zinc-200",
  done: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function AdminStatusBadge({ status }: { status: AdminStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${styles[status] ?? styles.draft}`}>
      {status}
    </span>
  );
}
