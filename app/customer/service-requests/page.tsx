export const dynamic = "force-dynamic";

import { CustomerServiceRequestForm } from "@/components/forms/customer-service-request-form";
import { CustomerShell } from "@/components/layout/customer-shell";
import { formatDate, getCustomerServiceRequests, motorcycleName } from "@/services/customer-portal";

export default async function CustomerServiceRequestsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const [{ submitted }, data] = await Promise.all([searchParams, getCustomerServiceRequests()]);

  return (
    <CustomerShell>
      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="border border-[#dfceb3] bg-[#fff8ea] p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5a1f]">Service Tracking</p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl">Requests sent to EngineRus service.</h1>
            <p className="mt-5 text-[#5f5649]">Book PMS, dyno tuning, ECU remapping, diagnostics, and repairs. Advisors and mechanics handle these inside EngineRus OS.</p>
          </div>
          {submitted ? <div className="mt-5 border border-[#dfceb3] bg-white p-4 text-sm font-semibold">Service request submitted. The Dr. Engine R&apos;us team can now process it in the internal system.</div> : null}
          <div className="mt-5 grid gap-4">
            {data.serviceBookings.map((booking) => (
              <div key={booking.id} className="border border-[#dfceb3] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a1f]">{booking.booking_number}</p>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-normal">{booking.service_type}</h2>
                    <p className="mt-1 text-sm text-[#5f5649]">{motorcycleName(booking.motorcycles)} / {formatDate(booking.scheduled_date)}</p>
                  </div>
                  <span className="bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">{booking.status}</span>
                </div>
              </div>
            ))}
            {data.serviceBookings.length === 0 ? <div className="border border-[#dfceb3] bg-white p-5 text-[#5f5649]">No customer service requests yet.</div> : null}
          </div>

          <div className="mt-6 border border-[#dfceb3] bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a1f]">Workshop Status</p>
            <h2 className="text-2xl font-black uppercase tracking-normal">Job order progress</h2>
            <div className="mt-4 grid gap-3">
              {data.jobOrders.map((job) => (
                <div key={job.id} className="grid gap-2 border border-[#dfceb3] p-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="font-black">{job.job_order_number} / {job.service_type}</h3>
                    <p className="text-sm text-[#5f5649]">{motorcycleName(job.motorcycles)} / Target: {formatDate(job.estimated_completion)}</p>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#ff5a1f]">{job.status}</span>
                </div>
              ))}
              {data.jobOrders.length === 0 ? <p className="text-sm text-[#5f5649]">No active job orders linked to your account yet.</p> : null}
            </div>
          </div>
        </div>

        <CustomerServiceRequestForm motorcycles={data.motorcycles} />
      </section>
    </CustomerShell>
  );
}
