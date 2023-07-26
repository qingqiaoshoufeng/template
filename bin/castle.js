#!/usr/bin/env node
const path = require("path");
const { pathToFileURL } = require("url");
const { Command } = require("commander");
const fs = require("fs");

const program = new Command();

program.name("Castle CLI").description("Castle 脚手架").version(require("../package.json").version);

const configPath = path.resolve(__dirname, "../vite.config.js");

// program.version(require("../package.json").version).usage("<command> [options] ");

const handleAction = (command, str, { args = [] }) => {
  // console.log(args);
  // console.log(str);

  // 给husky执行文件添加可执行权限
  const huskyPreCommitPath = path.resolve(process.cwd(), "./.husky/pre-commit");
  const huskyCommitMsgPath = path.resolve(process.cwd(), "./.husky/commit-msg");
  fs.chmod(huskyPreCommitPath, 0o755, (err) => {
    if (err) throw err;
  });
  fs.chmod(huskyCommitMsgPath, 0o755, (err) => {
    if (err) throw err;
  });

  const strArray = [];
  const keys = Object.keys(str);
  keys.forEach((key) => {
    strArray.push(`${key.length > 1 ? "--" : "-"}${key}`);
    if (typeof str[key] !== "boolean") strArray.push(str[key]);
  });

  // console.log(["serve", "--config", configPath, ...args, ...strArray]);
  require("./utils/invoke-vite")([command, "--config", configPath, ...args, ...strArray]);
  // require("./utils/invoke-vite")(["serve", "--config", configPath, "--debug"]);
};

program
  .command("dev")
  .description("在当前目录下启动 Vite 开发服务器")
  .option("--base <path>", `[string] public base path (default: /)`)
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`)
  .option("-d, --debug [feat]", `[string | boolean] show debug logs`)
  .option("-f, --filter <filter>", `[string] filter debug logs`)
  .option("-m, --mode <mode>", `[string] set env mode`)
  .option("--host [host]", `[string] specify hostname`)
  .option("--port <port>", `[number] specify port`)
  .option("--https", `[boolean] use TLS + HTTP/2`)
  .option("--open [path]", `[boolean | string] open browser on startup`)
  .option("--cors", `[boolean] enable CORS`)
  .option("--strictPort", `[boolean] exit if specified port is already in use`)
  .option("--force", `[boolean] force the optimizer to ignore the cache and re-bundle`)
  .action((...args) => {
    handleAction(...["serve", ...args]);
  });

program
  .command("build")
  .description("构建生产版本")
  .option("-m, --mode <mode>", `[string] set env mode`)
  .option("--target <target>", `[string] transpile target (default: 'modules')`)
  .option("--outDir <dir>", `[string] output directory (default: dist)`)
  .option("--assetsDir <dir>", `[string] directory under outDir to place assets in (default: assets)`)
  .option("--assetsInlineLimit <number>", `[number] static asset base64 inline threshold in bytes (default: 4096)`)
  .option("--ssr [entry]", `[string] build specified entry for server-side rendering`)
  .option("--sourcemap", `[boolean] output source maps for build (default: false)`)
  .option(
    "--minify [minifier]",
    `[boolean | "terser" | "esbuild"] enable/disable minification, ` + `or specify minifier to use (default: esbuild)`,
  )
  .option("--manifest [name]", `[boolean | string] emit build manifest json`)
  .option("--ssrManifest [name]", `[boolean | string] emit ssr manifest json`)
  .option("--force", `[boolean] force the optimizer to ignore the cache and re-bundle (experimental)`)
  .option("--emptyOutDir", `[boolean] force empty outDir when it's outside of root`)
  .option("-w, --watch", `[boolean] rebuilds when modules have changed on disk`)
  .action((...args) => {
    handleAction(...["build", ...args]);
  });

program
  .command("dev:microapp")
  .description("在当前目录下启动 Vite 开发服务器，并打开对应的微应用")
  // eslint-disable-next-line no-unused-vars
  .action((...args) => {
    require("./utils/select-microapp")(({ app: { name, version } }) => {
      handleAction(...["serve", { m: `dev:microapp›${name}›${version}` }, {}]);
    }, false);
  });

program
  .command("build:microapp")
  .description("构建微前端应用生产版本")
  .option("--microappName <name>", `[string] set microapp name`)
  .action(async (...args) => {
    const argsObj = Object(...[...args]);
    const handleActionFn = (name, version) => {
      handleAction(
        ...["build", { m: `build:microapp›${name}›${version}`, outDir: `dist/mainapp-${name}/${version}` }, {}],
      );
      // handleAction(...["build", { m: `build:microapp›${name}›${version}`, outDir: `public/${name}/${version}` }, {}]);
    };

    if (argsObj?.microappName) {
      if (argsObj?.microappName === "main") {
        handleAction(...["build", { m: `build:mainapp›main›latest` }, {}]);
      } else {
        const settings = await import(
          pathToFileURL(`${path.resolve(process.cwd(), "./src/config/project-settings.mjs")}`)
        );

        const {
          default: { microapp },
        } = settings;

        const app = microapp.apps.find((app) => app.name === argsObj?.microappName);
        handleActionFn(app?.name, app?.version);
      }
    } else {
      require("./utils/select-microapp")(({ app: { name, version } }) => {
        // const argsObj = Object(...[...args]);
        // const mode = argsObj?.app ? { m: `microapp:${argsObj?.app}` } : {};
        if (name === "main") {
          handleAction(...["build", { m: `build:mainapp›main›latest` }, {}]);
        } else {
          handleActionFn(name, version);
        }
      });
    }
  });

program
  .command("optimize")
  .description("预构建依赖")
  .option("--force", `[boolean] force the optimizer to ignore the cache and re-bundle`)
  .action((...args) => {
    handleAction(...["optimize", ...args]);
  });

program
  .command("preview")
  .description("本地预览构建产物")
  .option("--host [host]", `[string] specify hostname`)
  .option("--port <port>", `[number] specify port`)
  .option("--strictPort", `[boolean] exit if specified port is already in use`)
  .option("--https", `[boolean] use TLS + HTTP/2`)
  .option("--open [path]", `[boolean | string] open browser on startup`)
  .option("--outDir <dir>", `[string] output directory (default: dist)`)
  .action((...args) => {
    handleAction(...["preview", ...args]);
  });

program.parse(process.argv);
