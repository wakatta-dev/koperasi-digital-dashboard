/** @format */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { settingsSurfaceClassName } from "../../lib/settings";

type FeatureEmailTestCardProps = {
  recipient: string;
  placeholders: string[];
  variables: Record<string, string>;
  disabled: boolean;
  sending: boolean;
  onRecipientChange: (value: string) => void;
  onVariableChange: (key: string, value: string) => void;
  onSend: () => void;
};

export function FeatureEmailTestCard({
  recipient,
  placeholders,
  variables,
  disabled,
  sending,
  onRecipientChange,
  onVariableChange,
  onSend,
}: FeatureEmailTestCardProps) {
  const isValid = recipient.trim() && placeholders.every((placeholder) => variables[placeholder]?.trim());

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <CardContent className="p-6">
        <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Kirim Email Uji</h2>
        <p className="mb-4 text-sm text-gray-500">
          Uji template aktif saat ini ke alamat email spesifik.
        </p>
        <div className="space-y-4">
          <div className="w-full space-y-2">
            <Label htmlFor="test-recipient">Email Penerima</Label>
            <Input
              id="test-recipient"
              type="email"
              value={recipient}
              placeholder="Contoh: admin@desa.id"
              className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
              disabled={disabled}
              onChange={(event) => onRecipientChange(event.target.value)}
            />
          </div>

          {placeholders.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {placeholders.map((placeholder) => (
                <div key={placeholder} className="space-y-2">
                  <Label htmlFor={`placeholder-${placeholder}`}>{`{{${placeholder}}}`}</Label>
                  <Input
                    id={`placeholder-${placeholder}`}
                    value={variables[placeholder] ?? ""}
                    className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
                    disabled={disabled}
                    onChange={(event) => onVariableChange(placeholder, event.target.value)}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap border-gray-300 dark:border-gray-700"
              disabled={disabled || !isValid || sending}
              onClick={onSend}
            >
              {sending ? "Mengirim..." : "Kirim Email Uji"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

