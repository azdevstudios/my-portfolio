import { loadEnv } from "vite";
import { existsSync } from "node:fs";
import { delimiter, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const repositoryRoot = resolve(projectRoot, "..");
const env = loadEnv("development", projectRoot, "");
const keys = ["MONGODB_URI", "MONGODB_DB", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "SESSION_SECRET"];
if (keys.some(key => !env[key]) || !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/i.test(env.ADMIN_PASSWORD_HASH) || env.SESSION_SECRET.length < 64) {
  throw new Error("Local environment settings are incomplete or invalid.");
}
const bin = process.env.PATH.split(delimiter).find(directory => existsSync(join(directory, "vercel.cmd")));
const cli = bin && join(bin, "..", "vercel", "dist", "vc.js");
if (!cli || !existsSync(cli)) throw new Error("Run through npm exec --package=vercel.");

for (const key of keys) {
  const result = spawnSync(process.execPath, [cli, "env", "add", key, "--environment", "production", "--sensitive", "--yes"], {
    cwd: repositoryRoot,
    input: env[key],
    encoding: "utf8",
    timeout: 60000,
    windowsHide: true,
  });
  if (result.status !== 0) {
    console.error(`${key}: configuration failed; no secret values displayed.`);
    process.exit(1);
  }
  console.log(`${key}: configured for Production.`);
}
