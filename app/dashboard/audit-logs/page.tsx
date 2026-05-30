export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Audit Trail</h1>
      <Card><CardHeader><CardTitle>Tracked Activities</CardTitle></CardHeader><CardContent>Create, update, delete, status changes, financial activities, login activities, and role changes with IP and JSON value snapshots.</CardContent></Card>
    </div>
  );
}
