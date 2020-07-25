import cp from "child_process";

import pkg from "../package.json";
import bundle from "./bundle";
import clean from "./clean";
import copy from "./copy";
import run from "./run";

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
  await run(clean);
  await run(copy);
  await run(bundle);

  if (process.argv.includes("--docker")) {
    cp.spawnSync("docker", ["build", "-t", pkg.name, "."], {
      stdio: "inherit",
    });
  }
}

export default build;
