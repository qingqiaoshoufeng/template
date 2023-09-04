const fs = require("fs");
const path = require("path");

function syncFiles() {
  const cdnFiles = `${path.resolve(process.cwd(), "./public/cdn")}`;
  if (!fs.existsSync(cdnFiles)) {
    fs.mkdirSync(cdnFiles);
    fs.copyFileSync(
      `${path.resolve(__dirname + "/sync-files/vue-demi@0.14.5.min.js")}`,
      `${path.resolve(process.cwd(), "./public/cdn/vue-demi@0.14.5.min.js")}`,
    );

    fs.copyFileSync(
      `${path.resolve(__dirname + "/sync-files/vue.global@3.2.47.min.js")}`,
      `${path.resolve(process.cwd(), "./public/cdn/vue.global@3.2.47.min.js")}`,
    );
  }

  // cb();
}

module.exports = syncFiles;
