import { usePermissionStore } from "#/store";
import appRoutes from "~pages";

export const permissionsAllow = function (_router) {
  const permissionStore = usePermissionStore();
  const requiresAuth = Boolean(_router?.meta?.requiresAuth ?? true);
  return requiresAuth ? permissionStore.checkPermission(_router?.meta?.permissions, _router) : true;
};

export const findFirstPermissionRoute = function () {
  function sortRouter(routers) {
    return routers.sort((a, b) => {
      return typeof a?.meta?.sort === "number" && typeof b?.meta?.sort === "number" ? a?.meta?.sort - b?.meta?.sort : 0;
    });
  }

  const cloneRouters = [...sortRouter(appRoutes)];

  while (cloneRouters.length) {
    const firstElement = cloneRouters.shift();
    if (permissionsAllow(firstElement)) return { name: firstElement.name };
    if (firstElement?.children) {
      cloneRouters.push(...sortRouter(firstElement.children));
    }
  }
  return null;
};
