import axios from "axios";

const downloadFile = async (path, fileName, config, method) => {
  if (!(path && fileName)) {
    throw "缺少 path 和 fileName 参数！";
  }

  method = method || "get";
  config = config || {};

  const data = await axios({
    url: path,
    method,
    ...config,
    responseType: "blob",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(data);
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  document.body.removeChild(a);

  return Promise.resolve();
};

export { downloadFile };
