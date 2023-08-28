const { spawn } = require("child_process");

function invokeVite(args, env) {
  const vitePath = require.resolve(".bin/vite");

  // console.log(args);
  const childProcess = spawn(
    process.platform === "win32" ? vitePath : process.execPath,
    process.platform === "win32" ? args : [vitePath, ...args],
    { stdio: "inherit", shell: true, env },
  );

  // console.log(env);

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => {
      childProcess.kill("SIGKILL");
    });
  });
}

module.exports = invokeVite;
