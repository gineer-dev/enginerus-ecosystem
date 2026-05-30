export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/tables/data-table";
import { productColumns } from "@/components/tables/columns";
import { Button } from "@/components/ui/button";
import { products } from "@/constants/sample-data";

export default function ProductsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">CRUD-ready product master records, media, documents, pricing, and lifecycle status.</p>
        </div>
        <Link href="/dashboard/products/new"><Button><Plus className="h-4 w-4" />New Product</Button></Link>
      </div>
      <DataTable columns={productColumns} data={products} />
    </div>
  );
}
