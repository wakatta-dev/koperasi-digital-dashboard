/** @format */

"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { DUMMY_OCR_SESSION } from "../../constants/vendor-bills-ap-dummy";
import type { OcrExtractionSession } from "../../types/vendor-bills-ap";

type FeatureOcrExtractedDataPanelProps = {
  session?: OcrExtractionSession;
  onSessionChange?: (session: OcrExtractionSession) => void;
};

export function FeatureOcrExtractedDataPanel({
  session = DUMMY_OCR_SESSION,
  onSessionChange,
}: FeatureOcrExtractedDataPanelProps) {
  const updateSession = (nextSession: OcrExtractionSession) => {
    onSessionChange?.(nextSession);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Extracted Data</h3>
        <p className="mt-1 text-xs text-gray-500">
          Review and verify the data extracted by OCR.
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
            General Information
          </h4>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Vendor Name
              </label>
              <div className="relative">
                <Input
                  value={session.general_info.vendor_name}
                  onChange={(event) =>
                    updateSession({
                      ...session,
                      general_info: {
                        ...session.general_info,
                        vendor_name: event.target.value,
                      },
                    })
                  }
                  className="border-gray-200 bg-gray-50 text-sm focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold text-emerald-500 uppercase">
                  {session.general_info.vendor_confidence_label}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bill Number
              </label>
              <div className="relative">
                <Input
                  value={session.general_info.bill_number}
                  onChange={(event) =>
                    updateSession({
                      ...session,
                      general_info: {
                        ...session.general_info,
                        bill_number: event.target.value,
                      },
                    })
                  }
                  className="border-amber-300 bg-amber-50 text-sm focus-visible:ring-amber-500 dark:border-amber-700/50 dark:bg-amber-900/10"
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold text-amber-600 uppercase">
                  {session.general_info.bill_number_confidence_label}
                </div>
              </div>
              <p className="mt-1 text-[11px] text-amber-600">
                Low confidence: Please verify against document
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bill Date
                </label>
                <Input
                  type="date"
                  value={session.general_info.bill_date}
                  onChange={(event) =>
                    updateSession({
                      ...session,
                      general_info: {
                        ...session.general_info,
                        bill_date: event.target.value,
                      },
                    })
                  }
                  className="border-gray-200 bg-gray-50 text-sm focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={session.general_info.due_date}
                  onChange={(event) =>
                    updateSession({
                      ...session,
                      general_info: {
                        ...session.general_info,
                        due_date: event.target.value,
                      },
                    })
                  }
                  className="border-gray-200 bg-gray-50 text-sm focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">Financials</h4>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Amount
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">
                Rp
              </span>
              <Input
                value={session.financials.total_amount}
                onChange={(event) =>
                  updateSession({
                    ...session,
                    financials: { ...session.financials, total_amount: event.target.value },
                  })
                }
                className="border-gray-200 bg-gray-50 pl-9 text-sm font-bold focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">Line Items</h4>
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              onClick={() =>
                updateSession({
                  ...session,
                  line_items: [
                    ...session.line_items,
                    {
                      id: `ocr-line-${Date.now()}`,
                      description: "",
                      qty: "1",
                      price: "0",
                      highlight_price: false,
                    },
                  ],
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {session.line_items.map((lineItem) => (
              <div
                key={lineItem.id}
                className={`rounded-lg border p-3 ${
                  lineItem.highlight_price
                    ? "border-amber-200 bg-amber-50/50 dark:border-amber-700/30 dark:bg-amber-900/10"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                }`}
              >
                <Input
                  value={lineItem.description}
                  onChange={(event) =>
                    updateSession({
                      ...session,
                      line_items: session.line_items.map((item) =>
                        item.id === lineItem.id
                          ? { ...item, description: event.target.value }
                          : item
                      ),
                    })
                  }
                  className="mb-2 border-none bg-transparent p-0 text-sm font-medium text-gray-900 shadow-none focus-visible:ring-0 dark:text-white"
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Qty</label>
                    <Input
                      value={lineItem.qty}
                      onChange={(event) =>
                        updateSession({
                          ...session,
                          line_items: session.line_items.map((item) =>
                            item.id === lineItem.id ? { ...item, qty: event.target.value } : item
                          ),
                        })
                      }
                      className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label
                      className={`text-[10px] font-bold uppercase ${
                        lineItem.highlight_price ? "text-amber-600" : "text-gray-500"
                      }`}
                    >
                      {lineItem.highlight_price ? "Price (Check)" : "Price"}
                    </label>
                    <Input
                      value={lineItem.price}
                      onChange={(event) =>
                        updateSession({
                          ...session,
                          line_items: session.line_items.map((item) =>
                            item.id === lineItem.id
                              ? { ...item, price: event.target.value }
                              : item
                          ),
                        })
                      }
                      className={`border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 ${
                        lineItem.highlight_price ? "font-bold text-amber-700" : ""
                      }`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                    onClick={() =>
                      updateSession({
                        ...session,
                        line_items: session.line_items.filter((item) => item.id !== lineItem.id),
                      })
                    }
                    aria-label={`Remove ${lineItem.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
