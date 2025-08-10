/** @format */
"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type SeriesItem = {
  /** key di objek data */
  dataKey: string;
  /** label ditampilkan di legend/tooltip (opsional) */
  label?: string;
  /** variabel warna CSS dari theme, default: var(--chart-1), --chart-2, dst. */
  colorVar?: string;
  /** Recharts Bar.stackId kalau mau stacked */
  stackId?: string;
  /** Radius sudut bar, default 4 */
  radius?: number;
};

type FooterProps =
  | {
      primary?: React.ReactNode;
      secondary?: React.ReactNode;
      showTrendingIcon?: boolean;
    }
  | React.ReactNode;

export type BarChartCardProps<T extends Record<string, any>> = {
  /** Judul kartu */
  title?: React.ReactNode;
  /** Deskripsi kecil di bawah judul */
  description?: React.ReactNode;
  /** Data mentah untuk chart */
  data: T[];
  /** key untuk sumbu X */
  xKey: keyof T & string;
  /** formatter tick sumbu X (opsional) */
  // eslint-disable-next-line no-unused-vars
  xTickFormatter?: ((value: any, index: number) => string) | undefined;
  /** daftar seri (multi bar) */
  series: SeriesItem[];
  /** indikator tooltip (shadcn ChartTooltipContent) */
  tooltipIndicator?: "dashed" | "dot" | "line";
  /** konten footer */
  footer?: FooterProps;
  /** className untuk <Card> */
  className?: string;
  /** prop tambahan untuk XAxis */
  xAxisProps?: Partial<React.ComponentProps<typeof XAxis>>;
  /** tampilkan grid vertikal? default: false */
  gridVertical?: boolean;
  /** aktifkan Recharts accessibility layer */
  accessibilityLayer?: boolean;
};

export function BarChartCard<T extends Record<string, any>>({
  title = "Bar Chart",
  description,
  data,
  xKey,
  xTickFormatter,
  series,
  tooltipIndicator = "dashed",
  footer,
  className,
  xAxisProps,
  gridVertical = false,
  accessibilityLayer = true,
}: BarChartCardProps<T>) {
  // Susun config untuk ChartContainer (shadcn)
  const chartConfig = React.useMemo(() => {
    const cfg: ChartConfig = {};
    series.forEach((s, i) => {
      const color = s.colorVar ?? `var(--chart-${i + 1})`;
      cfg[s.dataKey] = {
        label: s.label ?? s.dataKey,
        color,
      };
    });
    return cfg;
  }, [series]);

  const renderFooter = () => {
    if (!footer) return null;
    if (React.isValidElement(footer)) return footer;

    const f = footer as Exclude<FooterProps, React.ReactNode>;
    return (
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {(f.primary || f.showTrendingIcon) && (
          <div className="flex gap-2 leading-none font-medium">
            {f.primary}
            {f.showTrendingIcon && <TrendingUp className="h-4 w-4" />}
          </div>
        )}
        {f.secondary && (
          <div className="text-muted-foreground leading-none">
            {f.secondary}
          </div>
        )}
      </CardFooter>
    );
  };

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer={accessibilityLayer} data={data}>
            <CartesianGrid vertical={gridVertical} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={xTickFormatter}
              {...xAxisProps}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator={tooltipIndicator} />}
            />
            {series.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                stackId={s.stackId}
                radius={s.radius ?? 4}
                /** ChartContainer akan menyediakan --color-{key} dari ChartConfig */
                fill={`var(--color-${s.dataKey})`}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>

      {renderFooter()}
    </Card>
  );
}

/* ===========================
   Contoh Pemakaian
   =========================== */

// Data contoh
// const demoData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// Config series contoh
// const demoSeries: SeriesItem[] = [
//   { dataKey: "desktop", label: "Desktop" }, // otomatis var(--chart-1)
//   { dataKey: "mobile", label: "Mobile" }, // otomatis var(--chart-2)
// ];

// Komponen siap pakai di halaman
// export function ChartBarMultipleGenericDemo() {
//   return (
//     <BarChartCard
//       title="Bar Chart - Multiple"
//       description="January - June 2024"
//       data={demoData}
//       xKey="month"
//       xTickFormatter={(v) => String(v).slice(0, 3)}
//       series={demoSeries}
//       tooltipIndicator="dashed"
//       footer={{
//         primary: <>Trending up by 5.2% this month</>,
//         secondary: "Showing total visitors for the last 6 months",
//         showTrendingIcon: true,
//       }}
//     />
//   );
// }
