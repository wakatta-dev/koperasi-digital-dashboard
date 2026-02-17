/** @format */

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { JOURNAL_DETAIL_GENERAL_INFORMATION } from "../../constants/journal-seed";
import type { JournalDetailGeneralInformation } from "../../types/journal";

type FeatureJournalDetailGeneralInfoProps = {
  data?: JournalDetailGeneralInformation;
};

export function FeatureJournalDetailGeneralInfo({
  data = JOURNAL_DETAIL_GENERAL_INFORMATION,
}: FeatureJournalDetailGeneralInfoProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
        <h3 className="font-semibold text-gray-900 dark:text-white">General Information</h3>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Reference Number
          </label>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.reference_number}</p>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Journal Date
          </label>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.journal_date}</p>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Partner / Entity
          </label>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.partner_entity}</p>
        </div>
        <div className="md:col-span-3">
          <label className="mb-2 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Journal Name
          </label>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.journal_name}</p>
        </div>
      </CardContent>
    </Card>
  );
}
