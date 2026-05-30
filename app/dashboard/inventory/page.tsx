import { AlertTriangle, PackagePlus } from "lucide-react";
import { QuickCreateCard } from "@/components/forms/quick-create-card";
import { SimpleTable } from "@/components/tables/simple-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct } from "@/services/actions";
import { getInventory } from "@/services/operations";

export default async function InventoryPage() {
  const { products, categories, lowStock } = await getInventory();
  return (
    <div className="space-y-6">
      <section className="reference-surface p-6 lg:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Inventory management</p>
        <h1 className="mt-2 text-3xl font-black">Parts, stock movements, suppliers, and low-stock controls</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Product list, add/edit product, stock receiving, transfer, adjustment, count, supplier management, and reorder alerts.</p>
      </section>
      <QuickCreateCard
        title="Product and stock form"
        action={createProduct}
        fields={[
          { name: "sku", label: "SKU", required: true },
          { name: "name", label: "Name", required: true },
          { name: "brand", label: "Brand", required: true },
          { name: "model", label: "Model", required: true, defaultValue: "Universal" },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "acquisition_cost", label: "Acquisition cost", type: "number", defaultValue: 0 },
          { name: "cost_price", label: "Cost price", type: "number", defaultValue: 0 },
          { name: "markup", label: "Markup", type: "number", defaultValue: 0 },
          { name: "selling_price", label: "Selling price", type: "number", defaultValue: 0 },
          { name: "quantity", label: "Quantity", type: "number", defaultValue: 0 },
          { name: "reorder_point", label: "Reorder point", type: "number", defaultValue: 0 },
          { name: "critical_stock_level", label: "Critical stock level", type: "number", defaultValue: 0 },
          { name: "location", label: "Location", defaultValue: "Cebu Main" },
          { name: "status", label: "Status", type: "select", options: ["Draft", "Inspection", "Maintenance", "Ready", "Reserved", "Sold", "Archived"], defaultValue: "Ready", required: true },
          { name: "marketplace_enabled", label: "Marketplace enabled", type: "checkbox" },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {categories.map((category) => (
          <Card key={String(category.name)} className="border-white/75 bg-white/95">
            <CardContent className="flex min-h-24 items-center gap-3 p-4">
              <PackagePlus className="h-5 w-5 text-primary" />
              <p className="text-sm font-bold">{category.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <SimpleTable rows={products} columns={["sku", "name", "category", "brand", "quantity", "reorder_point", "critical_stock_level", "selling_price", "marketplace_enabled"]} />
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800"><AlertTriangle className="h-5 w-5" /> Low stock alerts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-orange-800">
          {lowStock.length ? lowStock.map((product) => (
            <p key={String(product.sku)}>{product.sku}: {product.quantity} on hand, reorder at {product.reorder_point}</p>
          )) : (
            <p>No low stock items.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
