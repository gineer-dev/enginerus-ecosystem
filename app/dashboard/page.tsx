export const dynamic = "force-dynamic";

import { Boxes, CircleDollarSign, Gauge, Handshake, MessageSquare, Percent, TrendingUp, Users, Wrench } from "lucide-react";
import { DashboardChartsDynamic } from "@/components/dashboard/charts-dynamic";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { getDashboardChartSeries, getDashboardMetrics } from "@/services/operations";

const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export default async function DashboardPage() {
  const [metrics, chartSeries] = await Promise.all([getDashboardMetrics(), getDashboardChartSeries()]);
  return (
    <div className="space-y-7">
      <div className="engine-gradient relative overflow-hidden rounded-[20px] border border-[#d17e1d]/45 bg-white px-6 py-7 shadow-[0_18px_30px_rgba(120,35,36,0.10)] lg:grid lg:min-h-[360px] lg:grid-cols-[1fr_440px] lg:px-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="brand-plus text-4xl font-black leading-none">+</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Operations cockpit / Powered by Dynolab</p>
              <p className="brand-wordmark text-xl italic">EngineRus OS</p>
            </div>
          </div>
          <h1 className="mt-8 max-w-2xl text-4xl font-black uppercase leading-[0.98] tracking-normal text-black sm:text-5xl">
            Unleash the power of your service operations
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-bold leading-tight text-black">Dyno-tuned performance. Trusted motorcycle care.</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Service operations, job orders, dyno sessions, customer garage, inventory health, marketplace sync, notifications, and audit visibility in one place.</p>
        </div>
        <div className="dyno-lab-panel relative mt-6 min-h-[260px] border border-white/80 lg:mt-0">
          <div className="dyno-machine" aria-hidden="true">
            <span className="dyno-bay-frame" />
            <span className="dyno-monitor" />
            <span className="dyno-engine" />
            <span className="dyno-floor" />
          </div>
          <div className="absolute right-5 top-5 rounded-lg bg-white/85 px-4 py-2 text-right text-xs font-semibold shadow">
            <p>Powered by <span className="font-black">Dynolab</span></p>
            <p className="text-muted-foreground">Trusted Automotive Care.</p>
          </div>
          <div className="power-quote absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-lg px-5 py-4">
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.16em] text-primary">Revenue Summary</span>
              <span className="text-2xl font-black">{money.format(metrics.revenue)}</span>
            </span>
            <Gauge className="h-9 w-9 text-primary" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Jobs Today" value={metrics.jobsToday} icon={Wrench} detail="Created today" />
        <KpiCard label="Active Jobs" value={metrics.activeJobs} icon={TrendingUp} detail="Queued to approval" />
        <KpiCard label="Completed Services" value={metrics.completedServices} icon={Handshake} detail="Completed or released" />
        <KpiCard label="Average Completion Time" value={metrics.averageCompletionTime} icon={Percent} detail="Calculated from queue timestamps" />
        <KpiCard label="Low Stock Items" value={metrics.lowStockItems} icon={Boxes} detail="At or below reorder point" />
        <KpiCard label="Dyno Sessions" value={metrics.dynoSessions} icon={CircleDollarSign} detail="All sessions" />
        <KpiCard label="Returning Customers" value={metrics.returningCustomers} icon={Users} detail="Customer records" />
        <KpiCard label="Open Notifications" value={metrics.openNotifications} icon={MessageSquare} detail="Unread alerts" />
      </div>
      <DashboardChartsDynamic series={chartSeries} />
    </div>
  );
}
