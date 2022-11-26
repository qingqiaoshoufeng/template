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

    if (permissionsAllow(to)) {
      to.path === "/" ? next(findFirstPermissionRoute()) : next();
    } else {
      next({
        name: "Result403",
      });
    }

    NProgress.done();
  });
}
