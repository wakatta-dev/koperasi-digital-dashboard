#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const FRONTEND_ROOT = path.resolve(SCRIPT_DIR, "..");
const SRC_ROOT = path.join(FRONTEND_ROOT, "src");
const OUTPUT_JSON = path.join(FRONTEND_ROOT, "reports", "testid-audit.json");
const OUTPUT_MD = path.join(FRONTEND_ROOT, "docs", "testid-audit.md");

const INTRINSIC_ACTION_TAGS = new Set([
  "a",
  "button",
  "form",
  "input",
  "select",
  "textarea",
  "summary",
]);

const COMPONENT_ACTION_TAGS = new Set([
  "Button",
  "Checkbox",
  "DialogTrigger",
  "DropdownMenuCheckboxItem",
  "DropdownMenuItem",
  "DropdownMenuRadioItem",
  "DropdownMenuSubTrigger",
  "DropdownMenuTrigger",
  "Input",
  "Label",
  "RadioGroupItem",
  "SelectTrigger",
  "SheetTrigger",
  "Switch",
  "TabsTrigger",
  "Textarea",
  "TooltipTrigger",
]);

const ACTION_EVENT_ATTRIBUTES = new Set([
  "onBlur",
  "onChange",
  "onClick",
  "onFocus",
  "onInput",
  "onKeyDown",
  "onKeyUp",
  "onMouseDown",
  "onMouseUp",
  "onPointerDown",
  "onSubmit",
  "onTouchEnd",
  "onTouchStart",
]);

function toWorkspaceRelative(filePath) {
  return path.relative(FRONTEND_ROOT, filePath).replaceAll(path.sep, "/");
}

function listTsxFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const nextPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTsxFiles(nextPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith(".tsx")) {
      continue;
    }

    if (nextPath.includes(`${path.sep}__tests__${path.sep}`)) {
      continue;
    }

    files.push(nextPath);
  }

  return files;
}

function getJsxAttributeName(attribute) {
  if (!ts.isJsxAttribute(attribute)) {
    return null;
  }

  return attribute.name.getText();
}

function extractStaticTestId(attribute) {
  if (!ts.isJsxAttribute(attribute)) {
    return null;
  }

  if (attribute.name.getText() !== "data-testid") {
    return null;
  }

  if (!attribute.initializer) {
    return null;
  }

  if (ts.isStringLiteral(attribute.initializer)) {
    return attribute.initializer.text;
  }

  if (!ts.isJsxExpression(attribute.initializer) || !attribute.initializer.expression) {
    return null;
  }

  const expression = attribute.initializer.expression;
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }

  return null;
}

function classifyFile(relativePath) {
  const normalized = relativePath.toLowerCase();

  if (normalized.startsWith("src/app/")) {
    if (normalized.endsWith("/page.tsx")) {
      return "page";
    }

    if (normalized.endsWith("/layout.tsx")) {
      return "layout";
    }

    if (normalized.endsWith("/loading.tsx")) {
      return "loading";
    }

    return "app-component";
  }

  if (normalized.startsWith("src/components/")) {
    return "shared-component";
  }

  if (normalized.startsWith("src/modules/")) {
    return "module-component";
  }

  return "other";
}

function resolveAreaKey(filePath) {
  const parts = filePath.split("/");
  if (parts.length < 3) {
    return filePath;
  }

  if (parts[1] === "app") {
    return "src/app";
  }

  if (parts[1] === "modules" && parts[2]) {
    return `src/modules/${parts[2]}`;
  }

  if (parts[1] === "components" && parts[2]) {
    return `src/components/${parts[2]}`;
  }

  return `src/${parts[1]}`;
}

function inspectFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const staticTestIds = [];
  const dynamicTestIds = [];
  const missingActionNodes = [];
  let actionNodeCount = 0;
  let hasAnyTestId = false;

  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      const attributes = node.attributes.properties;

      let hasDataTestId = false;
      let hasActionEvent = false;
      for (const attribute of attributes) {
        if (!ts.isJsxAttribute(attribute)) {
          continue;
        }

        const attrName = getJsxAttributeName(attribute);
        if (!attrName) {
          continue;
        }

        if (attrName === "data-testid") {
          hasDataTestId = true;
          hasAnyTestId = true;

          const staticValue = extractStaticTestId(attribute);
          if (staticValue) {
            staticTestIds.push(staticValue);
          } else {
            dynamicTestIds.push({
              tagName,
              value: attribute.getText(sourceFile),
            });
          }
        }

        if (ACTION_EVENT_ATTRIBUTES.has(attrName)) {
          hasActionEvent = true;
        }
      }

      const isActionNode =
        INTRINSIC_ACTION_TAGS.has(tagName) ||
        COMPONENT_ACTION_TAGS.has(tagName) ||
        hasActionEvent;

      if (isActionNode) {
        actionNodeCount += 1;
      }

      if (isActionNode && !hasDataTestId) {
        const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        missingActionNodes.push({
          tagName,
          line: location.line + 1,
          column: location.character + 1,
          snippet: node.getText(sourceFile).slice(0, 120),
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const relativePath = toWorkspaceRelative(filePath);
  return {
    filePath: relativePath,
    fileType: classifyFile(relativePath),
    hasAnyTestId,
    actionNodeCount,
    staticTestIds,
    dynamicTestIds,
    missingActionNodes,
    missingActionCount: missingActionNodes.length,
  };
}

function summarize(results) {
  const testIdToFiles = new Map();
  const duplicateTestIds = [];

  for (const result of results) {
    for (const value of result.staticTestIds) {
      const existing = testIdToFiles.get(value) ?? [];
      existing.push(result.filePath);
      testIdToFiles.set(value, existing);
    }
  }

  for (const [testId, locations] of testIdToFiles.entries()) {
    if (locations.length > 1) {
      duplicateTestIds.push({
        testId,
        occurrences: locations.length,
        files: [...new Set(locations)].sort(),
      });
    }
  }

  duplicateTestIds.sort((a, b) => b.occurrences - a.occurrences || a.testId.localeCompare(b.testId));

  const filesWithoutAnyTestId = results.filter((result) => !result.hasAnyTestId);
  const pageFiles = results.filter((result) => result.fileType === "page");
  const pageFilesWithoutAnyTestId = pageFiles.filter((result) => !result.hasAnyTestId);
  const pageFilesWithMissingActions = pageFiles
    .filter((result) => result.missingActionCount > 0)
    .sort((a, b) => b.missingActionCount - a.missingActionCount || a.filePath.localeCompare(b.filePath));
  const filesWithMissingActions = results.filter((result) => result.missingActionCount > 0);
  const topMissingActionFiles = [...filesWithMissingActions]
    .sort((a, b) => b.missingActionCount - a.missingActionCount || a.filePath.localeCompare(b.filePath))
    .slice(0, 50);

  const areaAccumulator = new Map();
  for (const item of results) {
    const areaKey = resolveAreaKey(item.filePath);
    const current = areaAccumulator.get(areaKey) ?? {
      area: areaKey,
      files: 0,
      filesWithoutAnyTestId: 0,
      filesWithMissingActions: 0,
      actionNodeCount: 0,
      missingActionCount: 0,
    };

    current.files += 1;
    current.actionNodeCount += item.actionNodeCount;
    current.missingActionCount += item.missingActionCount;
    if (!item.hasAnyTestId) {
      current.filesWithoutAnyTestId += 1;
    }
    if (item.missingActionCount > 0) {
      current.filesWithMissingActions += 1;
    }

    areaAccumulator.set(areaKey, current);
  }

  const areaBreakdown = [...areaAccumulator.values()].sort(
    (a, b) => b.missingActionCount - a.missingActionCount || a.area.localeCompare(b.area)
  );

  const actionCoverage = {
    totalActionNodes: results.reduce((sum, result) => sum + result.actionNodeCount, 0),
    totalMissingActionNodes: results.reduce((sum, result) => sum + result.missingActionCount, 0),
  };

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      filesScanned: results.length,
      pageFiles: pageFiles.length,
      filesWithoutAnyTestId: filesWithoutAnyTestId.length,
      pageFilesWithoutAnyTestId: pageFilesWithoutAnyTestId.length,
      filesWithMissingActions: filesWithMissingActions.length,
      staticTestIdCount: results.reduce((sum, result) => sum + result.staticTestIds.length, 0),
      dynamicTestIdCount: results.reduce((sum, result) => sum + result.dynamicTestIds.length, 0),
      duplicateTestIdCount: duplicateTestIds.length,
      ...actionCoverage,
    },
    actionCoverage: {
      ...actionCoverage,
      missingRate:
        actionCoverage.totalActionNodes === 0
          ? 0
          : Number((actionCoverage.totalMissingActionNodes / actionCoverage.totalActionNodes).toFixed(4)),
    },
    pageFilesWithoutAnyTestId: pageFilesWithoutAnyTestId.map((item) => item.filePath).sort(),
    filesWithoutAnyTestId: filesWithoutAnyTestId.map((item) => item.filePath).sort(),
    topMissingActionFiles: topMissingActionFiles.map((item) => ({
      filePath: item.filePath,
      missingActionCount: item.missingActionCount,
      actionNodeCount: item.actionNodeCount,
      sampleMissingNodes: item.missingActionNodes.slice(0, 5),
    })),
    topMissingActionPageFiles: pageFilesWithMissingActions.slice(0, 50).map((item) => ({
      filePath: item.filePath,
      missingActionCount: item.missingActionCount,
      actionNodeCount: item.actionNodeCount,
      sampleMissingNodes: item.missingActionNodes.slice(0, 5),
    })),
    areaBreakdown,
    duplicateTestIds,
    fileResults: results.map((item) => ({
      filePath: item.filePath,
      fileType: item.fileType,
      hasAnyTestId: item.hasAnyTestId,
      actionNodeCount: item.actionNodeCount,
      missingActionCount: item.missingActionCount,
      staticTestIdCount: item.staticTestIds.length,
      dynamicTestIdCount: item.dynamicTestIds.length,
    })),
    dynamicTestIdUsages: results
      .filter((result) => result.dynamicTestIds.length > 0)
      .map((result) => ({
        filePath: result.filePath,
        usages: result.dynamicTestIds,
      })),
  };
}

function renderMarkdown(summary) {
  const lines = [];
  lines.push("# Frontend data-testid Audit");
  lines.push("");
  lines.push(`Generated: ${summary.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Files scanned: ${summary.totals.filesScanned}`);
  lines.push(`- Page files: ${summary.totals.pageFiles}`);
  lines.push(`- Files without any data-testid: ${summary.totals.filesWithoutAnyTestId}`);
  lines.push(`- Page files without any data-testid: ${summary.totals.pageFilesWithoutAnyTestId}`);
  lines.push(`- Files with missing action selectors: ${summary.totals.filesWithMissingActions}`);
  lines.push(`- Static data-testid values: ${summary.totals.staticTestIdCount}`);
  lines.push(`- Dynamic data-testid values: ${summary.totals.dynamicTestIdCount}`);
  lines.push(`- Duplicate data-testid values: ${summary.totals.duplicateTestIdCount}`);
  lines.push("");
  lines.push("## Action Coverage");
  lines.push("");
  lines.push(`- Action nodes detected: ${summary.totals.totalActionNodes}`);
  lines.push(`- Missing action test IDs: ${summary.totals.totalMissingActionNodes}`);
  lines.push(`- Missing ratio: ${(summary.actionCoverage.missingRate * 100).toFixed(2)}%`);
  lines.push("");

  lines.push("## Area Breakdown");
  lines.push("");
  lines.push("| Area | Files | Files No Test ID | Files Missing Actions | Missing Actions |");
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  for (const item of summary.areaBreakdown) {
    lines.push(
      `| \`${item.area}\` | ${item.files} | ${item.filesWithoutAnyTestId} | ${item.filesWithMissingActions} | ${item.missingActionCount} |`
    );
  }
  lines.push("");

  lines.push("## Top Files Missing Action Selectors");
  lines.push("");
  lines.push("| File | Missing Actions | Total Actions |");
  lines.push("| --- | ---: | ---: |");
  for (const item of summary.topMissingActionFiles.slice(0, 30)) {
    lines.push(`| \`${item.filePath}\` | ${item.missingActionCount} | ${item.actionNodeCount} |`);
  }
  lines.push("");

  lines.push("## Top Page Files Missing Action Selectors");
  lines.push("");
  lines.push("| Page | Missing Actions | Total Actions |");
  lines.push("| --- | ---: | ---: |");
  for (const item of summary.topMissingActionPageFiles.slice(0, 30)) {
    lines.push(`| \`${item.filePath}\` | ${item.missingActionCount} | ${item.actionNodeCount} |`);
  }
  lines.push("");

  lines.push("## Page Files Without data-testid");
  lines.push("");
  for (const filePath of summary.pageFilesWithoutAnyTestId) {
    lines.push(`- \`${filePath}\``);
  }
  lines.push("");

  if (summary.duplicateTestIds.length > 0) {
    lines.push("## Duplicate data-testid Values");
    lines.push("");
    for (const duplicate of summary.duplicateTestIds) {
      lines.push(`- \`${duplicate.testId}\` (${duplicate.occurrences} usages)`);
    }
    lines.push("");
  } else {
    lines.push("## Duplicate data-testid Values");
    lines.push("");
    lines.push("- No duplicate static `data-testid` values were found.");
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function ensureOutputDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function run() {
  const files = listTsxFiles(SRC_ROOT);
  const results = files.map((filePath) => inspectFile(filePath));
  const summary = summarize(results);

  ensureOutputDir(OUTPUT_JSON);
  ensureOutputDir(OUTPUT_MD);

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  fs.writeFileSync(OUTPUT_MD, renderMarkdown(summary), "utf8");

  console.log(`Audit selesai: ${summary.totals.filesScanned} file.`);
  console.log(`Missing action test IDs: ${summary.totals.totalMissingActionNodes}.`);
  console.log(`Laporan JSON: ${toWorkspaceRelative(OUTPUT_JSON)}`);
  console.log(`Laporan Markdown: ${toWorkspaceRelative(OUTPUT_MD)}`);
}

run();
