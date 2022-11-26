import setupUserLoginInfoGuard from "./userLoginInfo";
import setupPermissionGuard from "./permission";

export default function createRouteGuard(router) {
  // setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
