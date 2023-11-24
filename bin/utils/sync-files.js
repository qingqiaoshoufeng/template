const fs = require("fs");
const path = require("path");

function syncFiles() {
  const publicFolder = `${path.resolve(process.cwd(), "./public")}`;
  const cdnFolder = `${path.resolve(process.cwd(), "./public/cdn")}`;

  if (!fs.existsSync(publicFolder)) {
    fs.mkdirSync(publicFolder);
  }

  if (!fs.existsSync(cdnFolder)) {
    fs.mkdirSync(cdnFolder);
  }

  fs.copyFileSync(
    `${path.resolve(__dirname + "/sync-files/vue-demi@0.14.5.min.js")}`,
    `${path.resolve(process.cwd(), "./public/cdn/vue-demi@0.14.5.min.js")}`,
  );

  fs.copyFileSync(
    `${path.resolve(__dirname + "/sync-files/vue.global@3.2.47.min.js")}`,
    `${path.resolve(process.cwd(), "./public/cdn/vue.global@3.2.47.min.js")}`,
  );
}

module.exports = syncFiles;
