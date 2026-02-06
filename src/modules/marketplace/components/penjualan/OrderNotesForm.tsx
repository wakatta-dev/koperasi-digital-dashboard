/** @format */

"use client";

import { Textarea } from "@/components/ui/textarea";

export type OrderNotesFormProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
}>;

export function OrderNotesForm({ value, onChange, onSave }: OrderNotesFormProps) {
  return (
    <div className="surface-table p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Catatan</h3>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tambahkan catatan internal..."
        rows={3}
        className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 shadow-sm"
      />
      <button className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-700" type="button" onClick={onSave}>
        Simpan Catatan
      </button>
    </div>
  );
}
