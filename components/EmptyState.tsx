import { Search } from "lucide-react";

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[14px] border border-dashed border-fuku-border bg-white p-6 text-center">
      <Search className="mx-auto text-fuku-red" size={28} />
      <p className="mt-3 text-[13px] font-black text-fuku-black">{message}</p>
    </div>
  );
}
