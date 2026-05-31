import Link from "next/link";
import { cookies } from "next/headers";
import { KeyRound, Plus, UserCheck, UserRoundX } from "lucide-react";
import { CustomerAccountsTable } from "@/components/tables/customer-accounts-table";
import { Button } from "@/components/ui/button";
import { getCustomerAccountMetrics, getCustomerAccountRows } from "@/services/customer-accounts";

export const dynamic = "force-dynamic";

const filters = ["All", "Active", "Disabled", "First Login Pending", "Password Updated", "Never Logged In"];

export default async function CustomerAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; created?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const credentialFlash = cookieStore.get("customer_account_credentials")?.value;
  let credentials: { type: "created" | "reset"; username?: string; temporaryPassword: string } | null = null;
  try {
    credentials = credentialFlash ? JSON.parse(credentialFlash) : null;
  } catch {
    credentials = null;
  }
  const status = params.status && params.status !== "All" ? params.status : undefined;
  const [rows, metrics] = await Promise.all([getCustomerAccountRows({ status, q: params.q }), getCustomerAccountMetrics()]);

  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Account Management / Customer Accounts</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">Customer portal account control</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Create customer login access, enforce first-time password setup, reset temporary passwords, and track login readiness.
            </p>
          </div>
          <Link href="/dashboard/account-management/create-customer-account">
            <Button><Plus className="h-4 w-4" /> Create Customer Account</Button>
          </Link>
        </div>
      </section>

      {credentials?.temporaryPassword ? (
        <div className="rounded-2xl border border-[#d17e1d]/50 bg-[#fff8e1] p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {credentials.type === "created" ? "Customer account created" : "Temporary password reset"}
          </p>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Provide these credentials to the customer. The password must be changed on first login.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {credentials.username ? <Credential label="Username" value={credentials.username} /> : null}
            <Credential label="Temporary Password" value={credentials.temporaryPassword} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total Accounts" value={metrics.total} icon={UserCheck} />
        <Metric label="Active" value={metrics.active} icon={UserCheck} />
        <Metric label="Disabled" value={metrics.disabled} icon={UserRoundX} />
        <Metric label="First Login Pending" value={metrics.pendingFirstLogin} icon={KeyRound} />
        <Metric label="Never Logged In" value={metrics.neverLoggedIn} icon={KeyRound} />
      </div>

      <form className="grid gap-3 rounded-2xl border border-white/75 bg-white/95 p-4 lg:grid-cols-[1fr_auto_auto]">
        <input
          className="h-11 rounded-lg border bg-muted px-3 text-sm"
          name="q"
          placeholder="Search name, email, mobile, username, customer number"
          defaultValue={params.q ?? ""}
        />
        <select className="h-11 rounded-lg border bg-muted px-3 text-sm font-semibold" name="status" defaultValue={params.status ?? "All"}>
          {filters.map((filter) => <option key={filter}>{filter}</option>)}
        </select>
        <Button type="submit" variant="outline">Apply Filters</Button>
      </form>

      <CustomerAccountsTable rows={rows} />
    </div>
  );
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-lg font-black">{value}</p>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof UserCheck }) {
  return (
    <div className="rounded-2xl border border-white/75 bg-white/95 p-5">
      <Icon className="h-5 w-5 text-[#ef6b21]" />
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </div>
  );
}
