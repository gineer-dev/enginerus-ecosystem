import { RotateCcw, Send, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resetCustomerPortalPassword, resendCustomerCredentials, updateCustomerAccountStatus } from "@/services/actions";

type CustomerAccountRow = {
  id: string;
  customer_id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  username: string;
  account_status: string;
  first_login_status: string;
  date_created: string;
  last_login: string;
};

function tone(status: string) {
  if (status === "Active" || status === "Password Updated") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Disabled") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export function CustomerAccountsTable({ rows }: { rows: CustomerAccountRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/75 bg-white/95 shadow-[0_16px_28px_rgba(52,18,18,0.08)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              {["Customer ID", "Full Name", "Email", "Mobile", "Username", "Status", "First Login", "Created", "Last Login", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border/70 align-top hover:bg-muted/50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">{row.customer_id}</td>
                  <td className="whitespace-nowrap px-4 py-3">{row.full_name}</td>
                  <td className="whitespace-nowrap px-4 py-3">{row.email}</td>
                  <td className="whitespace-nowrap px-4 py-3">{row.mobile_number}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{row.username}</td>
                  <td className="whitespace-nowrap px-4 py-3"><Badge className={tone(row.account_status)}>{row.account_status}</Badge></td>
                  <td className="whitespace-nowrap px-4 py-3"><Badge className={tone(row.first_login_status)}>{row.first_login_status}</Badge></td>
                  <td className="whitespace-nowrap px-4 py-3">{row.date_created}</td>
                  <td className="whitespace-nowrap px-4 py-3">{row.last_login}</td>
                  <td className="min-w-72 px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={updateCustomerAccountStatus}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="account_status" value={row.account_status === "Active" ? "Disabled" : "Active"} />
                        <Button variant="outline" className="h-9 px-3 text-xs">
                          {row.account_status === "Active" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                          {row.account_status === "Active" ? "Disable" : "Enable"}
                        </Button>
                      </form>
                      <form action={resetCustomerPortalPassword}>
                        <input type="hidden" name="id" value={row.id} />
                        <Button variant="outline" className="h-9 px-3 text-xs">
                          <RotateCcw className="h-4 w-4" /> Reset
                        </Button>
                      </form>
                      <form action={resendCustomerCredentials}>
                        <input type="hidden" name="id" value={row.id} />
                        <Button variant="outline" className="h-9 px-3 text-xs">
                          <Send className="h-4 w-4" /> Resend
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">No customer portal accounts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
