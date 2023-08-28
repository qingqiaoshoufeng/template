import { createRouter, createWebHistory } from "vue-router";
import { NOT_FOUND_ROUTE, FORBIDDEN_ROUTE } from "./routers/modules/base";
import createRouteGuard from "./guard";
import appRoutes from "~pages";
import userSettings from "@/config/settings.js";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const isDevMicroappMode = import.meta.env.VITE_APP_IS_DEV_MICROAPP_MODE === "true";
const microappHomePath = import.meta.env.VITE_APP_MICROAPP_HOME_PATH;
const getHomePath = () => {
  return isDevMicroappMode ? microappHomePath : userSettings.homePath;
};

const router = createRouter({
  history: userSettings?.router?.history
    ? userSettings.router.history(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      redirect: userSettings.homePath === "/" ? undefined : getHomePath(),
      meta: {
        title: "首页",
        requiresAuth: false,
      },
      children: appRoutes.filter((i) => i?.name.indexOf("microapp-") === -1),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("#/views/login/index.vue"),
      meta: {
        requiresAuth: false,
        permissions: [],
      },
    },
    NOT_FOUND_ROUTE,
    FORBIDDEN_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// 全局路由守卫
createRouteGuard(router);

// reset router
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
