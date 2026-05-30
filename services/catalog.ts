import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Inquiry, Product, Reservation, ReservationStatus } from "@/types/domain";

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  acquisition_cost: number | string | null;
  selling_price: number | string | null;
  quantity: number | null;
  available_quantity: number | null;
  reserved_quantity: number | null;
  location: string | null;
  status: Product["status"];
  marketplace_enabled: boolean | null;
  categories?: { name: string | null } | null;
  product_media?: { bucket: string; path: string; sort_order: number | null }[] | null;
};

export type MarketplaceFilters = {
  category?: string;
  q?: string;
  brand?: string;
  status?: string;
  location?: string;
};

function valueText(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function numberValue(value: unknown) {
  return Number(value ?? 0);
}

function relatedOne<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getImageUrl(row: ProductRow) {
  const media = [...(row.product_media ?? [])].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))[0];
  if (!media?.path) return "";
  if (media.path.startsWith("http")) return media.path;
  return createAdminClient().storage.from(media.bucket).getPublicUrl(media.path).data.publicUrl;
}

function mapProduct(row: ProductRow): Product {
  const category = row.categories?.name ?? row.brand ?? "Motorcycles";
  const brand = valueText(row.brand, "Unbranded");
  const model = valueText(row.model, "N/A");
  const quantity = numberValue(row.quantity);
  const availableQuantity = numberValue(row.available_quantity);
  const reservedQuantity = numberValue(row.reserved_quantity);

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category,
    brand,
    model,
    condition: "Brand New",
    location: row.location ?? "Dr. Engine R'us Showroom",
    branch: "Cebu",
    status: row.status,
    price: numberValue(row.selling_price),
    acquisitionCost: numberValue(row.acquisition_cost),
    quantity,
    availableQuantity,
    reservedQuantity,
    description: row.description ?? "Brand-new motorcycle unit managed in EngineRus OS.",
    imageUrl: getImageUrl(row),
    features: ["Brand new unit", "Warranty processing", "Showroom release"],
    specs: {
      Engine: model,
      Power: "See unit record",
      Gearbox: "See unit record",
    },
  };
}

function applyFilters(items: Product[], filters?: MarketplaceFilters) {
  return items.filter((product) => {
    const q = filters?.q?.trim().toLowerCase();
    const matchesQuery = !q || [product.name, product.brand, product.model, product.location, product.category, product.status].join(" ").toLowerCase().includes(q);
    const matchesCategory = !filters?.category || product.category === filters.category;
    const matchesBrand = !filters?.brand || product.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesStatus = !filters?.status || product.status === filters.status;
    const matchesLocation = !filters?.location || product.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesQuery && matchesCategory && matchesBrand && matchesStatus && matchesLocation;
  });
}

async function listProducts() {
  const { data, error } = await createAdminClient()
    .from("products")
    .select("*, categories:category_id(name), product_media(bucket, path, sort_order)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function getMarketplaceProducts(filters?: MarketplaceFilters) {
  const products = await listProducts();
  return applyFilters(products.filter((product) => product.status !== "Archived"), filters);
}

export async function getMotorcyclesForSale(filters?: MarketplaceFilters) {
  const products = await getMarketplaceProducts(filters);
  return products.filter((product) => product.condition === "Brand New");
}

export async function getProduct(productId: string) {
  const products = await listProducts();
  const product = products.find((item) => item.id === productId);
  if (!product) notFound();
  return product;
}

export async function getCategories() {
  const { data, error } = await createAdminClient().from("categories").select("name").is("deleted_at", null).order("name");
  if (error) throw new Error(error.message);

  const categoryNames = (data ?? []).map((category) => category.name).filter((name): name is string => Boolean(name));
  if (categoryNames.length > 0) return categoryNames;

  const products = await listProducts();
  return Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort();
}

export async function getProductOptions() {
  const products = await listProducts();
  return products.map((product) => ({ id: product.id, name: product.name }));
}

export async function getFavoriteProducts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await createAdminClient()
    .from("favorites")
    .select("products(*, categories:category_id(name), product_media(bucket, path, sort_order))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((favorite) => relatedOne(favorite.products))
    .filter(Boolean)
    .map((row) => mapProduct(row as unknown as ProductRow));
}

export async function getDashboardProducts() {
  return listProducts();
}

export async function getDashboardInquiries(): Promise<Inquiry[]> {
  const { data, error } = await createAdminClient()
    .from("inquiries")
    .select("id, product_id, full_name, email, message, status, created_at, customers(full_name, email)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id ?? "",
    customerName: row.full_name ?? relatedOne(row.customers)?.full_name ?? "Customer",
    email: row.email ?? relatedOne(row.customers)?.email ?? "",
    status: row.status ?? "New",
    message: row.message,
    createdAt: row.created_at ? new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(row.created_at)) : "",
  }));
}

export async function getDashboardReservations(): Promise<Reservation[]> {
  const { data, error } = await createAdminClient()
    .from("reservations")
    .select("id, reservation_number, product_id, reservation_fee, expiry_date, status, created_at, customers(full_name, email)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    reservationNumber: row.reservation_number,
    productId: row.product_id,
    customerName: relatedOne(row.customers)?.full_name ?? relatedOne(row.customers)?.email ?? "Customer",
    fee: numberValue(row.reservation_fee),
    expiryDate: row.expiry_date ? new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(row.expiry_date)) : "",
    status: row.status as ReservationStatus,
  }));
}
