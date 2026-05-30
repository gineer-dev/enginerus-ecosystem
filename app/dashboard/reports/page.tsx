import { DashboardChartsDynamic } from "@/components/dashboard/charts-dynamic";
import { ModuleHeader } from "@/components/cards/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleSummaries } from "@/lib/constants/enginerus";
import { getDashboardChartSeries, getDashboardMetrics } from "@/services/operations";

export default async function ReportsPage() {
  const summary = moduleSummaries.reports;
  const [metrics, chartSeries] = await Promise.all([getDashboardMetrics(), getDashboardChartSeries()]);
  const reportAreas = [
    { title: "Service analytics", detail: `${metrics.activeJobs} active jobs / ${metrics.completedServices} completed services` },
    { title: "Inventory analytics", detail: `${metrics.lowStockItems} low-stock items from live inventory` },
    { title: "Customer analytics", detail: `${metrics.returningCustomers} live customer records` },
    { title: "Dyno analytics", detail: `${metrics.dynoSessions} dyno sessions recorded` },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Export reports" />
      <div className="grid gap-4 md:grid-cols-4">
        {reportAreas.map((area) => (
          <Card key={area.title} className="border-white/75 bg-white/95">
            <CardHeader>
              <CardTitle>{area.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{area.detail}</CardContent>
          </Card>
        ))}
      </div>
      <DashboardChartsDynamic series={chartSeries} />
    </div>
  );
}
