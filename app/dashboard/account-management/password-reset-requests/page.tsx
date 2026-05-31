import Link from "next/link";
import { CustomerAccountsTable } from "@/components/tables/customer-accounts-table";
import { Button } from "@/components/ui/button";
import { getCustomerAccountRows } from "@/services/customer-accounts";

export const dynamic = "force-dynamic";

export default async function PasswordResetRequestsPage() {
  const rows = await getCustomerAccountRows({ status: "First Login Pending" });
  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Account Management / Password Reset Requests</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">Password reset queue</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Accounts that currently require temporary-password setup or a reset-created first login cycle.</p>
          </div>
          <Link href="/dashboard/account-management/customer-accounts">
            <Button variant="outline">Manage All Accounts</Button>
          </Link>
        </div>
      </section>
      <CustomerAccountsTable rows={rows} />
    </div>
  );
}
