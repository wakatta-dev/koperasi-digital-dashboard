/** @format */

import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VendorPlaceholderStateProps = {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function VendorPlaceholderState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: VendorPlaceholderStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2 text-muted-foreground">
            <Construction className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        {ctaHref && ctaLabel ? (
          <Button asChild variant="outline">
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
