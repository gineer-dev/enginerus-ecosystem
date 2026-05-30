export const dynamic = "force-dynamic";

import Link from "next/link";
import { CustomerMotorcycleForm } from "@/components/forms/customer-motorcycle-form";
import { CustomerShell } from "@/components/layout/customer-shell";
import { formatDate, getCustomerGarage, motorcycleName } from "@/services/customer-portal";

export default async function CustomerGaragePage() {
  const data = await getCustomerGarage();

  return (
    <CustomerShell>
      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <div className="border border-[#dfceb3] bg-[#fff8ea] p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5a1f]">Customer Garage</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl">Motorcycles under your care.</h1>
            <p className="mt-5 text-[#5f5649]">Add the bikes you own or service with Dr. Engine R&apos;us. Each motorcycle gets its own health record and service history.</p>
          </div>

          <div className="mt-5 grid gap-4">
            {data.motorcycles.map((motorcycle) => {
              const nextSchedule = data.maintenanceSchedules.find((schedule) => schedule.motorcycle_id === motorcycle.id && schedule.status !== "Completed");
              const recordCount = data.healthRecords.filter((record) => record.motorcycle_id === motorcycle.id).length;
              return (
                <Link key={motorcycle.id} href={`/customer/motorcycles/${motorcycle.id}`} className="grid gap-4 border border-[#dfceb3] bg-white p-5 transition hover:border-black md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">{motorcycle.motorcycle_code}</p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-normal">{motorcycleName(motorcycle)}</h2>
                    <p className="mt-2 text-sm text-[#5f5649]">Plate: {motorcycle.plate_number ?? "Not recorded"} / Mileage: {motorcycle.mileage ?? 0} km</p>
                  </div>
                  <div className="grid gap-2 text-sm md:min-w-56">
                    <span className="border border-[#dfceb3] px-3 py-2 font-semibold">Health records: {recordCount}</span>
                    <span className="border border-[#dfceb3] px-3 py-2 font-semibold">Next PMS: {nextSchedule ? formatDate(nextSchedule.due_date) : "Not scheduled"}</span>
                    <span className="bg-black px-3 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-white">Open motorcycle file</span>
                  </div>
                </Link>
              );
            })}
            {data.motorcycles.length === 0 ? (
              <div className="border border-[#dfceb3] bg-white p-5 text-[#5f5649]">Your garage is empty. Add a motorcycle to start tracking PMS and service history.</div>
            ) : null}
          </div>
        </div>

        <CustomerMotorcycleForm />
      </section>
    </CustomerShell>
  );
}
