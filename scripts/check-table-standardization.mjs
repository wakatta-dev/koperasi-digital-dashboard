#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const srcRoot = path.resolve(process.cwd(), "src");
const scanRoots = [
  path.join(srcRoot, "app"),
  path.join(srcRoot, "modules"),
];

function walk(dir, bucket = []) {
  if (!fs.existsSync(dir)) return bucket;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, bucket);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    bucket.push(fullPath);
  }

  return bucket;
}

const violations = [];
const files = scanRoots.flatMap((dir) => walk(dir));

for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(srcRoot, filePath).replaceAll(path.sep, "/");

  if (
    content.includes('@/components/ui/table') ||
    content.includes("../ui/table")
  ) {
    violations.push({
      file: relativePath,
      reason: "direct import from ui/table is not allowed",
    });
  }

  if (content.includes('@/components/shared/data-display/GenericTable')) {
    violations.push({
      file: relativePath,
      reason: "direct import from GenericTable is not allowed; use TableShell",
    });
  }

  if (content.includes('@/components/shared/data-display/PaginatedTableShell')) {
    violations.push({
      file: relativePath,
      reason: "PaginatedTableShell is legacy; use TableShell",
    });
  }

  if (
    content.includes('@/components/shared/data-display/table-primitives') &&
    !content.includes('@/components/shared/data-display/TableShell')
  ) {
    violations.push({
      file: relativePath,
      reason: "components using table-primitives must also wrap usage with TableShell",
    });
  }

  if (/<table\b/.test(content)) {
    violations.push({
      file: relativePath,
      reason: "raw <table> markup is not allowed",
    });
  }
}

if (violations.length > 0) {
  console.error(
    "Table standardization violations: use GenericTable or shared table primitives from components/shared/data-display."
  );
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.reason}`);
  }
  process.exit(1);
}

console.log(`table standardization check passed. ${files.length} files scanned.`);
