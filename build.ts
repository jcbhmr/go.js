#!/usr/bin/env node
import { open, readFile, mkdir, rm, chmod, glob, readdir } from "node:fs/promises";
import { openPromise } from "yauzl";
import { parseArgs } from "node:util";
import { pipeline } from "node:stream/promises";
import { posix } from "node:path";

const { values } = parseArgs({
  options: {
    goos: {
      type: "string",
    },
    goarch: {
      type: "string",
    },
  },
});
const { goos, goarch } = values;
if (!goos || !goarch) {
  throw new DOMException("'--goos <GOOS>' & '--goarch <GOARCH>' are required", "SyntaxError");
}

const packageJSON = JSON.parse(await readFile("package.json", "utf8"));
const goVersion = (packageJSON.version as string).split("+", 2)[1];
if (!goVersion) {
  throw new DOMException("No +<version> build metadata", "SyntaxError");
}

for (const entry of await readdir(".")) {
  if (entry === ".gitignore" || entry === "package.json") {
    continue;
  }
  await rm(entry, { recursive: true, force: true });
}

const toolchainVersion = `v0.0.1-go${goVersion}.${goos}-${goarch}`;
{
  const response = await fetch(
    `https://go.dev/dl/mod/golang.org/toolchain/@v/${toolchainVersion}.zip`,
  );
  if (response.status !== 200) {
    throw new DOMException(`${response.url} ${response.status}`);
  }
  if (!response.body) {
    throw new DOMException(`${response.url} no body`);
  }

  await using file = await open("toolchain.zip", "w");
  await using writeStream = file.createWriteStream();
  await pipeline(response.body, writeStream);
}

{
  const zip = await openPromise("toolchain.zip");
  using _defer1 = {
    [Symbol.dispose]() {
      zip.close();
    },
  };

  const prefix = new RegExp("^" + RegExp.escape(`golang.org/toolchain@${toolchainVersion}/`));
  for await (const entry of zip.eachEntry()) {
    let fileName = entry.fileName;
    fileName = fileName.replace(prefix, "");
    fileName = fileName.replace(/(^|\/)_go\.mod$/, "$1go.mod");
    if (fileName.endsWith("/")) {
      await mkdir(fileName, { recursive: true });
    } else {
      if (fileName === "go.mod") {
        continue;
      }
      await mkdir(posix.dirname(fileName), { recursive: true });
      await using readStream = await zip.openReadStreamPromise(entry);
      await using file = await open(fileName, "w");
      await using writeStream = file.createWriteStream();
      await pipeline(readStream, writeStream);
    }
  }
}
await rm("toolchain.zip", { force: true });
for await (const entry of glob("bin/**")) {
  await chmod(entry, 0o777);
}
for await (const entry of glob("pkg/tool/**")) {
  await chmod(entry, 0o777);
}
