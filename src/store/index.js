import { createPinia } from "pinia";
import useAppStore from "./modules/app";
import useUserStore from "./modules/user";
import usePermissionStore from "./modules/permission";
// import useTabBarStore from "./modules/tab-bar";

const pinia = createPinia();

export { useUserStore, useAppStore, usePermissionStore };

export default pinia;
