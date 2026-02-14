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
  fieldErrors?: {
    orderNumber?: string;
    contact?: string;
  };
  submitting?: boolean;
  submitLabel?: string;
  onOrderNumberChange: (value: string) => void;
  onContactChange: (value: string) => void;
  onSubmit: () => void;
  onReset?: () => void;
};

export function TrackingFormFeature({
  title,
  description,
  orderNumber,
  contact,
  notFound = false,
  errorMessage,
  fieldErrors,
  submitting = false,
  submitLabel = "Lacak Pesanan Saya",
  onOrderNumberChange,
  onContactChange,
  onSubmit,
  onReset,
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
            placeholder="Contoh: ORD-2026-001"
            className={`h-12 ${fieldClass}`}
            aria-invalid={Boolean(fieldErrors?.orderNumber)}
          />
          {fieldErrors?.orderNumber ? (
            <p className="text-xs text-destructive">{fieldErrors.orderNumber}</p>
          ) : null}
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
            aria-invalid={Boolean(fieldErrors?.contact)}
          />
          {fieldErrors?.contact ? (
            <p className="text-xs text-destructive">{fieldErrors.contact}</p>
          ) : null}
        </div>

        {errorMessage ? (
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={onSubmit}
            className="h-12 flex-1 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={submitting}
          >
            {submitting ? "Memuat status..." : submitLabel}
          </Button>
          {onReset ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 border-border text-foreground hover:bg-muted"
              onClick={onReset}
              disabled={submitting}
            >
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
