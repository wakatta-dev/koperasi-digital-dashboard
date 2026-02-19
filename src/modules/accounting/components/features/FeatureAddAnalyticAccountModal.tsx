/** @format */

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/shared/inputs/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FeatureAddAnalyticAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (payload: {
    account_name: string;
    reference_code: string;
    parent_analytic_account_id?: string;
  }) => void;
};

export function FeatureAddAnalyticAccountModal({
  open,
  onOpenChange,
  onSave,
}: FeatureAddAnalyticAccountModalProps) {
  const [accountName, setAccountName] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [parentAccount, setParentAccount] = useState("root");

  const handleSave = () => {
    onSave?.({
      account_name: accountName.trim(),
      reference_code: referenceCode.trim(),
      parent_analytic_account_id:
        parentAccount === "root" || parentAccount.trim() === "" ? undefined : parentAccount,
    });
    onOpenChange(false);
    setAccountName("");
    setReferenceCode("");
    setParentAccount("root");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/40 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-start gap-4 text-left">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Plus className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Add Analytic Account
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Create a new cost center to track department or project expenses.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div>
            <Label className="mb-1.5 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Account Name
            </Label>
            <Input
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              placeholder="e.g. Marketing Dept"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Reference Code
            </Label>
            <Input
              value={referenceCode}
              onChange={(event) => setReferenceCode(event.target.value)}
              placeholder="e.g. MKT-001"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Parent Analytic Account <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            </Label>
            <Select value={parentAccount} onValueChange={setParentAccount}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">No Parent (Root Account)</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="rnd">Research &amp; Development</SelectItem>
                <SelectItem value="corp">Corporate Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-indigo-600 text-white hover:bg-indigo-700">
            Save Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
