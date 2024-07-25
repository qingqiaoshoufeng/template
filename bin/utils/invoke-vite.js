const { spawn } = require("child_process");
const syncFiles = require("./sync-files.js");

function invokeVite(args, env, detached = false) {
  return new Promise((resolve, reject) => {
    try {
      syncFiles();
      const vitePath = require.resolve(".bin/vite");

      // console.log(args);
      const childProcess = spawn(
        process.platform === "win32" ? vitePath : process.execPath,
        process.platform === "win32" ? args : [vitePath, ...args],
        { stdio: "inherit", shell: true, env, detached },
      );

      // console.log(env);
      ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => {
          childProcess.kill("SIGKILL");
        });
      });

      // 监听子进程的正常退出
      ["beforeExit"].forEach((signal) => {
        process.on(signal, () => resolve());
      });

      // 监听子进程的异常退出
      ["exit"].forEach((signal) => {
        childProcess.on(signal, (code) => {
          if (code !== 0) {
            reject();
            process.exit(code);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = invokeVite;
