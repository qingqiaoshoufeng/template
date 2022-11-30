import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";
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
      }),
    ],
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
        "ant-design-vue",
        "ant-design-vue/es/locale/zh_CN",
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

  const userConfig = vite && vite({ command, mode, env });

  return merge(defaultConfig, userConfig);
};
