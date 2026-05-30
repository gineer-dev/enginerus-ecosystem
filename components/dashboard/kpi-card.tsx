import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({ label, value, icon: Icon, detail }: { label: string; value: string | number; icon: LucideIcon; detail?: string }) {
  return (
    <Card className="rounded-xl border-[#d17e1d]/30 bg-white/95 shadow-[0_16px_28px_rgba(120,35,36,0.08)]">
      <CardContent className="flex min-h-36 items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
          {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
        </div>
        <div className="soft-control rounded-full border-4 border-black bg-white p-4 text-[#ef6b21]">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
