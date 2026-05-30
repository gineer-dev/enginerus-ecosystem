import { DashboardChartsDynamic } from "@/components/dashboard/charts-dynamic";
import { ModuleHeader } from "@/components/cards/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleSummaries } from "@/lib/constants/enginerus";

const reportAreas = ["Service analytics", "Inventory analytics", "Customer analytics", "Dyno analytics"];

export default function ReportsPage() {
  const summary = moduleSummaries.reports;
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Export reports" />
      <div className="grid gap-4 md:grid-cols-4">
        {reportAreas.map((area) => (
          <Card key={area} className="border-white/75 bg-white/95">
            <CardHeader>
              <CardTitle>{area}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Ready for Supabase-backed metrics and scheduled management exports.</CardContent>
          </Card>
        ))}
      </div>
      <DashboardChartsDynamic />
    </div>
  );
}
