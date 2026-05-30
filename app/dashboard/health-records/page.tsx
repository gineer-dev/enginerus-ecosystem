import { Calendar, FileText, Gauge } from "lucide-react";
import { ModuleHeader } from "@/components/cards/module-header";
import { StatusBadge } from "@/components/cards/status-badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { maintenanceTypes, moduleSummaries } from "@/lib/constants/enginerus";
import { getHealthRecords } from "@/services/operations";

export default async function HealthRecordsPage() {
  const summary = moduleSummaries["health-records"];
  const records = await getHealthRecords();
  return (
    <div className="space-y-6">
      <ModuleHeader {...summary} primaryAction="Add health record" />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/75 bg-white/95">
          <CardHeader>
            <CardTitle>Motorcycle timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {records.length ? records.slice(0, 8).map((event) => (
              <div key={`${event.service_date}-${event.title}`} className="grid gap-3 rounded-xl border bg-muted/40 p-4 sm:grid-cols-[150px_1fr]">
                <div>
                  <StatusBadge status={String(event.record_type)} />
                  <p className="mt-2 text-xs text-muted-foreground">{event.service_date}</p>
                </div>
                <div>
                  <p className="font-bold">{event.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{event.mileage} / {event.technician}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No motorcycle health records yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-white/75 bg-white/95">
          <CardHeader>
            <CardTitle>Maintenance schedule types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenanceTypes.slice(0, 5).map((type, index) => (
              <div key={type} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {index % 2 === 0 ? <Calendar className="h-4 w-4 text-primary" /> : <Gauge className="h-4 w-4 text-primary" />}
                  {type}
                </span>
                <span className="text-xs text-muted-foreground">Tracked</span>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              <FileText className="mb-2 h-5 w-5 text-primary" />
              Attachments, ECU files, dyno graphs, and service PDFs connect through Supabase Storage buckets.
            </div>
          </CardContent>
        </Card>
      </div>
      <SimpleTable rows={records} columns={["motorcycle", "record_type", "title", "mileage", "technician", "service_date"]} />
    </div>
  );
}
