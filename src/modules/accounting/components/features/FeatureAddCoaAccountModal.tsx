/** @format */

"use client";

import { useEffect, useState } from "react";

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
import { Textarea } from "@/components/shared/inputs/textarea";

type SelectOption = {
  value: string;
  label: string;
};

const EMPTY_SELECT_OPTIONS: SelectOption[] = [];

type FeatureAddCoaAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountTypeOptions?: SelectOption[];
  parentAccountOptions?: SelectOption[];
  optionsLoading?: boolean;
  onSave?: (payload: {
    account_code: string;
    account_name: string;
    account_type: string;
    parent_account_code?: string;
    description?: string;
  }) => void | Promise<void>;
};

export function FeatureAddCoaAccountModal({
  open,
  onOpenChange,
  accountTypeOptions = EMPTY_SELECT_OPTIONS,
  parentAccountOptions = EMPTY_SELECT_OPTIONS,
  optionsLoading = false,
  onSave,
}: FeatureAddCoaAccountModalProps) {
  const [formState, setFormState] = useState({
    accountCode: "",
    accountName: "",
    accountType: "",
    parentAccount: "root",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { accountCode, accountName, accountType, parentAccount, description } =
    formState;

  const patchFormState = (
    updates:
      | Partial<typeof formState>
      | ((current: typeof formState) => typeof formState),
  ) => {
    setFormState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  useEffect(() => {
    if (!open || accountTypeOptions.length === 0) return;

    patchFormState((current) => ({
      ...current,
      accountType: accountTypeOptions.some(
        (option) => option.value === current.accountType,
      )
        ? current.accountType
        : accountTypeOptions[0]?.value ?? "",
    }));
  }, [accountTypeOptions, open]);

  useEffect(() => {
    if (!open) return;

    patchFormState((current) => ({
      ...current,
      parentAccount:
        current.parentAccount === "root" ||
        parentAccountOptions.some(
          (option) => option.value === current.parentAccount,
        )
          ? current.parentAccount
          : "root",
    }));
  }, [open, parentAccountOptions]);

  const resetForm = () => {
    setFormState({
      accountCode: "",
      accountName: "",
      accountType: accountTypeOptions[0]?.value ?? "",
      parentAccount: "root",
      description: "",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave?.({
        account_code: accountCode.trim(),
        account_name: accountName.trim(),
        account_type: accountType,
        parent_account_code:
          parentAccount === "root" || parentAccount.trim() === "" ? undefined : parentAccount,
        description: description.trim() || undefined,
      });
      resetForm();
      onOpenChange(false);
    } catch {
      // Keep the modal open so the user can fix the payload after the page surfaces the error.
    }
    finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isSaving) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg overflow-hidden border-gray-200 p-0 dark:border-gray-700"
        overlayClassName="bg-gray-900/50 backdrop-blur-[2px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Tambah Akun Baru
          </DialogTitle>
          <DialogDescription className="sr-only">Tambah akun COA baru.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kode Akun
            </Label>
            <Input
              value={accountCode}
              onChange={(event) =>
                patchFormState({ accountCode: event.target.value })
              }
              placeholder="e.g. 11103"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Akun
            </Label>
            <Input
              value={accountName}
              onChange={(event) =>
                patchFormState({ accountName: event.target.value })
              }
              placeholder="e.g. Mandiri Bank"
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipe Akun
            </Label>
            <Select
              value={accountType}
              onValueChange={(value) => patchFormState({ accountType: value })}
              disabled={optionsLoading}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Pilih tipe akun" />
              </SelectTrigger>
              <SelectContent>
                {optionsLoading ? (
                  <SelectItem value="__loading_account_type" disabled>
                    Memuat tipe akun...
                  </SelectItem>
                ) : accountTypeOptions.length > 0 ? (
                  accountTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__empty_account_type" disabled>
                    Tipe akun belum tersedia
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Akun Induk / Parent Account
            </Label>
            <Select
              value={parentAccount}
              onValueChange={(value) =>
                patchFormState({ parentAccount: value })
              }
              disabled={optionsLoading}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Pilih akun induk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">None (Root Account)</SelectItem>
                {optionsLoading ? (
                  <SelectItem value="__loading_parent_account" disabled>
                    Memuat akun induk...
                  </SelectItem>
                ) : parentAccountOptions.length > 0 ? (
                  parentAccountOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__empty_parent_account" disabled>
                    Akun induk belum tersedia
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi
            </Label>
            <Textarea
              value={description}
              onChange={(event) =>
                patchFormState({ description: event.target.value })
              }
              placeholder="Optional description for this account..."
              rows={3}
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="mt-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSaving ? "Menyimpan..." : "Simpan Akun"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
