const { spawn } = require("child_process");

function invokeVite(args) {
  const vitePath = require.resolve(".bin/vite");

  // console.log(args);
  const childProcess = spawn(vitePath, args, { stdio: "inherit", shell: true });

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => {
      childProcess.kill("SIGKILL");
    });
  });
}

module.exports = invokeVite;
