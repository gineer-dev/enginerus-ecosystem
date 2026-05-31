import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createInternalUserAccount } from "@/services/actions";
import { internalRoles } from "@/services/internal-accounts";

export const dynamic = "force-dynamic";

export default async function CreateInternalUserPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <Link href="/dashboard/account-management/internal-users" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to internal users
        </Link>
        <div className="mt-5 flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#fff8e1] text-[#ef6b21]">
            <ShieldPlus className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Account Management / Create Internal User</p>
            <h1 className="mt-2 text-3xl font-black">Create EngineRus OS user</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Creates a Supabase Auth login, profile, internal account, role assignment, and mandatory first-time password setup.
            </p>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}

      <form action={createInternalUserAccount} className="grid gap-6 rounded-2xl border border-white/75 bg-white/95 p-6 shadow-[0_16px_28px_rgba(52,18,18,0.08)]">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">User Information</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              Full Name
              <Input name="full_name" required placeholder="EngineRus Staff" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Mobile Number
              <Input name="mobile_number" required placeholder="09XXXXXXXXX" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email Address
              <Input name="email" type="email" required placeholder="staff@drenginerus.ph" />
            </label>
          </div>
        </section>

        <section className="border-t border-border pt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Login & Access</p>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-semibold">
              Username
              <Input name="username" placeholder="Auto-generated if blank" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Temporary Password
              <Input name="temporary_password" placeholder="Auto-generated if blank" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Assigned Role
              <Select name="role_name" defaultValue="Staff">
                {internalRoles.map((role) => <option key={role}>{role}</option>)}
              </Select>
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
            <p>The internal user must use the temporary password once, then create a new password before accessing their role-based dashboard.</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button type="submit"><ShieldPlus className="h-4 w-4" /> Create Internal User</Button>
          <Link href="/dashboard/account-management/internal-users">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
