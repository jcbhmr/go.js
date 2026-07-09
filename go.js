#!/usr/bin/env node
import process from "node:process";
import { fileURLToPath } from "node:url";

const nameSuffix = `-${process.platform}-${process.arch}`;
const exeExt = process.platform === "win32" ? ".exe" : "";
const path = fileURLToPath(import.meta.resolve(`@jcbhmr/go${nameSuffix}/bin/go${exeExt}`));
const args = process.argv.slice(2);
if (process.execve) {
  process.execve(path, [path, ...args]);
} else {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(path, args, { stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  process.exit(result.status);
}
