import { Search } from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";

type Row = Record<string, string | number | boolean | null | undefined>;

function labelize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function SimpleTable({ rows, searchable = true, columns: explicitColumns }: { rows: readonly Row[]; searchable?: boolean; columns?: readonly string[] }) {
  const columns = explicitColumns ?? (rows[0] ? Object.keys(rows[0]) : []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/75 bg-white/95 shadow-[0_16px_28px_rgba(52,18,18,0.08)]">
      {searchable ? (
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-lg bg-muted px-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4 text-primary" />
            Search and filter records
          </div>
          <div className="flex gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Export CSV
            <span className="text-border">/</span>
            Filters
          </div>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {labelize(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={index} className="border-t border-border/70 hover:bg-muted/60">
                  {columns.map((column) => {
                    const value = row[column];
                    const text = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value ?? "-");
                    return (
                      <td key={column} className="whitespace-nowrap px-4 py-3">
                        {column.includes("status") || column === "health" ? <StatusBadge status={text} /> : text}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length || 1} className="px-4 py-12 text-center text-muted-foreground">
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
