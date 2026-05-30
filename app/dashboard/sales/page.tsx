export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesPage() {
  return <ModulePage title="Sales Orders" cards={["Draft", "Confirmed", "Paid", "Delivered", "Completed"]} />;
}

function ModulePage({ title, cards }: { title: string; cards: string[] }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => <Card key={card}><CardHeader><CardTitle>{card}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">CRUD workflow and Supabase-backed status transitions ready.</CardContent></Card>)}
      </div>
    </div>
  );
}
