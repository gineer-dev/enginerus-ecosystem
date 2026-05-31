import Link from "next/link";
import { CustomerAccountsTable } from "@/components/tables/customer-accounts-table";
import { Button } from "@/components/ui/button";
import { getCustomerAccountRows } from "@/services/customer-accounts";

export const dynamic = "force-dynamic";

export default async function AccountStatusPage() {
  const rows = await getCustomerAccountRows();
  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Account Management / Status</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">Account status monitor</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Review active, disabled, first-login pending, password-updated, and never-logged-in customer portal accounts.</p>
          </div>
          <Link href="/dashboard/account-management/customer-accounts">
            <Button variant="outline">Open Full Account List</Button>
          </Link>
        </div>
      </section>
      <CustomerAccountsTable rows={rows} />
    </div>
  );
}
