import projectSettings from "@/config/project-settings.mjs";
import { loadScript } from "#/utils/load-script";
import { bus } from "#/utils/event-bus";
import { isLogin } from "#/utils/auth";

export default function setupPermissionGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const isDevMicroappMode = import.meta.env.VITE_APP_IS_DEV_MICROAPP_MODE === "true";
    const microappName = import.meta.env.VITE_APP_MICROAPP_NAME;
    const apps = projectSettings?.microapp?.apps;
    if (isDevMicroappMode) {
      const microapp = apps.find((i) => i.name === microappName);
      if (isLogin()) {
        to.path.indexOf(microapp.name) === -1 || to.path === microapp.name ? next(microapp.homePath) : next();
      } else {
        next();
      }
      return;
    }

    if (apps) {
      let microapp = {};
      for (const app of apps) {
        if (
          to.path.indexOf(`/${app.name}`) === 0 &&
          app.enabled !== false &&
          !JSON.parse(import.meta.env.VITE_APP_NOT_ENABLED_MICROAPP || "[]").includes(app.name)
        ) {
          microapp = app;
          break;
        }
      }

      const { name, version, homePath, deployBasePath = projectSettings?.microapp?.baseUrl } = microapp;
      const finallyVersion = window?.CASTLE?.microapp?.[name]?.version ?? version;
      if (name && microappName !== name) {
        const loadedMicroapp = window.CASTLE?.loadedMicroapp;
        if (loadedMicroapp.map((i) => i.name).includes(name)) {
          bus.emit("CASTLE__microappLoadedLoading", false);
          next();
        } else {
          bus.emit("CASTLE__microappLoadedLoading", true);
          const manifest = await (
            await fetch(`${deployBasePath}/microapp-${name}/${finallyVersion}/manifest.json`)
          ).json();
          const loadPath = `${deployBasePath}/microapp-${name}/${finallyVersion}/${manifest?.["node_modules/@castle/castle-template/src/utils/microapp-entry.js"]?.file}`;
          await loadScript(loadPath, { type: "module" });
          loadedMicroapp.push({ name, path: loadPath });

          if (typeof homePath === "string") {
            to.path === microapp.name ? next(homePath) : next(to.path);
          } else {
            const path = await homePath();
            next(path);
          }
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });
}
