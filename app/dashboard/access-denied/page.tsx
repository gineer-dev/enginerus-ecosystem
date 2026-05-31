import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-white/75 bg-white/95 p-8 text-center shadow-[0_18px_34px_rgba(52,18,18,0.12)]">
      <ShieldAlert className="mx-auto h-12 w-12 text-[#ef6b21]" />
      <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-primary">Access denied</p>
      <h1 className="mt-2 text-3xl font-black">This module is outside your assigned role.</h1>
      <p className="mt-3 text-sm text-muted-foreground">Ask a Super Admin or Admin to update your role if you need access for your work.</p>
      <Link href="/dashboard">
        <Button className="mt-6">Return to Dashboard</Button>
      </Link>
    </div>
  );
}
