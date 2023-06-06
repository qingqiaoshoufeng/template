import setupUserLoginInfoGuard from "./userLoginInfo";
import setupMicroappGuard from "./microapp";
import setupPermissionGuard from "./permission";
import setupOtherGuard from "./other";

export default function createRouteGuard(router) {
  setupUserLoginInfoGuard(router);
  setupMicroappGuard(router);
  setupPermissionGuard(router);
  setupOtherGuard(router);
}
