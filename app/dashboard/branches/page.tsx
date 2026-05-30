export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BranchesPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Multi-Branch Management</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {["North EDSA", "Makati Central", "Cebu"].map((branch) => <Card key={branch}><CardHeader><CardTitle>{branch}</CardTitle></CardHeader><CardContent>Inventory, sales, users, manager, and branch-scoped reports.</CardContent></Card>)}
      </div>
    </div>
  );
}
