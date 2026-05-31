import Link from "next/link";
import { ArrowLeft, KeyRound, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createCustomerPortalAccount } from "@/services/actions";

export const dynamic = "force-dynamic";

export default async function CreateCustomerAccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <Link href="/dashboard/account-management/customer-accounts" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to customer accounts
        </Link>
        <div className="mt-5 flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#fff8e1] text-[#ef6b21]">
            <UserPlus className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Account Management / Create</p>
            <h1 className="mt-2 text-3xl font-black">Create customer portal account</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Creates a linked customer record, Supabase Auth user, temporary password, and mandatory first-time password setup requirement.
            </p>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}

      <form action={createCustomerPortalAccount} className="grid gap-6 rounded-2xl border border-white/75 bg-white/95 p-6 shadow-[0_16px_28px_rgba(52,18,18,0.08)]">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Customer Information</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              Full Name
              <Input name="full_name" required placeholder="Juan Dela Cruz" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Mobile Number
              <Input name="mobile_number" required placeholder="09XXXXXXXXX" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email Address
              <Input name="email" type="email" required placeholder="customer@email.com" />
            </label>
          </div>
        </section>

        <section className="border-t border-border pt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Login Information</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              Username
              <Input name="username" placeholder="Auto-generated if blank" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Temporary Password
              <Input name="temporary_password" placeholder="Auto-generated if blank" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Account Status
              <Select name="account_status" defaultValue="Active">
                <option>Active</option>
                <option>Disabled</option>
              </Select>
            </label>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border bg-[#fff8e1] p-4 text-sm text-muted-foreground">
            <KeyRound className="mt-0.5 h-4 w-4 text-[#ef6b21]" />
            <p>The customer must use the temporary password once, then create a new password before accessing the dashboard.</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button type="submit"><UserPlus className="h-4 w-4" /> Create Customer Account</Button>
          <Link href="/dashboard/account-management/customer-accounts">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
