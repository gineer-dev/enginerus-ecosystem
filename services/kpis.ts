import { inquiries, products, reservations } from "@/constants/sample-data";

export async function getDashboardKpis() {
  const revenue = 6210000;
  const expenses = 1320000;
  const acquisition = products.reduce((sum, product) => sum + product.acquisitionCost, 0);

  return {
    totalInventory: products.reduce((sum, product) => sum + product.quantity, 0),
    availableListings: products.filter((product) => product.status === "Ready").length,
    activeReservations: reservations.filter((reservation) => ["Pending", "Confirmed"].includes(reservation.status)).length,
    salesRevenue: revenue,
    profitMargin: Math.round(((revenue - acquisition - expenses) / revenue) * 100),
    customerCount: 128,
    pendingInquiries: inquiries.filter((inquiry) => inquiry.status === "New").length,
    underMaintenance: products.filter((product) => product.status === "Maintenance").length,
    monthlyRevenue: revenue,
    monthlyExpenses: expenses,
  };
}

export const revenueTrend = [
  { month: "Jan", revenue: 780000, expenses: 320000 },
  { month: "Feb", revenue: 920000, expenses: 360000 },
  { month: "Mar", revenue: 860000, expenses: 310000 },
  { month: "Apr", revenue: 1250000, expenses: 430000 },
  { month: "May", revenue: 1510000, expenses: 470000 },
];

export const lifecycleData = [
  { name: "Ready", value: 42 },
  { name: "Reserved", value: 14 },
  { name: "Maintenance", value: 9 },
  { name: "Inspection", value: 18 },
  { name: "Sold", value: 31 },
];
