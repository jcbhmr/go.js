#!/usr/bin/env node
import { join, resolve } from "node:path";
import packageJSON from "./package.json" with { type: "json" };
import { rm, writeFile, mkdir } from "node:fs/promises";

// Any changes made to this table MUST be reflected in package.json!
const table = Object.entries({
  "linux-x64": "linux/amd64",
  "linux-ia32": "linux/386",
  "linux-arm64": "linux/arm64",
  "linux-arm": "linux/arm",
  "linux-ppc64": "linux/ppc64le",
  "linux-s390x": "linux/s390x",
  "linux-loong64": "linux/loong64",
  "linux-riscv64": "linux/riscv64",
  "win32-x64": "windows/amd64",
  "win32-arm64": "windows/arm64",
  "darwin-x64": "darwin/amd64",
  "darwin-arm64": "darwin/arm64",
  "sunos-x64": "solaris/amd64",
  "aix-ppc64": "aix/ppc64",
  "freebsd-x64": "freebsd/amd64",
}).map(([node, go]) => {
  const [os, cpu] = node.split("-", 2);
  const [goos, goarch] = go.split("/", 2);
  return { os, cpu, goos, goarch };
});
for (const { os, cpu, goos, goarch } of table) {
  const packageRoot = resolve("packages", `jcbhmr-go-${os}-${cpu}`);
  await mkdir(packageRoot, { recursive: true });
  await writeFile(
    join(packageRoot, ".gitignore"),
    ["*", "!.gitignore", "!package.json"].join("\n") + "\n",
  );
  await writeFile(
    join(packageRoot, "package.json"),
    JSON.stringify(
      {
        name: `@jcbhmr/go-${os}-${cpu}`,
        version: packageJSON.version,
        type: "module",
        files: ["*"],
        publishConfig: {
          access: "public",
          os,
          cpu,
          executableFiles: [
            ...["go", "gofmt"].map((x) => `./bin/${x}${os === "win32" ? ".exe" : ""}`),
            ...["asm", "cgo", "compile", "cover", "fix", "link", "preprofile", "vet"].map(
              (x) => `./pkg/tool/${goos}_${goarch}/${x}${os === "win32" ? ".exe" : ""}`,
            ),
          ],
        },
        scripts: {
          build: `node ../../build.ts --goos ${goos} --goarch ${goarch}`,
        },
      },
      undefined,
      2,
    ) + "\n",
  );
}
