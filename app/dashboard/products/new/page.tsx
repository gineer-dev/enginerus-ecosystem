export const dynamic = "force-dynamic";

import { ProductForm } from "@/components/forms/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Product Master Record</CardTitle>
        <p className="text-sm text-muted-foreground">Add inventory with pricing, lifecycle, branch, and future media/document attachments.</p>
      </CardHeader>
      <CardContent><ProductForm /></CardContent>
    </Card>
  );
}
