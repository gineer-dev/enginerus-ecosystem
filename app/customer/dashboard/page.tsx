export const dynamic = "force-dynamic";

import Link from "next/link";
import { Bike, CalendarClock, Gauge, HeartPulse, History, Wrench } from "lucide-react";
import { CustomerShell } from "@/components/layout/customer-shell";
import { CustomerServiceRequestForm } from "@/components/forms/customer-service-request-form";
import { formatDate, getCustomerPortalDashboard, motorcycleName } from "@/services/customer-portal";

export default async function CustomerDashboardPage() {
  const data = await getCustomerPortalDashboard();

  const stats = [
    { label: "Motorcycles", value: data.metrics.motorcycles, icon: Bike },
    { label: "Upcoming PMS", value: data.metrics.upcomingPms, icon: CalendarClock },
    { label: "Active Requests", value: data.metrics.activeRequests, icon: Wrench },
    { label: "Active Jobs", value: data.metrics.activeJobs, icon: Gauge },
    { label: "Completed Services", value: data.metrics.completedServices, icon: HeartPulse },
    { label: "Dyno Sessions", value: data.metrics.dynoSessions, icon: History },
  ];

  return (
    <CustomerShell>
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#dfceb3] bg-[#fff8ea] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5a1f]">Owner Dashboard</p>
          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl">
            Motorcycle care, all in one file.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5649]">
            Welcome back, {data.customer.full_name}. This portal tracks your Dr. Engine R&apos;us garage, PMS reminders, active service status,
            dyno sessions, ECU maps, and maintenance history.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {data.notifications.length > 0 ? data.notifications.slice(0, 3).map((notification) => (
            <div key={`${notification.title}-${notification.body}`} className="border border-[#dfceb3] bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">Notification</p>
              <h2 className="mt-2 text-xl font-black">{notification.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f5649]">{notification.body}</p>
            </div>
          )) : (
            <div className="border border-[#dfceb3] bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">Notification</p>
              <h2 className="mt-2 text-xl font-black">No urgent service alerts</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f5649]">Add your motorcycle and book service to begin building its health record.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-[#dfceb3] bg-white p-5">
              <Icon className="h-6 w-6 text-[#ff5a1f]" />
              <p className="mt-5 text-4xl font-black">{stat.value}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5f5649]">{stat.label}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="border border-[#dfceb3] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Garage</p>
              <h2 className="text-2xl font-black uppercase tracking-normal">Owned motorcycles</h2>
            </div>
            <Link href="/customer/my-garage" className="text-xs font-black uppercase tracking-[0.16em] hover:text-[#ff5a1f]">Manage</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {data.motorcycles.slice(0, 4).map((motorcycle) => (
              <Link key={motorcycle.id} href={`/customer/motorcycles/${motorcycle.id}`} className="grid gap-2 border border-[#dfceb3] p-4 transition hover:border-black sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-xl font-black uppercase">{motorcycleName(motorcycle)}</h3>
                  <p className="text-sm text-[#5f5649]">{motorcycle.plate_number ?? "No plate recorded"} / {motorcycle.mileage ?? 0} km</p>
                </div>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">Open File</span>
              </Link>
            ))}
            {data.motorcycles.length === 0 ? <p className="border border-[#dfceb3] p-4 text-sm text-[#5f5649]">No motorcycles added yet.</p> : null}
          </div>
        </div>

        <CustomerServiceRequestForm motorcycles={data.motorcycles} />
      </section>

      <section className="mt-6 border border-[#dfceb3] bg-white p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">PMS and Maintenance</p>
        <h2 className="text-2xl font-black uppercase tracking-normal">Upcoming reminders</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {data.maintenanceSchedules.slice(0, 6).map((schedule) => (
            <div key={schedule.id} className="border border-[#dfceb3] p-4">
              <h3 className="font-black">{schedule.maintenance_type}</h3>
              <p className="mt-1 text-sm text-[#5f5649]">{motorcycleName(schedule.motorcycles)}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#ff5a1f]">{formatDate(schedule.due_date)} / {schedule.status}</p>
            </div>
          ))}
          {data.maintenanceSchedules.length === 0 ? <p className="text-sm text-[#5f5649]">No PMS reminders have been scheduled yet.</p> : null}
        </div>
      </section>
    </CustomerShell>
  );
}
