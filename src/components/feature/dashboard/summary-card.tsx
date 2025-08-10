/** @format */

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SummaryData = { key: string; value: number; change: number }[];

export default function SummaryCard({ data }: { data?: SummaryData }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data?.map((item, idx) => {
        const title = item.key.replaceAll("_", " ");
        const amount = item.value ?? 0;
        const change = item.change ?? 0; // Assuming change is part of the item
        const trendUp = change >= 0;
        const ChangeIcon = trendUp ? IconTrendingUp : IconTrendingDown;

        const amountFormatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 2,
        }).format(amount);

        return (
          <Card key={idx} className="@container/card">
            <CardHeader>
              <CardDescription className="capitalize">{title}</CardDescription>
              <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-xl">
                {title.toLowerCase().includes("revenue")
                  ? amountFormatted
                  : amount}
              </CardTitle>
              {title.toLowerCase().includes("ticket") ? null : (
                <CardAction>
                  <Badge variant="outline">
                    <ChangeIcon />
                    {`${trendUp ? "+" : ""}${change}%`}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {trendUp ? "Trending up" : "Trending down"}
                <ChangeIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Change since last period
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
