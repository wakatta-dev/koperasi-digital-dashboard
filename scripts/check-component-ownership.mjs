#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const srcRoot = path.resolve(process.cwd(), "src");
const sharedRoot = path.join(srcRoot, "components", "shared");
const strict = process.argv.includes("--strict");
const minModuleConsumers = 2;

// Transitional allowlist for infrastructure and legacy shared files.
const exemptPatterns = [
  /^app-sidebar\.tsx$/,
  /^dashboard-layout\.tsx$/,
  /^protected-route\.tsx$/,
  /^confirm-dialog\.tsx$/,
  /^confirm-dialog-provider\.tsx$/,
  /^enterprise-loading\.tsx$/,
  /^site-header\.tsx$/,
  /^language-toggle\.tsx$/,
  /^theme-toggle\.tsx$/,
  /^data-table\.tsx$/,
  /^nav-(documents|main|secondary|user)\.tsx$/,
  /^atoms\//,
  /^providers\//,
  /^layout\/search-hero\.tsx$/,
  /^layout\/SearchHeroBase\.tsx$/,
  /^navigation\/Nav(Actions|BarShell|Brand|Links)\.tsx$/,
  /^navigation\/stepper\.tsx$/,
  /^data-display\/CheckoutSummaryBase\.tsx$/,
  /^data-display\/KpiCardBase\.tsx$/,
  /^data-display\/item-card\.tsx$/,
  /^filters\/FilterActions\.tsx$/,
  /^inputs\/field\.tsx$/,
  /^inputs\/input-group\.tsx$/,
];

function isExempt(relativePath) {
  return exemptPatterns.some((pattern) => pattern.test(relativePath));
}

function walk(dir, bucket = []) {
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

function resolveConsumerGroup(sourceFilePath) {
  const normalized = sourceFilePath.replaceAll(path.sep, "/");
  const moduleMatch = normalized.match(/\/src\/modules\/([^/]+)\//);
  if (moduleMatch) return `module:${moduleMatch[1]}`;
  if (normalized.includes("/src/app/")) return "app";
  if (normalized.includes("/src/hooks/")) return "hooks";
  if (normalized.includes("/src/lib/")) return "lib";
  return "other";
}

if (!fs.existsSync(sharedRoot)) {
  console.error(`Directory not found: ${sharedRoot}`);
  process.exit(1);
}

const sharedFiles = walk(sharedRoot).filter((filePath) => {
  const rel = path.relative(sharedRoot, filePath).replaceAll(path.sep, "/");
  if (rel.endsWith(".d.ts")) return false;
  if (rel.endsWith("README.md")) return false;
  return true;
});

const sourceFiles = walk(srcRoot);
const violations = [];

for (const sharedFile of sharedFiles) {
  const relPath = path.relative(sharedRoot, sharedFile).replaceAll(path.sep, "/");
  if (isExempt(relPath)) continue;

  const aliasImportPath = `@/components/shared/${relPath.replace(/\.(ts|tsx)$/, "")}`;
  const moduleConsumers = new Set();

  for (const sourceFile of sourceFiles) {
    if (sourceFile === sharedFile) continue;
    if (sourceFile.startsWith(sharedRoot)) continue;
    if (sourceFile.includes(`${path.sep}__tests__${path.sep}`)) continue;

    const content = fs.readFileSync(sourceFile, "utf8");
    if (!content.includes(aliasImportPath)) continue;

    const group = resolveConsumerGroup(sourceFile);
    if (group.startsWith("module:")) {
      moduleConsumers.add(group);
    }
  }

  if (moduleConsumers.size < minModuleConsumers) {
    violations.push({
      file: `src/components/shared/${relPath}`,
      consumers: [...moduleConsumers].sort(),
    });
  }
}

if (violations.length > 0) {
  const header =
    "Ownership violations: shared components must be reused by at least 2 modules or be explicitly exempted.";
  if (strict) {
    console.error(header);
  } else {
    console.warn(header);
  }
  for (const violation of violations) {
    console.error(
      `- ${violation.file} (module consumers: ${violation.consumers.join(", ") || "none"})`
    );
  }
  if (strict) process.exit(1);
}

console.log(
  `ownership check passed. ${sharedFiles.length} shared files validated (${strict ? "strict" : "warn"} mode).`
);
