/** @format */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TrackingFormFeatureProps = {
  title: string;
  description: string;
  orderNumber: string;
  contact: string;
  notFound?: boolean;
  errorMessage?: string;
  onOrderNumberChange: (value: string) => void;
  onContactChange: (value: string) => void;
  onSubmit: () => void;
};

export function TrackingFormFeature({
  title,
  description,
  orderNumber,
  contact,
  notFound = false,
  errorMessage,
  onOrderNumberChange,
  onContactChange,
  onSubmit,
}: TrackingFormFeatureProps) {
  const fieldClass = notFound
    ? "border-red-300 bg-red-50 placeholder:text-red-300 focus-visible:ring-red-500"
    : "border-border bg-card";

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="tracking-order-number"
            className="text-sm font-medium text-foreground"
          >
            Kode Pesanan
          </label>
          <Input
            id="tracking-order-number"
            value={orderNumber}
            onChange={(event) => onOrderNumberChange(event.target.value)}
            placeholder="Contoh: INV-20231024-0001"
            className={`h-12 ${fieldClass}`}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="tracking-contact"
            className="text-sm font-medium text-foreground"
          >
            Email / Nomor HP
          </label>
          <Input
            id="tracking-contact"
            value={contact}
            onChange={(event) => onContactChange(event.target.value)}
            placeholder="Contoh: budi@email.com atau 0812..."
            className={`h-12 ${fieldClass}`}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
        ) : null}

        <Button
          type="button"
          onClick={onSubmit}
          className="h-12 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Lacak Pesanan Saya
        </Button>
      </div>
    </section>
  );
}
