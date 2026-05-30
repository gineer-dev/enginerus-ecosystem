export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { FileText, Heart, MessageSquare, ShieldCheck } from "lucide-react";
import { MarketplaceHeader } from "@/components/layout/marketplace-header";
import { ReservationForm } from "@/components/forms/reservation-form";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProduct } from "@/services/catalog";

export default async function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return (
    <>
      <MarketplaceHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="grid h-full place-items-center bg-[#181818] text-5xl font-black uppercase text-white">{product.brand}</div>
              )}
            </div>
            {product.imageUrl ? <div className="mt-4 grid grid-cols-3 gap-3">
              {[product.imageUrl, product.imageUrl, product.imageUrl].map((src, index) => (
                <div key={index} className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                  <Image src={src} alt={`${product.name} gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div> : null}
          </div>
          <aside className="space-y-4">
            <div>
              <Badge className="bg-primary/10 text-primary">{product.status}</Badge>
              <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-3xl font-bold text-primary">
                {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(product.price)}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Link href="/inquiries"><Button className="w-full"><MessageSquare className="h-4 w-4" />Inquire</Button></Link>
              <Link href="/reservations"><Button variant="secondary" className="w-full">Reserve</Button></Link>
              <Button variant="outline"><Heart className="h-4 w-4" />Save</Button>
            </div>
            <Card>
              <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
              <CardContent className="grid gap-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Features and Documents</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {product.features.map((feature) => <p key={feature} className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-primary" />{feature}</p>)}
                <p className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-primary" />Contracts, invoices, certificates, registrations, and ownership records supported.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Card><CardHeader><CardTitle>Send Inquiry</CardTitle></CardHeader><CardContent><InquiryForm productId={product.id} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Reserve Product</CardTitle></CardHeader><CardContent><ReservationForm productId={product.id} /></CardContent></Card>
        </div>
      </main>
    </>
  );
}
