export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInspectionTemplates } from "@/services/operations";

export default async function InspectionsPage() {
  const templates = await getInspectionTemplates();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Inspection Templates</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={String(template.name)}>
            <CardHeader><CardTitle>{template.name}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{template.description}</CardContent>
          </Card>
        ))}
        {templates.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-sm font-semibold text-muted-foreground lg:col-span-3">
            No live inspection templates yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
