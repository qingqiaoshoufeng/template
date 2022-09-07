import { createRouter, createWebHistory } from "vue-router";
import { NOT_FOUND_ROUTE } from "./routers/modules/base";
import createRouteGuard from "./guard";
import appRoutes from "./routers";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      redirect: "/login",
      meta: {
        title: "首頁",
        icon: "DashboardOutlined",
      },
      children: appRoutes,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    NOT_FOUND_ROUTE,
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
