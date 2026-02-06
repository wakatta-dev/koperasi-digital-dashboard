#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const srcRoot = path.resolve(process.cwd(), "src");
const allowedFiles = new Set([path.join(srcRoot, "app", "globals.css")]);
const ignoredDirNames = new Set(["components/ui", "__tests__"]);
const extensions = new Set([".ts", ".tsx", ".css"]);
const hexRegex = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

function shouldIgnoreDirectory(relativeDirPath) {
  return [...ignoredDirNames].some(
    (segment) =>
      relativeDirPath === segment || relativeDirPath.startsWith(`${segment}${path.sep}`)
  );
}

function walk(dir, bucket = []) {
  const relDir = path.relative(srcRoot, dir);
  if (relDir && shouldIgnoreDirectory(relDir)) return bucket;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, bucket);
      continue;
    }

    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (!extensions.has(ext)) continue;
    bucket.push(fullPath);
  }
  return bucket;
}

if (!fs.existsSync(srcRoot)) {
  console.error(`Directory not found: ${srcRoot}`);
  process.exit(1);
}

const sourceFiles = walk(srcRoot).filter((filePath) => !allowedFiles.has(filePath));
const violations = [];

for (const filePath of sourceFiles) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (!hexRegex.test(line)) return;
    violations.push({
      file: path.relative(process.cwd(), filePath),
      line: index + 1,
      content: line.trim(),
    });
  });
}

if (violations.length > 0) {
  console.error(
    "Found hardcoded hex colors outside token sources. Use semantic tokens (brand-*, surface-*, foreground-*)."
  );
  for (const violation of violations) {
    console.error(`- ${violation.file}:${violation.line} ${violation.content}`);
  }
  process.exit(1);
}

console.log(
  `design-tokens check passed. ${sourceFiles.length} files scanned without hardcoded hex colors.`
);
