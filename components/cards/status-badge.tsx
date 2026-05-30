import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const toneByStatus: Record<string, string> = {
  Pending: "border-[#d6a83d]/40 bg-[#fff7d1] text-[#7b5b00]",
  Queued: "border-[#d6a83d]/40 bg-[#fff7d1] text-[#7b5b00]",
  Confirmed: "border-[#782324]/30 bg-[#782324]/10 text-primary",
  "Checked In": "border-[#782324]/30 bg-[#782324]/10 text-primary",
  "In Progress": "border-blue-200 bg-blue-50 text-blue-700",
  "Waiting Parts": "border-orange-200 bg-orange-50 text-orange-700",
  "For Approval": "border-purple-200 bg-purple-50 text-purple-700",
  Completed: "border-green-200 bg-green-50 text-green-700",
  Released: "border-green-200 bg-green-50 text-green-700",
  Cancelled: "border-red-200 bg-red-50 text-red-700",
  "Report ready": "border-green-200 bg-green-50 text-green-700",
  Archived: "border-slate-200 bg-slate-50 text-slate-700",
  "Due PMS": "border-orange-200 bg-orange-50 text-orange-700",
  Good: "border-green-200 bg-green-50 text-green-700",
  Performance: "border-[#d6a83d]/40 bg-[#fff7d1] text-[#7b5b00]",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return <Badge className={cn("whitespace-nowrap", toneByStatus[status] ?? "border-border bg-muted text-foreground", className)}>{status}</Badge>;
}
