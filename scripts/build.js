const cp = require("child_process");

const pkg = require("../package.json");
const bundle = require("./bundle");
const clean = require("./clean");
const copy = require("./copy");
const { default: run } = require("./run");

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

module.exports = { default: build };
