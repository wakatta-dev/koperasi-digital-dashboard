/** @format */

import { Expand, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_OCR_SESSION } from "../../constants/vendor-bills-ap-dummy";
import type { OcrExtractionSession } from "../../types/vendor-bills-ap";

type FeatureOcrDocumentPreviewPanelProps = {
  session?: OcrExtractionSession;
};

export function FeatureOcrDocumentPreviewPanel({
  session = DUMMY_OCR_SESSION,
}: FeatureOcrDocumentPreviewPanelProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {session.file_name}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
            {session.file_size_label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {session.zoom_percent_label}
          </span>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded">
            <Plus className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded">
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="flex-1 overflow-y-auto p-8">
        <div className="relative mx-auto w-full max-w-3xl bg-white p-12 shadow-xl">
          <div className="mb-8 flex items-start justify-between border-b-2 border-gray-100 pb-8">
            <div>
              <h3 className="text-3xl font-black tracking-tight text-gray-900">
                GLOBAL TECH SOLUTIONS
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                123 Innovation Drive, Silicon Valley, CA
              </p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-light tracking-widest text-gray-300 uppercase">
                INVOICE
              </span>
            </div>
          </div>

          <div className="mb-12 flex justify-between">
            <div>
              <p className="mb-2 text-xs font-bold text-gray-400 uppercase">Bill To</p>
              <p className="font-bold text-gray-800">3Portals Enterprise</p>
              <p className="text-sm text-gray-500">
                Jalan Utama No. 45
                <br />
                Jakarta, Indonesia
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">Invoice #</p>
              <p className="text-sm font-medium">INV-2023-882</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Date</p>
              <p className="text-sm font-medium">Oct 25, 2023</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Due Date</p>
              <p className="text-sm font-medium">Nov 24, 2023</p>
            </div>
          </div>

          <Table className="mb-12">
            <TableHeader className="border-b-2 border-gray-900">
              <TableRow className="text-left text-xs font-bold text-gray-900 uppercase">
                <TableHead className="py-3">Description</TableHead>
                <TableHead className="w-24 py-3 text-center">Qty</TableHead>
                <TableHead className="w-32 py-3 text-right">Unit Price</TableHead>
                <TableHead className="w-32 py-3 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              <TableRow className="text-sm">
                <TableCell className="py-4">Cloud Infrastructure Services (Monthly)</TableCell>
                <TableCell className="py-4 text-center">1</TableCell>
                <TableCell className="py-4 text-right">8,500,000</TableCell>
                <TableCell className="py-4 text-right">8,500,000</TableCell>
              </TableRow>
              <TableRow className="text-sm">
                <TableCell className="py-4">Security Compliance Audit Fee</TableCell>
                <TableCell className="py-4 text-center">1</TableCell>
                <TableCell className="py-4 text-right">4,000,000</TableCell>
                <TableCell className="py-4 text-right">4,000,000</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">12,500,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (0%)</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between border-t border-gray-900 pt-2 text-lg font-bold">
                <span>Total Due</span>
                <span>Rp 12,500,000</span>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 m-8 border-4 border-dashed border-blue-500/20 bg-blue-500/5" />
        </div>
      </CardContent>
    </Card>
  );
}
