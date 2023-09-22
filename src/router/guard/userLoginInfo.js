import { useUserStore } from "#/store";
import { isLogin } from "#/utils/auth";
import NProgress from "nprogress";

export default function setupUserLoginInfoGuard(router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    const userStore = useUserStore();

    if (isLogin()) {
      if (userStore.name || userStore.role) {
        next();
      } else {
        try {
          await userStore.getUserInfo();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: "login",
            query: {
              redirect: to.name !== "Result404" ? to.name : undefined,
              ...to.query,
            },
          });
        }
      }
    } else {
      // to 的 meta 是一个非递归合并所有 meta 字段的（从父字段到子字段），所以只能从 matched 取最后一个
      const toRouter = to.matched[to.matched.length - 1];
      const hasPermissions = Boolean(toRouter?.meta?.permissions);
      const requiresAuth = Boolean(toRouter?.meta?.requiresAuth ?? true);
      // 没有登陆的情况下，如果当前页面在登陆页面或者当前业务页面不需要权限
      if (toRouter.name === "login" || (!["Result404", "Result403"].includes(toRouter.name) && !requiresAuth)) {
        if (!hasPermissions && !requiresAuth) {
          console.warn(`[Castle] 页面 ${toRouter.name} 路由信息里面 meta -> permissions 未配置`);
        }

        next();
        return;
      }
      next({
        name: "login",
        query: {
          redirect: to.name,
          ...to.query,
        },
      });
    }
  });
}
