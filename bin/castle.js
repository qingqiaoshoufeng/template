#!/usr/bin/env node
const path = require("path");
const { Command } = require("commander");

const program = new Command();

program.name("Castle CLI").description("Castle 脚手架").version(require("../package.json").version);

// program.version(require("../package.json").version).usage("<command> [options] ");

program.command("dev").action((...args) => {
  // const castleTemplatePath = path.resolve(process.cwd(), "./node_modules/castle-template");
  const castleTemplatePath = "C:\\Users\\Administrator\\Documents\\codes\\template";

  // console.log(castleTemplatePath);

  // console.log(process.cwd());
  require("./utils/invoke-vite")(["serve", castleTemplatePath]);
});

program.parse(process.argv);
