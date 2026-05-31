import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateInternalUserAccount } from "@/services/actions";
import { internalRoles } from "@/services/internal-accounts";

export const dynamic = "force-dynamic";

export default async function EditInternalUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: account, error } = await createAdminClient().from("internal_accounts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!account) notFound();

  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <Link href="/dashboard/account-management/internal-users" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to internal users
        </Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">Account Management / Edit Internal User</p>
        <h1 className="mt-2 text-3xl font-black">Edit {account.full_name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Update profile details, role access, and account status.</p>
      </section>

      <form action={updateInternalUserAccount} className="grid gap-6 rounded-2xl border border-white/75 bg-white/95 p-6 shadow-[0_16px_28px_rgba(52,18,18,0.08)]">
        <input type="hidden" name="id" value={account.id} />
        <section>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">User Information</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              Full Name
              <Input name="full_name" required defaultValue={account.full_name} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Mobile Number
              <Input name="mobile_number" required defaultValue={account.mobile_number ?? ""} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email Address
              <Input name="email" type="email" required defaultValue={account.email} />
            </label>
          </div>
        </section>

        <section className="border-t border-border pt-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Login & Access</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold">
              Username
              <Input name="username" required defaultValue={account.username} />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Assigned Role
              <Select name="role_name" defaultValue={account.role_name}>
                {internalRoles.map((role) => <option key={role}>{role}</option>)}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Account Status
              <Select name="account_status" defaultValue={account.account_status}>
                <option>Active</option>
                <option>Disabled</option>
              </Select>
            </label>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-border pt-6">
          <Button type="submit"><Save className="h-4 w-4" /> Save Changes</Button>
          <Link href="/dashboard/account-management/internal-users">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
