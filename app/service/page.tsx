export const dynamic = "force-dynamic";

import { Gauge, ShieldCheck, Wrench } from "lucide-react";
import { ServiceRequestForm } from "@/components/forms/service-request-form";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { visayasMotoHubPageMetadata } from "@/lib/metadata";

export const metadata = visayasMotoHubPageMetadata("Service", "Send PMS, dyno, ECU, diagnostics, and motorcycle service requests to Visayas Moto Hub.");

export default async function ServicePage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const { submitted } = await searchParams;

  return (
    <div className="min-h-screen bg-[#f4eadc] text-black">
      <MarketplaceHeader />
      <main id="main-content" className="mx-auto max-w-7xl bg-[#f4eadc] px-4 py-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] sm:px-6">
        <section className="grid overflow-hidden border border-black/15 bg-[#f7ecdc] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-black/15 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ef5b22]">Visayas Moto Hub Service</p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl">
              Send your motorcycle service request
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
              Request PMS, diagnostics, dyno tuning, ECU remapping, engine repair, tire services, or electrical work. Your request is routed into EngineRus OS for service handling.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="border border-black/15 bg-white p-4"><Wrench className="mb-3 h-6 w-6 text-[#ff5a1f]" /> PMS and repair</div>
              <div className="border border-black/15 bg-white p-4"><Gauge className="mb-3 h-6 w-6 text-[#ff5a1f]" /> Dyno tuning</div>
              <div className="border border-black/15 bg-white p-4"><ShieldCheck className="mb-3 h-6 w-6 text-[#ff5a1f]" /> OS routed</div>
            </div>
          </div>

          <div className="bg-white p-6 lg:p-8">
            {submitted ? (
              <div className="mb-5 border border-[#ff5a1f]/30 bg-[#fff4ec] p-4 text-sm font-semibold text-black">
                Service request sent. EngineRus will review the inquiry in the management system.
              </div>
            ) : null}
            <ServiceRequestForm />
          </div>
        </section>
      </main>
    </div>
  );
}
