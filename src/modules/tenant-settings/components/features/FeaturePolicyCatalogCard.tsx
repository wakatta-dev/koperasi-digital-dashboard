/** @format */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SupportPolicyDefinitions } from "@/types/api/support";
import {
  settingsCardContentClassName,
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeaturePolicyCatalogCardProps = {
  data?: SupportPolicyDefinitions;
  isLoading: boolean;
  error?: Error | null;
};

function formatValidationRules(rules?: Record<string, unknown>) {
  if (!rules) return "Tanpa rule tambahan";
  const keys = Object.keys(rules);
  if (keys.length === 0) return "Tanpa rule tambahan";
  return keys.join(", ");
}

export function FeaturePolicyCatalogCard({
  data,
  isLoading,
  error,
}: FeaturePolicyCatalogCardProps) {
  return (
    <Card className={settingsSurfaceClassName}>
      <div className={settingsHeaderClassName}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={settingsSectionTitleClassName}>Katalog Policy Canonical</h2>
            <p className={`mt-1 ${settingsMutedTextClassName}`}>
              Referensi resmi untuk key policy, scope, source default, dan rule validasi yang
              menjadi dasar runtime behavior.
            </p>
          </div>
          <Badge variant="outline">{data?.items.length ?? 0} Policy</Badge>
        </div>
      </div>

      <CardContent className={`${settingsCardContentClassName} space-y-3`}>
        {isLoading ? <p className="text-sm text-gray-500">Memuat katalog policy…</p> : null}
        {error ? <p className="text-sm text-rose-600">{error.message}</p> : null}

        {!isLoading && !error && data ? (
          <div className="grid gap-3">
            {data.items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 dark:border-gray-700">
                Belum ada definisi policy canonical yang tersedia.
              </div>
            ) : null}

            {data.items.map((item) => (
              <div
                key={item.policy_key}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.policy_name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{item.policy_key}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{item.policy_class}</Badge>
                    <Badge variant="outline">{item.value_type}</Badge>
                    <Badge variant="outline">source: {item.default_source}</Badge>
                  </div>
                </div>

                {item.description ? (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                ) : null}

                <div className="mt-3 grid gap-2 text-xs text-gray-500 md:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Allowed scopes:</span>{" "}
                    {(item.allowed_scopes ?? []).join(", ") || "-"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Validation rules:</span>{" "}
                    {formatValidationRules(item.validation_rules)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Manage by:</span>{" "}
                    {(item.management_roles ?? []).join(", ") || "-"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Review by:</span>{" "}
                    {(item.reviewer_roles ?? []).join(", ") || "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
