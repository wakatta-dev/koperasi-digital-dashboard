/** @format */

import { FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";

type FeaturePphHeaderActionProps = {
  onExport?: () => void;
};

export function FeaturePphHeaderAction({ onExport }: FeaturePphHeaderActionProps) {
  return (
    <Button
      type="button"
      onClick={onExport}
      className="bg-indigo-600 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
    >
      <FileUp className="mr-2 h-4 w-4" />
      Export PPh Report
    </Button>
  );
}
