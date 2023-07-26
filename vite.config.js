import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Pages from "vite-plugin-pages";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import { merge } from "lodash";
// import Components from "unplugin-vue-components/vite";
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default async ({ command, mode }) => {
  const settings = await import(pathToFileURL(`${path.resolve(process.cwd(), "./src/config/project-settings.mjs")}`));
  const {
    default: { server, vite },
  } = settings;

  const isMicroappMode = mode.indexOf("microapp›") > -1;
  const isMainappMode = mode.indexOf("mainapp›") > -1;
  const appName = mode.split("›")?.[1];
  const appVersion = mode.split("›")?.[2];

  const getRollupOptions = () => ({
    input: path.resolve(process.cwd(), "./node_modules/@castle/castle-template/src/utils/microapp-entry.js"),
  });

  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), "");

  const defaultConfig = defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      Pages({
        routeStyle: "next",
        exclude: ["**/*/_*.@(vue|js|jsx)"],
        dirs:
          isMainappMode || isMicroappMode
            ? { dir: `src/pages/${isMainappMode ? "mainapp" : `microapp-${appName}`}`, baseRoute: isMainappMode ?  "" : appName }
            : "src/pages",
      }),
      vueSetupExtend(),
      // Components({
      //   resolvers: [AntDesignVueResolver({ importStyle: false })],
      // }),
    ],
    base: isMicroappMode && command === "build" ? `/${appName}/${appVersion}` : undefined,
    build: {
      rollupOptions: isMicroappMode ? getRollupOptions() : undefined,
      assetsDir: isMicroappMode ? "" : "assets",
      manifest: isMicroappMode,
      minify: true,
    },
    server: server && server({ command, mode, env }),
    resolve: {
      alias: {
        "~": path.resolve(process.cwd(), "./"),
        "@": path.resolve(process.cwd(), "./src"),
        "#": path.resolve(process.cwd(), "./node_modules/@castle/castle-template/src"),
      },
    },
    optimizeDeps: {
      include: [
        "@castle/ant-design-vue",
        "@castle/ant-design-vue/es/locale/zh_CN",
        "@castle/pro-layout",
        "@ant-design/icons-vue",
        "@ant-design/icons-svg",
        "axios",
        "vue",
        "pinia",
        "nprogress",
        "jsencrypt",
        "darkreader",
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  });

  const userConfig = vite && vite({ command, mode, env });

  return merge(defaultConfig, userConfig);
};
