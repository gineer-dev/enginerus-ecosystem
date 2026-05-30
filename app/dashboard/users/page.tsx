export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Users and Roles</h1>
      <Card><CardHeader><CardTitle>RBAC</CardTitle></CardHeader><CardContent>Manage customer, sales staff, inventory manager, maintenance staff, finance staff, and administrator assignments.</CardContent></Card>
    </div>
  );
}
