/** @format */

export type ReportingCardGroup = "statement" | "ledger";

export type ReportingCardItem = {
  key: string;
  title: string;
  description: string;
  href: string;
  group: ReportingCardGroup;
  iconTone:
    | "blue"
    | "emerald"
    | "orange"
    | "purple"
    | "teal"
    | "indigo"
    | "cyan";
};

export type ReportingQueryState = {
  preset?: string;
  start?: string;
  end?: string;
  branch?: string;
  accountId?: string;
  search?: string;
  page?: number;
  page_size?: number;
};

export type ReportingAccountOption = {
  id: string;
  label: string;
};
