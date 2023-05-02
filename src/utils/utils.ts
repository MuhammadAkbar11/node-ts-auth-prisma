import readline from "readline";
import path from "path";
import fs from "fs";
import { ROOT_FOLDER } from "../configs/vars.config";
import logger from "../configs/logger.config";

export function printDivider(): string {
  const width = (
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    }) as unknown as { columns: number }
  ).columns;
  const divider = "=".repeat(width);
  return divider;
}

export function getErrorSnippets(error: Error) {
  const errorMessage = error.stack || "";
  const stackTrace = errorMessage
    .split("\n")
    .slice(1)
    .filter(stack => {
      const ignoredPatterns = [
        /\/node_modules\//,
        /at new Promise/,
        /helper\.ts/,
        /core\.ts/,
        /__awaiter/,
        /at step \(/,
        /this.throw/,
        /at Object.next/,
      ];
      return !ignoredPatterns.some(pattern => pattern.test(stack));
    });
  const codeSnippet = stackTrace
    .map(line => line.match(/at (.+) \((.+):(\d+):(\d+)\)/))
    .filter(Boolean)
    .map(match => {
      const [, , file, line, column] = match || [];
      if (!file || !line || !column) return null;
      const start = Math.max(1, Number(line) - 2);
      const end = Number(line) + 2;
      const code = fs
        .readFileSync(file, "utf-8")
        .split("\n")
        .slice(start - 1, end)
        .map((codeLine, index) => {
          const lineNumber = start + index;
          const isHighlighted = lineNumber === Number(line);
          return `${isHighlighted ? ">> " : "   "}${lineNumber}│  ${codeLine}`;
        })
        .join(`\n`);
      if (code) return `File: ${file}:${line}:${column}\n${code}`;
    })
    .filter(Boolean);

  return codeSnippet;
}

interface PackageJson {
  name: string;
  description: string;
  // Tambahkan property lain dari package.json jika diperlukan
}

export function packageJsonInfo(): PackageJson {
  try {
    const packageJsonString = fs.readFileSync(
      path.join(ROOT_FOLDER, "package.json"),
      "utf8"
    );
    const packageJson = JSON.parse(packageJsonString);
    return {
      name: packageJson.name,
      description: packageJson.description,
      // Tambahkan property lain dari package.json jika diperlukan
    };
  } catch (err) {
    logger.error("[UTILS] Failed to read package.json file.", err);
    return {
      name: "",
      description: "",
      // Tambahkan property lain dari package.json jika diperlukan
    };
  }
}

export function objHasKey<O>(
  obj: O,
  key: keyof O
): obj is O & Record<typeof key, unknown> {
  return obj !== null ? Object.prototype.hasOwnProperty.call(obj, key) : false;
}

export function isObjectEmpty(obj: Record<string, unknown>): boolean {
  return obj ? Object.keys(obj).length === 0 : false;
}
