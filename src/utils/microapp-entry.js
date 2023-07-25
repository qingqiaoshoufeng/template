import appRoutes from "~pages";
import { ssrUtils } from "vue";

window.CASTLE = window.CASTLE || {};

// 设置当前的渲染实例
ssrUtils.setCurrentRenderingInstance(window.CASTLE?.latestComponentInternalInstance);

// 注册路由
appRoutes.forEach((r) => {
  window.CASTLE?.config?.globalProperties?.$router.addRoute("index", r);
  window.CASTLE?.loadedMicroappRoutes.push(r);
});

// 加载完成信号
window.CASTLE?._container?._vnode?.appContext?.provides?.bus.emit("CASTLE__microappLoaded");
