const path = require("path");
const chokidar = require("chokidar");

const { cleanDir, copyDir, copyFile, makeDir, writeFile } = require("./lib/fs");
const format = require("./lib/time");

const pkg = require("../package.json");

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir("build");
  await Promise.all([
    writeFile(
      "build/package.json",
      JSON.stringify(
        {
          private: true,
          engines: pkg.engines,
          dependencies: pkg.dependencies,
          scripts: {
            start: "node server.js",
          },
        },
        null,
        2
      )
    ),
    copyFile("LICENSE", "build/LICENSE"),
    copyFile("package-lock.json", "build/package-lock.json"),
    copyDir("public", "build/public"),
    copyDir("src/templates", "build/templates"),
  ]);

  if (process.argv.includes("--watch")) {
    const watcher = chokidar.watch(["public/**/*"], { ignoreInitial: true });

    watcher.on("all", async (event, filePath) => {
      const start = new Date();
      const src = path.relative("./", filePath);
      const dist = path.join(
        "build/",
        src.startsWith("src") ? path.relative("src", src) : src
      );
      switch (event) {
        case "add":
        case "change":
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case "unlink":
        case "unlinkDir":
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      const end = new Date();
      const time = end.getTime() - start.getTime();
      console.info(`[${format(end)}] ${event} '${dist}' after ${time} ms`);
    });
  }
}

module.exports = copy;
