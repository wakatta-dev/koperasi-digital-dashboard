/** @format */

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupportOperationalSettings } from "@/hooks/queries";
import { VendorPageHeader } from "../VendorPageHeader";
import { VENDOR_ROUTES } from "../../constants/routes";
import { getVendorProductCatalog } from "../../constants/product-catalog";

function productStatusBadgeClass(status: string) {
  if (status === "active") {
    return "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (status === "configured") {
    return "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  }
  return "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export function VendorProductsPage() {
  const operationalQuery = useSupportOperationalSettings();
  const products = getVendorProductCatalog(operationalQuery.data);

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Products"
        description="Katalog baseline layanan SaaS yang saat ini bisa dipetakan dari operational modules dan capability platform yang sudah tersedia."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {products.map((product) => (
          <Card key={product.code} className="border-border/70">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{product.summary}</p>
                </div>
                <Badge className={productStatusBadgeClass(product.status)}>
                  {product.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{product.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Billing Cycle
                  </div>
                  <div className="mt-1 font-medium">{product.billing_cycle}</div>
                </div>
                <div className="rounded-lg border px-4 py-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Audience
                  </div>
                  <div className="mt-1 font-medium">{product.audiences.join(", ")}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Capabilities
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.capabilities.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
                {product.status_helper}
              </div>

              <div className="flex justify-end">
                <Button asChild variant="outline">
                  <Link href={VENDOR_ROUTES.productDetail(product.code)}>Lihat Detail</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
