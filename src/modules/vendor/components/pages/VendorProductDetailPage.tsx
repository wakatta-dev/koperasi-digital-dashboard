/** @format */

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupportOperationalSettings } from "@/hooks/queries";
import { VendorPageHeader } from "../VendorPageHeader";
import { VENDOR_ROUTES } from "../../constants/routes";
import { getVendorProductByCode } from "../../constants/product-catalog";

type VendorProductDetailPageProps = {
  productId: string;
};

function productStatusBadgeClass(status: string) {
  if (status === "active") {
    return "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (status === "configured") {
    return "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  }
  return "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export function VendorProductDetailPage({
  productId,
}: VendorProductDetailPageProps) {
  const operationalQuery = useSupportOperationalSettings();
  const product = getVendorProductByCode(productId, operationalQuery.data);

  if (!product) {
    return (
      <div className="space-y-6">
        <VendorPageHeader
          title="Product Not Found"
          description="Kode produk tidak ditemukan pada katalog baseline vendor saat ini."
          actions={
            <Button asChild variant="outline">
              <Link href={VENDOR_ROUTES.products}>Kembali ke Products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title={product.name}
        description={product.summary}
        actions={
          <Button asChild variant="outline">
            <Link href={VENDOR_ROUTES.products}>Kembali ke Products</Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Capability Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{product.description}</p>
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
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Target Audience
              </div>
              <div className="flex flex-wrap gap-2">
                {product.audiences.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="text-muted-foreground">Workspace Status</span>
                <Badge className={productStatusBadgeClass(product.status)}>
                  {product.status.toUpperCase()}
                </Badge>
              </div>
              <div className="rounded-lg border px-4 py-3 text-muted-foreground">
                {product.status_helper}
              </div>
              <div className="rounded-lg border px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Billing Cycle
                </div>
                <div className="mt-1 font-medium">{product.billing_cycle}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Implementation Note</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Detail produk ini saat ini dibentuk dari capability platform yang sudah configurable.
              Pricing komersial dan assignment lintas tenant masih menunggu kontrak backend plan dan
              subscription yang final.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
