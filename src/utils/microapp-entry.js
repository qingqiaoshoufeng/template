import appRoutes from "~pages";
// import { ssrUtils } from "vue";
import "#/utils/request-interceptor";
import userSettings from "@/config/settings.js";

window.CASTLE = window.CASTLE || {};

// 设置当前的渲染实例
// ssrUtils.setCurrentRenderingInstance(
//   window.CASTLE__AppInstance || { ...window.CASTLE?._container?._vnode, refs: {}, setupState: {} },
// );

if (typeof userSettings?.lifecycle?.beforeMount === "function") {
  userSettings?.lifecycle?.beforeMount(window.CASTLE);
}

if (typeof userSettings?.lifecycle?.mounted === "function") {
  userSettings?.lifecycle?.mounted(window.CASTLE);
}

// 注册路由
appRoutes.forEach((r) => {
  window.CASTLE?.config?.globalProperties?.$router.addRoute("index", r);
  window.CASTLE?.loadedMicroappRoutes.push(r);
});

// 加载完成信号
window.CASTLE?._container?._vnode?.appContext?.provides?.bus.emit("CASTLE__microappLoaded");
