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

type SummaryItem = {
  amount: number;
  change: number;
};

export type DashboardSummary = {
  revenue: SummaryItem;
  expense: SummaryItem;
  net_profit: SummaryItem;
  cash_balance: SummaryItem;
};

export default function SummaryCard({
  summary,
}: {
  summary?: DashboardSummary | null;
}) {
  const cards: { title: string; key: keyof DashboardSummary }[] = [
    { title: "Total Revenue", key: "revenue" },
    { title: "Total Expense", key: "expense" },
    { title: "Net Profit", key: "net_profit" },
    { title: "Cash Balance", key: "cash_balance" },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map(({ title, key }) => {
        const data = summary?.[key];
        const amount = data?.amount ?? 0;
        const change = data?.change ?? 0;
        const trendUp = change >= 0;
        const ChangeIcon = trendUp ? IconTrendingUp : IconTrendingDown;
        const formattedAmount = amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        return (
          <Card key={key} className="@container/card">
            <CardHeader>
              <CardDescription>{title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {formattedAmount}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <ChangeIcon />
                  {`${trendUp ? "+" : ""}${change}%`}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {trendUp ? "Trending up" : "Trending down"}
                <ChangeIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">Change since last period</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
