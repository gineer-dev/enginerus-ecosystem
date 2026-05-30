"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Customer, Inquiry, Product, Reservation } from "@/types/domain";
import { Badge } from "@/components/ui/badge";

const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export const productColumns: ColumnDef<Product>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "name", header: "Product" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "availableQuantity", header: "Available" },
  { accessorKey: "price", header: "Price", cell: ({ row }) => money.format(row.original.price) },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
];

export const customerColumns: ColumnDef<Customer>[] = [
  { accessorKey: "fullName", header: "Customer" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "contactNumber", header: "Contact" },
  { accessorKey: "customerType", header: "Type" },
  { accessorKey: "address", header: "Address" },
];

export const inquiryColumns: ColumnDef<Inquiry>[] = [
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "message", header: "Message" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
  { accessorKey: "createdAt", header: "Created" },
];

export const reservationColumns: ColumnDef<Reservation>[] = [
  { accessorKey: "reservationNumber", header: "Reservation" },
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "fee", header: "Fee", cell: ({ row }) => money.format(row.original.fee) },
  { accessorKey: "expiryDate", header: "Expiry" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.original.status}</Badge> },
];
