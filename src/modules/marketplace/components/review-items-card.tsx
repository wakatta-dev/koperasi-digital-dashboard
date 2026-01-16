/** @format */

import Image from "next/image";
import { REVIEW_ITEMS } from "../constants";

export function ReviewItemsCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="material-icons-outlined text-muted-foreground">
              shopping_bag
            </span>
            Rincian Barang
          </h2>
          <span className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            3 Barang
          </span>
        </div>

        <div className="space-y-6">
          {REVIEW_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`${index > 0 ? "pt-6 border-t border-border" : ""} flex gap-4`}
            >
              {item.image ? (
                <Image
                  alt={item.title}
                  src={item.image}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-xl border border-border bg-muted object-cover"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center ${item.iconBg ?? ""}`}
                >
                  <span className="material-icons-outlined text-3xl">{item.icon}</span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">{item.price}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  <button className="text-xs font-semibold text-primary hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
