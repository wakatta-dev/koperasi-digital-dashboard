/** @format */

type SummaryRow = {
  label: string;
  value: string;
  valueClassName?: string;
};

type SummaryBlockProps = {
  title: string;
  rows: SummaryRow[];
  totalLabel: string;
  totalValue: string;
  footer?: string;
};

export function SummaryBlock({
  title,
  rows,
  totalLabel,
  totalValue,
  footer,
}: SummaryBlockProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-foreground">{title}</h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className={row.valueClassName ?? "font-medium text-foreground"}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="my-4 border-t border-dashed border-border" />
      <div className="flex items-end justify-between">
        <span className="font-bold text-foreground">{totalLabel}</span>
        <span className="text-2xl font-extrabold text-indigo-600">{totalValue}</span>
      </div>
      {footer ? <p className="mt-1 text-[10px] text-muted-foreground">{footer}</p> : null}
    </div>
  );
}
