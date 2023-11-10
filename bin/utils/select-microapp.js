const { pathToFileURL } = require("url");
const path = require("path");
const inquirer = require("inquirer");

async function getMicroAppChoice(cb, hasMainapp = true) {
  const settings = await import(pathToFileURL(`${path.resolve(process.cwd(), "./src/config/project-settings.mjs")}`));
  const {
    default: { microapp },
  } = settings;

  if (!microapp?.apps) {
    console.warn("[CASTLE CLI] 未发现微前端的配置：project-settings.mjs -> microapp -> apps");
    return;
  }

  const choices = microapp.apps.map((app) => ({
    name: `子应用：${app.displayName}/${app.name}(${app.version})`,
    value: app,
  }));
  if (hasMainapp) {
    choices.unshift({ name: "基座应用", value: { name: "main" } });
  }

  const prompts = [
    {
      type: "list",
      name: "app",
      message: `请选择需要${hasMainapp ? "打包" : "启动"}的应用：`,
      choices,
    },
  ];

  inquirer.prompt(prompts).then((app) => {
    cb(app);
  });
}

module.exports = getMicroAppChoice;
