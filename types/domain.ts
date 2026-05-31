export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Staff"
  | "Administrator"
  | "Service Advisor"
  | "Mechanic"
  | "Dyno Technician"
  | "Inventory Personnel"
  | "Management";

export type JobOrderStatus =
  | "Pending"
  | "Queued"
  | "In Progress"
  | "Waiting Parts"
  | "For Approval"
  | "Completed"
  | "Released"
  | "Cancelled";

export type ProductStatus = "Draft" | "Inspection" | "Maintenance" | "Ready" | "Reserved" | "Sold" | "Archived";
export type ReservationStatus = "Pending" | "Confirmed" | "Expired" | "Cancelled" | "Converted To Sale";
export type WorkOrderStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
export type SalesOrderStatus = "Draft" | "Confirmed" | "Paid" | "Delivered" | "Completed";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  location: string;
  branch: string;
  status: ProductStatus;
  price: number;
  acquisitionCost: number;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  description: string;
  imageUrl: string;
  features: string[];
  specs: Record<string, string>;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  customerType: string;
  address: string;
};

export type Inquiry = {
  id: string;
  productId: string;
  customerName: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
  message: string;
  createdAt: string;
};

export type Reservation = {
  id: string;
  reservationNumber: string;
  productId: string;
  customerName: string;
  fee: number;
  expiryDate: string;
  status: ReservationStatus;
};
