import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (process.platform !== "linux") {
  process.exit(0);
}

const linuxCssDir = join(process.cwd(), "node_modules/lightningcss-linux-x64-gnu");
const linuxOxideDir = join(process.cwd(), "node_modules/@tailwindcss/oxide-linux-x64-gnu");

if (!existsSync(linuxCssDir) || !existsSync(linuxOxideDir)) {
  run("npm", [
    "install",
    "lightningcss-linux-x64-gnu@1.30.2",
    "@tailwindcss/oxide-linux-x64-gnu@4.1.18",
    "--no-save",
    "--force",
  ]);
}
