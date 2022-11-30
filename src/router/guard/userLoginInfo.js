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
              redirect: to.name,
              ...to.query,
            },
          });
        }
      }
    } else {
      const hasPermissions = Boolean(to?.meta?.permissions);
      const requiresAuth = Boolean(to?.meta?.requiresAuth ?? true);
      // 没有登陆的情况下，如果当前页面在登陆页面或者当前页面不需要权限
      if (to.name === "login" || !requiresAuth) {
        if (!hasPermissions && !requiresAuth) {
          console.warn(`[Castle] 页面 ${to.name} 路由信息里面 meta -> permissions 未配置`);
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
