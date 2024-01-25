export const setGenerateTimeInGlobalVariable = (deployTime) => ({
  name: "window-global-variable",
  transformIndexHtml(html) {
    // 添加脚本到HTML中以设置全局变量
    const script = `window.CASTLE__deployTime = ${deployTime};`;
    return html.replace("</head>", `<script>${script}</script></head>`);
  },
});
