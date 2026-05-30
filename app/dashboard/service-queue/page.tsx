import { Users, Wrench } from "lucide-react";
import { StatusBadge } from "@/components/cards/status-badge";
import { SimpleTable } from "@/components/tables/simple-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobOrders, getServiceQueue } from "@/services/operations";

const statuses = ["Queued", "In Progress", "Waiting Parts", "For Approval", "Completed"] as const;

export default async function ServiceQueuePage() {
  const [queue, jobs] = await Promise.all([getServiceQueue(), getJobOrders()]);
  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Real-time service queue</p>
        <h1 className="mt-2 text-3xl font-black">Bay and mechanic workload board</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Backed by Supabase service queue rows and ready for Realtime subscriptions.</p>
      </section>
      <div className="grid gap-4 xl:grid-cols-5">
        {statuses.map((status) => {
          const items = queue.filter((item) => item.status === status);
          return (
            <Card key={status} className="border-white/75 bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm">
                  {status}
                  <StatusBadge status={status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.length ? items.map((item) => (
                  <div key={`${item.job_order}-${item.queue_position}`} className="rounded-xl border bg-muted/40 p-3">
                    <p className="font-bold">{item.job_order}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Bay {item.bay_number} / Queue #{item.queue_position}</p>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No jobs in this lane.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <SimpleTable rows={queue} columns={["job_order", "service_type", "bay_number", "queue_position", "priority_level", "assigned_to", "status"]} />
      <div className="grid gap-4 lg:grid-cols-3">
        {jobs.slice(0, 3).map((job) => (
          <Card key={String(job.job_order_number)} className="border-white/75 bg-white/95">
            <CardContent className="flex items-start gap-3 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-accent">
                <Wrench className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">{job.mechanic}</p>
                <p className="text-sm text-muted-foreground">{job.job_order_number} / {job.service_type}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> Workload from active job orders</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
