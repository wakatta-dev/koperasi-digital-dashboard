#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const uiDir = path.resolve(process.cwd(), "src/components/ui");

const allowedShadcnFiles = new Set([
  "alert.tsx",
  "avatar.tsx",
  "badge.tsx",
  "breadcrumb.tsx",
  "button.tsx",
  "calendar.tsx",
  "card.tsx",
  "chart.tsx",
  "checkbox.tsx",
  "dialog.tsx",
  "dropdown-menu.tsx",
  "form.tsx",
  "input.tsx",
  "label.tsx",
  "pagination.tsx",
  "progress.tsx",
  "radio-group.tsx",
  "scroll-area.tsx",
  "select.tsx",
  "separator.tsx",
  "sheet.tsx",
  "sidebar.tsx",
  "skeleton.tsx",
  "sonner.tsx",
  "switch.tsx",
  "table.tsx",
  "tabs.tsx",
  "textarea.tsx",
  "tooltip.tsx",
]);

if (!fs.existsSync(uiDir)) {
  console.error(`Directory not found: ${uiDir}`);
  process.exit(1);
}

const uiFiles = fs
  .readdirSync(uiDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
  .map((entry) => entry.name)
  .sort();

const invalidFiles = uiFiles.filter((name) => !allowedShadcnFiles.has(name));

if (invalidFiles.length > 0) {
  console.error("Invalid files detected in src/components/ui:");
  for (const file of invalidFiles) {
    console.error(`- ${file}`);
  }
  console.error(
    "\nOnly shadcn-owned components are allowed in src/components/ui. Move custom components to src/components/shared."
  );
  process.exit(1);
}

console.log(
  `shadcn-ui check passed. ${uiFiles.length} files validated in src/components/ui.`
);
