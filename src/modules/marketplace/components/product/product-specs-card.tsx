/** @format */

import { MarketplaceProductDetail } from "../../constants";

export function ProductSpecsCard({
  product,
}: {
  product: MarketplaceProductDetail;
}) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="font-bold text-foreground mb-4">Spesifikasi Produk</h3>
      <div className="space-y-4 text-sm">
        {product.specs.map((spec, index) => (
          <div
            key={spec.label}
            className={`flex justify-between ${
              index !== product.specs.length - 1
                ? "border-b border-border pb-2"
                : "pb-2"
            }`}
          >
            <span className="text-muted-foreground">{spec.label}</span>
            <span className="font-medium text-foreground">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
