const codeMessages = {
  400: "客户端请求的语法错误，服务器无法理解",
  401: "未认证的访问用户",
  403: "没有访问权限",
  404: "资源不见了",
  405: "请求的方法不对",
  408: "请求超时",
  413: "文件太大",
  422: "输入的内容有误",
  500: "服务器异常！正在抢修",
  502: "服务器异常！正在抢修",
  503: "服务器异常！正在抢修",
  504: "服务器超时，请联系技术支持",
};

export const getCodeMessages = (code) => {
  return codeMessages[code];
};
