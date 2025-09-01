/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVendorReportActions } from "@/hooks/queries/vendor";

type Props = {
  initialFinancial?: any;
  initialUsage?: any;
  initialExports?: any[];
};

export default function VendorReportsClient({ initialFinancial, initialUsage, initialExports }: Props) {
  const { exportReport } = useVendorReportActions();

  const download = async (format: string) => {
    const blob = await exportReport.mutateAsync({ report_type: "financial", format, params: {} });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendor Reports</h2>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={() => download("pdf")}>Export PDF</Button>
          <Button type="button" variant="outline" onClick={() => download("xlsx")}>Export XLSX</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(initialFinancial ?? {}, null, 2)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(initialUsage ?? {}, null, 2)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(initialExports ?? [], null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

