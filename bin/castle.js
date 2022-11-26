#!/usr/bin/env node
const path = require("path");
const { Command } = require("commander");

const program = new Command();

program.name("Castle CLI").description("Castle 脚手架").version(require("../package.json").version);

const configPath = path.resolve(process.cwd(), "./node_modules/@castle/castle-template/vite.config.js");

// program.version(require("../package.json").version).usage("<command> [options] ");

program.command("dev").action((...args) => {
  require("./utils/invoke-vite")(["serve", "--config", configPath]);
});

program.command("build").action((...args) => {
  require("./utils/invoke-vite")(["build", "--config", configPath]);
});

program.parse(process.argv);