/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Expand, Minimize2, Minus, Plus } from "lucide-react";

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

import type { OcrExtractionSession } from "../../types/vendor-bills-ap";

type FeatureOcrDocumentPreviewPanelProps = {
  session: OcrExtractionSession;
};

const MIN_ZOOM_PERCENT = 50;
const MAX_ZOOM_PERCENT = 250;
const ZOOM_STEP_PERCENT = 10;

function parseNumeric(value: string): number {
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function parseZoomPercent(label: string): number {
  const parsed = Number(label.replace(/[^\d]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 100;
  }
  return Math.min(Math.max(parsed, MIN_ZOOM_PERCENT), MAX_ZOOM_PERCENT);
}

function formatIdNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function FeatureOcrDocumentPreviewPanel({
  session,
}: FeatureOcrDocumentPreviewPanelProps) {
  const previewAreaRef = useRef<HTMLDivElement | null>(null);
  const [zoomPercent, setZoomPercent] = useState<number>(() =>
    parseZoomPercent(session.zoom_percent_label)
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setZoomPercent(parseZoomPercent(session.zoom_percent_label));
  }, [session.zoom_percent_label]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === previewAreaRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const lineItemRows = useMemo(
    () =>
      session.line_items.map((line) => {
        const qty = parseNumeric(line.qty);
        const price = parseNumeric(line.price);
        return {
          id: line.id,
          description: line.description,
          qty,
          price,
          total: qty * price,
        };
      }),
    [session.line_items]
  );

  const subtotal = useMemo(
    () => lineItemRows.reduce((total, row) => total + row.total, 0),
    [lineItemRows]
  );

  const totalDue = useMemo(() => {
    const extractedTotal = parseNumeric(session.financials.total_amount);
    return extractedTotal > 0 ? extractedTotal : subtotal;
  }, [session.financials.total_amount, subtotal]);

  const zoomScale = zoomPercent / 100;
  const zoomLabel = `${zoomPercent}%`;

  const decreaseZoom = () =>
    setZoomPercent((current) =>
      Math.max(MIN_ZOOM_PERCENT, current - ZOOM_STEP_PERCENT)
    );
  const increaseZoom = () =>
    setZoomPercent((current) =>
      Math.min(MAX_ZOOM_PERCENT, current + ZOOM_STEP_PERCENT)
    );

  const toggleFullscreen = async () => {
    const target = previewAreaRef.current;
    if (!target) return;

    if (document.fullscreenElement === target) {
      await document.exitFullscreen();
      return;
    }

    if (document.fullscreenElement && document.fullscreenElement !== target) {
      await document.exitFullscreen();
    }

    await target.requestFullscreen();
  };

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-900">
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            onClick={decreaseZoom}
            disabled={zoomPercent <= MIN_ZOOM_PERCENT}
            aria-label="Zoom out PDF preview"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-14 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {zoomLabel}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            onClick={increaseZoom}
            disabled={zoomPercent >= MAX_ZOOM_PERCENT}
            aria-label="Zoom in PDF preview"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded"
            onClick={() => {
              void toggleFullscreen();
            }}
            aria-label={isFullscreen ? "Exit PDF fullscreen" : "Enter PDF fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <CardContent
        ref={previewAreaRef}
        className="min-h-0 flex-1 overflow-auto p-8"
      >
        <div className="mx-auto w-fit">
          <div
            className="origin-top transition-transform duration-150"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <div className="relative w-full min-w-[720px] max-w-3xl bg-white p-12 shadow-xl">
              <div className="mb-8 flex items-start justify-between border-b-2 border-gray-100 pb-8">
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-gray-900">
                    {session.general_info.vendor_name || "VENDOR"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">OCR Document Preview</p>
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
                  <p className="text-sm font-medium">{session.general_info.bill_number}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Date</p>
                  <p className="text-sm font-medium">{session.general_info.bill_date}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Due Date</p>
                  <p className="text-sm font-medium">{session.general_info.due_date}</p>
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
                  {lineItemRows.length === 0 ? (
                    <TableRow className="text-sm">
                      <TableCell className="py-4 text-center text-gray-500" colSpan={4}>
                        No OCR line items detected.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {lineItemRows.map((line) => (
                    <TableRow key={line.id} className="text-sm">
                      <TableCell className="py-4">
                        {line.description || "Line item description"}
                      </TableCell>
                      <TableCell className="py-4 text-center">{line.qty}</TableCell>
                      <TableCell className="py-4 text-right">
                        {formatIdNumber(line.price)}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {formatIdNumber(line.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">{formatIdNumber(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (0%)</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-900 pt-2 text-lg font-bold">
                    <span>Total Due</span>
                    <span>Rp {formatIdNumber(totalDue)}</span>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 m-8 border-4 border-dashed border-blue-500/20 bg-blue-500/5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
