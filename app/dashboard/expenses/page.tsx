export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpensesPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Financial Tracking</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {["Maintenance", "Marketing", "Salaries", "Utilities", "Logistics", "Other"].map((category) => (
          <Card key={category}><CardHeader><CardTitle>{category}</CardTitle></CardHeader><CardContent>Expense category with profitability rollups per product, category, branch, and overall.</CardContent></Card>
        ))}
      </div>
    </div>
  );
}
