import type { ReactNode } from "react";

export type AdminTableColumn<T> = {
  header: string;
  render: (item: T) => ReactNode;
};

export default function AdminTable<T>({
  columns,
  rows,
}: {
  columns: AdminTableColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-fuku-border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-fuku-light">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="whitespace-nowrap px-4 py-3 text-[12px] font-black text-fuku-gray">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-fuku-border">
            {rows.map((row, index) => (
              <tr key={index} className="bg-white">
                {columns.map((column) => (
                  <td key={column.header} className="whitespace-nowrap px-4 py-3 text-[13px] font-bold text-fuku-black">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
