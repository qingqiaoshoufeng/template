import projectSettings from "@/config/project-settings.mjs";
import { loadScript } from "#/utils/load-script";
import { bus } from "#/utils/event-bus";

export default function setupPermissionGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const apps = projectSettings?.microapp?.apps;
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

      const { name, version, homePath } = microapp;
      if (name && import.meta.env.VITE_APP_MICROAPP_NAME !== name) {
        const loadedMicroapp = window.CASTLE?.loadedMicroapp;
        if (loadedMicroapp.map((i) => i.name).includes(name)) {
          bus.emit("castle-microapp-loaded-loading", false);
          next();
        } else {
          bus.emit("castle-microapp-loaded-loading", true);
          const manifest = await (await fetch(`/${name}/${version}/manifest.json`)).json();
          const loadPath = `/${name}/${version}/${manifest?.["node_modules/@castle/castle-template/src/utils/microapp-entry.js"]?.file}`;
          await loadScript(loadPath, { type: "module" });
          loadedMicroapp.push({ name, path: loadPath });
          next(homePath);
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });
}
