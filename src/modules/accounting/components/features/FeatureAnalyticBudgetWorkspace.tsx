/** @format */

"use client";

import { Search, Filter, ArrowUpDown, Plus, TreePine, ChartLine } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/shared/inputs/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AnalyticAccountCard, BudgetRow } from "../../types/settings";

type FeatureAnalyticBudgetWorkspaceProps = {
  budgetRows?: BudgetRow[];
  analyticAccountCards?: AnalyticAccountCard[];
  onCreateBudget?: () => void;
  onAddAnalyticAccount?: () => void;
  onEditBudget?: (budgetId: string) => void;
};

export function FeatureAnalyticBudgetWorkspace({
  budgetRows = [],
  analyticAccountCards = [],
  onCreateBudget,
  onAddAnalyticAccount,
  onEditBudget,
}: FeatureAnalyticBudgetWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"analytic" | "budgets">("budgets");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
            <ChartLine className="h-7 w-7 text-indigo-600" />
            Analytic &amp; Budget
          </h2>
          <p className="mt-1 ml-10 text-sm text-gray-500 dark:text-gray-400">
            Manage analytic accounts (cost centers) and monitor budgets.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "analytic" | "budgets")}
        className="w-full"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
            <TabsTrigger
              value="analytic"
              onClick={() => setActiveTab("analytic")}
              className="rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
            >
              <TreePine className="mr-2 h-4 w-4" />
              Analytic Accounts
            </TabsTrigger>
            <TabsTrigger
              value="budgets"
              onClick={() => setActiveTab("budgets")}
              className="rounded-none border-b-2 border-transparent px-1 py-4 text-sm font-medium data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
            >
              <ChartLine className="mr-2 h-4 w-4" />
              Budgets
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline">
              Import Data
            </Button>
            {activeTab === "budgets" ? (
              <Button
                type="button"
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={onCreateBudget}
              >
                <Plus className="h-4 w-4" />
                Create Budget
              </Button>
            ) : null}
            {activeTab === "analytic" ? (
              <Button
                type="button"
                className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={onAddAnalyticAccount}
              >
                <Plus className="h-4 w-4" />
                Add Analytic Account
              </Button>
            ) : null}
          </div>
        </div>

        <TabsContent value="budgets" className="mt-0">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search budgets..."
                  className="border-gray-300 bg-white pl-10 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size="icon" variant="ghost">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter budgets</span>
                </Button>
                <Button type="button" size="icon" variant="ghost">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="sr-only">Sort budgets</span>
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-xs uppercase">Budget Name</TableHead>
                    <TableHead className="px-6 py-3 text-xs uppercase">Analytic Account</TableHead>
                    <TableHead className="px-6 py-3 text-xs uppercase">Period</TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs uppercase">Target Amount</TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs uppercase">
                      Practical Amount
                    </TableHead>
                    <TableHead className="px-6 py-3 text-center text-xs uppercase">Achievement</TableHead>
                    <TableHead className="px-6 py-3 text-right text-xs uppercase">
                      <span className="sr-only">Edit</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        Data budget belum tersedia.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {budgetRows.map((row) => (
                    <TableRow key={row.budget_id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${row.avatar_class}`}
                          >
                            {row.avatar}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {row.budget_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{row.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          {row.analytic_account}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {row.period}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                        {row.target_amount}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                        {row.practical_amount}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Progress value={row.achievement_percent} className="h-2.5 max-w-[100px]" />
                          <span className={`text-xs font-medium ${row.achievement_class}`}>
                            {row.achievement_label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-sm font-medium">
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          onClick={() => onEditBudget?.(row.budget_id)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytic" className="mt-0">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search accounts..."
                  className="border-gray-300 bg-white pl-10 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <Button type="button" size="icon" variant="ghost">
                <TreePine className="h-4 w-4" />
                <span className="sr-only">Tree view</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {analyticAccountCards.length === 0 ? (
                <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/20 dark:text-gray-300">
                  Data analytic account belum tersedia.
                </div>
              ) : null}
              {analyticAccountCards.map((card) => (
                <div
                  key={card.analytic_account_id}
                  className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-indigo-600"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-base ${card.icon_class}`}
                    >
                      {card.icon}
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {card.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{card.account_name}</h3>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Cost Center: {card.reference_code}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Current Balance</span>
                      <span className={`font-medium ${card.balance_class}`}>{card.current_balance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Active Budgets</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {card.active_budgets}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-700">
                    <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:underline dark:text-indigo-400">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
