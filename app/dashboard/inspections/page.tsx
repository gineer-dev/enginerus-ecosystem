export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const templates = ["Vehicle: engine, transmission, tires, brakes, lights, battery, documents", "Electronics: battery, display, connectivity, camera, ports, charger", "Property: structure, plumbing, electrical, roofing, flooring"];

export default function InspectionsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Inspection Templates</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        {templates.map((template) => <Card key={template}><CardHeader><CardTitle>{template.split(":")[0]}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{template}</CardContent></Card>)}
      </div>
    </div>
  );
}
