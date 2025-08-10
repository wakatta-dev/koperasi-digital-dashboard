/** @format */
"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";

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

type Datum = Record<string, unknown> & {
  // optional fallback fields if tidak pakai nameKey/valueKey custom
  name?: string;
  value?: number;
  fill?: string;
};

type ChartPieProps<T extends Datum = Datum> = {
  data: T[];
  /** key untuk label di tiap slice (default: "name") */
  nameKey?: keyof T & string;
  /** key untuk nilai numerik (default: "value") */
  valueKey?: keyof T & string;

  /** Judul & deskripsi card (optional) */
  title?: React.ReactNode;
  description?: React.ReactNode;

  /** Footer custom; jika kosong bisa pakai defaultFooter=true untuk contoh teks */
  footer?: React.ReactNode;
  defaultFooter?: boolean;

  /** Tampilkan donut style */
  donut?: boolean;
  innerRadius?: number;
  outerRadius?: number;

  /** Tampilkan legend */
  showLegend?: boolean;

  /** Tampilkan label pada slice (text kecil di chart) */
  showSliceLabel?: boolean;

  /** Warna slice (CSS color atau CSS var). Kalau kosong, pakai --chart-1..5..n */
  colors?: string[];

  /** Label untuk value pada tooltip/legend (mis. "Visitors") */
  valueLabel?: string;

  /** Kelas tambahan utk ChartContainer */
  className?: string;

  /** Custom ChartConfig; kalau tidak diisi, dibuat otomatis dari data */
  config?: ChartConfig;

  /** Max tinggi chart */
  maxHeight?: number;
};

function buildAutoConfig<T extends Datum>(
  data: T[],
  nameKey: keyof T & string,
  valueLabel: string | undefined,
  colors?: string[]
): ChartConfig {
  const cfg: Record<string, { label: string; color?: string }> = {};

  // field global untuk nilai (mis. "Visitors")
  if (valueLabel) cfg["__value__"] = { label: valueLabel };

  data.forEach((d, i) => {
    const name = String(d[nameKey] ?? `item-${i + 1}`);
    cfg[name] = {
      label: name,
      color:
        (Array.isArray(colors) && colors[i]) ||
        // fallback ke palet CSS var --chart-i
        `var(--chart-${(i % 12) + 1})`,
    };
  });

  return cfg as ChartConfig;
}

export function ChartPieGeneric<T extends Datum>({
  data,
  nameKey = "name" as keyof T & string,
  valueKey = "value" as keyof T & string,
  title = "Pie Chart",
  description,
  footer,
  defaultFooter,
  donut = true,
  innerRadius,
  outerRadius,
  showLegend = false,
  showSliceLabel = true,
  colors,
  valueLabel = "Value",
  className,
  config,
  maxHeight = 250,
}: ChartPieProps<T>) {
  const chartConfig = React.useMemo(
    () => config ?? buildAutoConfig<T>(data, nameKey, valueLabel, colors),
    [config, data, nameKey, valueLabel, colors]
  );

  // inject fill color if user only supplied colors array / CSS vars
  const chartData = React.useMemo(() => {
    return data.map((d, i) => {
      const label = String(d[nameKey] ?? `item-${i + 1}`);
      const color =
        (Array.isArray(colors) && colors[i]) ||
        (chartConfig as any)?.[label]?.color ||
        undefined;

      return color && !d.fill ? { ...d, fill: color } : d;
    });
  }, [data, nameKey, colors, chartConfig]);

  const _inner = donut ? innerRadius ?? 50 : 0;
  const _outer = outerRadius ?? 80;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={`mx-auto aspect-square pb-0 [&_.recharts-pie-label-text]:fill-foreground ${
            className ?? ""
          }`}
          style={{ maxHeight }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                // NOTE: jika punya versi ChartTooltipContent yang support custom keys,
                // bisa pass formatter di sini
              />
              <Pie
                data={chartData}
                dataKey={valueKey}
                nameKey={nameKey}
                innerRadius={_inner}
                outerRadius={_outer}
                label={showSliceLabel}
                isAnimationActive={true}
              />
              {showLegend ? (
                <Legend verticalAlign="bottom" height={24} />
              ) : null}
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      {(footer || defaultFooter) && (
        <CardFooter className="flex-col gap-2 text-sm">
          {footer ? (
            footer
          ) : (
            <>
              <div className="flex items-center gap-2 leading-none font-medium">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Showing total {valueLabel.toLowerCase()} for the selected period
              </div>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

/* ===========================
   Contoh Pemakaian
   =========================== */

// const data = [
//   { browser: "chrome", visitors: 275 },
//   { browser: "safari", visitors: 200 },
//   { browser: "firefox", visitors: 187 },
//   { browser: "edge", visitors: 173 },
//   { browser: "other", visitors: 90 },
// ];

// export default function ExamplePie() {
//   return (
//     <ChartPieGeneric
//       data={data}
//       nameKey="browser"
//       valueKey="visitors"
//       valueLabel="Visitors"
//       title="Pie Chart - Label"
//       description="January - June 2024"
//       defaultFooter
//       donut
//       showLegend={false}
//       showSliceLabel
//       // opsional: pakai palet custom
//       // colors={["#6366F1","#22C55E","#F59E0B","#EF4444","#14B8A6"]}
//     />
//   );
// }
