import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Pages from "vite-plugin-pages";
import { merge } from "lodash";

// https://vitejs.dev/config/
export default async ({ command, mode }) => {
  const settings = await import(pathToFileURL(`${path.resolve(process.cwd(), "./src/config/project-settings.mjs")}`));
  const {
    default: { server, vite },
  } = settings;

  const defaultConfig = defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      Pages({
        routeStyle: "next",
        exclude: ["**/*/_*.@(vue|js|jsx)"],
      }),
    ],
    server: server && server({ command, mode }),
    resolve: {
      alias: {
        "~": path.resolve(process.cwd(), "./"),
        "@": path.resolve(process.cwd(), "./src"),
        "#": path.resolve(process.cwd(), "./node_modules/@castle/castle-template/src"),
      },
    },
    optimizeDeps: {
      include: [
        "ant-design-vue",
        "@ant-design-vue/pro-layout",
        "@ant-design/icons-vue",
        "axios",
        "vue",
        "pinia",
        "nprogress",
        "jsencrypt",
      ],
    },
  });

  const userConfig = vite && vite({ command, mode });

  return merge(defaultConfig, userConfig);
};
