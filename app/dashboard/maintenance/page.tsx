export const dynamic = "force-dynamic";

import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MaintenancePage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Maintenance Work Orders</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {["Pending", "In Progress", "Completed", "Cancelled"].map((status) => (
          <Card key={status}><CardHeader><CardTitle>{status}</CardTitle></CardHeader><CardContent><Wrench className="mb-3 h-5 w-5 text-primary" />Work order assignments, costs, notes, and attachments.</CardContent></Card>
        ))}
      </div>
    </div>
  );
}
