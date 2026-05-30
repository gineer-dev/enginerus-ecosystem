export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          brand: string | null;
          model: string | null;
          description: string | null;
          selling_price: number;
          status: string;
          branch_id: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & { sku: string; name: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      categories: {
        Row: { id: string; name: string; slug: string; parent_id: string | null; created_at: string };
        Insert: { id?: string; name: string; slug: string; parent_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      reservations: {
        Row: { id: string; reservation_number: string; product_id: string; customer_id: string | null; status: string; reservation_fee: number; expiry_date: string | null; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["reservations"]["Row"]> & { product_id: string };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Row"]>;
      };
      inquiries: {
        Row: { id: string; product_id: string | null; customer_id: string | null; status: string; message: string; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["inquiries"]["Row"]> & { message: string };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
      };
      customers: {
        Row: {
          id: string;
          customer_id: string | null;
          full_name: string;
          email: string | null;
          contact_number: string | null;
          address: string | null;
          customer_type: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["customers"]["Row"]> & { full_name: string };
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
