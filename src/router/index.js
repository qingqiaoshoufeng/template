import { createRouter, createWebHistory } from "vue-router";
import { NOT_FOUND_ROUTE, FORBIDDEN_ROUTE } from "./routers/modules/base";
import createRouteGuard from "./guard";
import appRoutes from "~pages";

import userSettings from "@/config/settings.js";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";

const BASIC_LAYOUT = () => import("#/layout/basic-layout.vue");

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      redirect: userSettings.homePath,
      component: BASIC_LAYOUT,
      meta: {
        title: "首页",
        requiresAuth: false,
      },
      children: appRoutes,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("#/views/login/index.vue"),
      meta: {
        requiresAuth: false,
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
