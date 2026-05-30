export const dynamic = "force-dynamic";

import Link from "next/link";
import { CalendarClock, Gauge, HeartPulse, History, Settings2, Wrench } from "lucide-react";
import { CustomerShell } from "@/components/layout/customer-shell";
import { formatDate, getCustomerMotorcycleDetail, motorcycleName } from "@/services/customer-portal";

export default async function CustomerMotorcyclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCustomerMotorcycleDetail(id);
  const lastHealth = data.healthRecords[0];
  const nextPms = data.maintenanceSchedules.find((schedule) => schedule.status !== "Completed");
  const lastDyno = data.dynoSessions[0];
  const lastEcu = data.ecuMaps[0];

  const summary = [
    { label: "Health records", value: data.healthRecords.length, icon: HeartPulse },
    { label: "Service bookings", value: data.serviceBookings.length, icon: Wrench },
    { label: "Maintenance tasks", value: data.maintenanceSchedules.length, icon: CalendarClock },
    { label: "Dyno sessions", value: data.dynoSessions.length, icon: Gauge },
    { label: "ECU maps", value: data.ecuMaps.length, icon: Settings2 },
    { label: "Job orders", value: data.jobOrders.length, icon: History },
  ];

  return (
    <CustomerShell>
      <section className="mt-6 border border-[#dfceb3] bg-[#fff8ea] p-6">
        <Link href="/customer/my-garage" className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Back to garage</Link>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5a1f]">{data.motorcycle.motorcycle_code}</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl">{motorcycleName(data.motorcycle)}</h1>
            <p className="mt-5 text-[#5f5649]">
              Plate {data.motorcycle.plate_number ?? "not recorded"} / Engine {data.motorcycle.engine_number ?? "not recorded"} / Chassis {data.motorcycle.chassis_number ?? "not recorded"}
            </p>
          </div>
          <div className="grid gap-3">
            <div className="border border-[#dfceb3] bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5f5649]">Next PMS</p>
              <p className="mt-2 text-2xl font-black">{nextPms ? formatDate(nextPms.due_date) : "Not scheduled"}</p>
            </div>
            <div className="border border-[#dfceb3] bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5f5649]">Last service health entry</p>
              <p className="mt-2 text-2xl font-black">{lastHealth ? lastHealth.title : "No records yet"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="border border-[#dfceb3] bg-white p-5">
              <Icon className="h-6 w-6 text-[#ff5a1f]" />
              <p className="mt-5 text-4xl font-black">{item.value}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5f5649]">{item.label}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecordPanel title="Motorcycle Health Records" rows={data.healthRecords} empty="No health records have been logged yet." />
        <RecordPanel title="Maintenance and PMS" rows={data.maintenanceSchedules} empty="No PMS reminders have been scheduled yet." />
        <RecordPanel title="Service History" rows={data.jobOrders} empty="No job orders are linked yet." />
        <RecordPanel title="Service Requests" rows={data.serviceBookings} empty="No bookings are linked yet." />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-[#dfceb3] bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Dyno History</p>
          <h2 className="text-2xl font-black uppercase tracking-normal">Last dyno result</h2>
          <p className="mt-4 text-[#5f5649]">{lastDyno ? `${lastDyno.session_number} / ${lastDyno.dyno_type} / ${formatDate(lastDyno.session_date)}` : "No dyno sessions recorded yet."}</p>
        </div>
        <div className="border border-[#dfceb3] bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">ECU History</p>
          <h2 className="text-2xl font-black uppercase tracking-normal">Last ECU map</h2>
          <p className="mt-4 text-[#5f5649]">{lastEcu ? `${lastEcu.map_version ?? "Map"} / ${lastEcu.map_type ?? "Tune"} / ${formatDate(lastEcu.created_at)}` : "No ECU maps recorded yet."}</p>
        </div>
      </section>
    </CustomerShell>
  );
}

function valueText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

function RecordPanel({ title, rows, empty }: { title: string; rows: Record<string, unknown>[]; empty: string }) {
  return (
    <div className="border border-[#dfceb3] bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">History</p>
      <h2 className="text-2xl font-black uppercase tracking-normal">{title}</h2>
      <div className="mt-4 grid gap-3">
        {rows.slice(0, 6).map((row, index) => (
          <div key={valueText(row.id) ?? `${title}-${index}`} className="border border-[#dfceb3] p-4">
            <h3 className="font-black">
              {valueText(row.title) ?? valueText(row.maintenance_type) ?? valueText(row.service_type) ?? valueText(row.job_order_number) ?? valueText(row.booking_number)}
            </h3>
            <p className="mt-1 text-sm text-[#5f5649]">{valueText(row.description) ?? valueText(row.notes) ?? valueText(row.status) ?? "Recorded in EngineRus OS"}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#ff5a1f]">
              {formatDate(valueText(row.service_date) ?? valueText(row.due_date) ?? valueText(row.scheduled_date) ?? valueText(row.created_at))}
            </p>
          </div>
        ))}
        {rows.length === 0 ? <p className="text-sm text-[#5f5649]">{empty}</p> : null}
      </div>
    </div>
  );
}
