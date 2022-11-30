import NProgress from "nprogress"; // progress bar
import { isLogin } from "#/utils/auth";
import { permissionsAllow, findFirstPermissionRoute } from "#/utils/permission";

import { usePermissionStore } from "#/store";

export default function setupPermissionGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const permissionStore = usePermissionStore();

    if (!permissionStore.permissionCodes.length && isLogin()) {
      await permissionStore.getPermissionData();
    }

    // to 的 meta 是一个非递归合并所有 meta 字段的（从父字段到子字段），所以只能从 matched 取最后一个
    const toRouter = to.matched[to.matched.length - 1];
    if (permissionsAllow(toRouter)) {
      to.path === "/" ? next(findFirstPermissionRoute()) : next();
    } else {
      next({
        name: "Result403",
      });
    }

    NProgress.done();
  });
}
