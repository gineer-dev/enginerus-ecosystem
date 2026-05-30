import { categories, products } from "@/constants/sample-data";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/domain";

type MarketplaceFilters = { category?: string; q?: string };

function filterProducts(items: Product[], filters?: MarketplaceFilters) {
  return items.filter((product) => {
    const matchesCategory = !filters?.category || product.category === filters.category;
    const q = filters?.q?.toLowerCase();
    const matchesQuery = !q || [product.name, product.brand, product.model, product.location, product.condition].join(" ").toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

export async function getMarketplaceProducts(filters?: MarketplaceFilters) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return filterProducts(products, filters);
  }

  const supabase = await createClient();
  const query = supabase.from("products").select("*, categories:category_id(name)").is("deleted_at", null).order("created_at", { ascending: false });
  const { data, error } = await query;

  if (error || !data) return filterProducts(products, filters);
  const mapped = data.map((row) => ({
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.categories?.name ?? row.brand ?? "Motorcycles",
    brand: row.brand ?? "Unbranded",
    model: row.model ?? "N/A",
    condition: "Brand New",
    location: row.location ?? "Visayas Moto Hub Showroom",
    branch: "Cebu",
    status: row.status as never,
    price: Number(row.selling_price ?? 0),
    acquisitionCost: 0,
    quantity: 1,
    availableQuantity: 1,
    reservedQuantity: 0,
    description: row.description ?? "Brand-new motorcycle unit available through Visayas Moto Hub.",
    imageUrl: products[0].imageUrl,
    features: ["Brand new unit", "Warranty processing", "Showroom release"],
    specs: {},
  }));
  return filterProducts(mapped, filters);
}

export async function getMotorcyclesForSale(filters?: Omit<MarketplaceFilters, "category">) {
  const listings = await getMarketplaceProducts(filters);
  return listings.length > 0 ? listings : filterProducts(products, filters);
}

export async function getProduct(productId: string) {
  return products.find((product) => product.id === productId) ?? products[0];
}

export async function getCategories() {
  return categories;
}
