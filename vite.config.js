import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Pages from "vite-plugin-pages";
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import filterReplace from "vite-plugin-filter-replace";
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
  const microappName = mode.split("›")?.[1];
  const microappVersion = mode.split("›")?.[2];

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
        dirs: isMicroappMode ? { dir: `src/pages/microapp-${microappName}`, baseRoute: microappName } : "src/pages",
      }),
      vueSetupExtend(),
      filterReplace([
        {
          filter: ["node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js"],
          replace(source) {
            const replaceSource = source
              .replace(
                "const Text = Symbol((process.env.NODE_ENV !== 'production') ? 'Text' : undefined);",
                "const Text = window.CASTLE?.nodeTypeSymbol?.Text",
              )
              .replace(
                "const Comment = Symbol((process.env.NODE_ENV !== 'production') ? 'Comment' : undefined);",
                "const Comment = window.CASTLE?.nodeTypeSymbol?.Comment",
              )
              .replace(
                "const Fragment = Symbol((process.env.NODE_ENV !== 'production') ? 'Fragment' : undefined);",
                "const Fragment = window.CASTLE?.nodeTypeSymbol?.Fragment",
              )
              .replace(
                "const Static = Symbol((process.env.NODE_ENV !== 'production') ? 'Static' : undefined);",
                "const Static = window.CASTLE?.nodeTypeSymbol?.Static",
              )
              // 修复子应用设置空ref报错的问题
              .replace("refs[ref] = value;", "if(refs && refs[ref]) refs[ref] = value;");
            return isMicroappMode ? replaceSource : source;
          },
        },
      ]),
      // Components({
      //   resolvers: [AntDesignVueResolver({ importStyle: false })],
      // }),
    ],
    base: isMicroappMode && command === "build" ? `/${microappName}/${microappVersion}` : undefined,
    build: {
      rollupOptions: isMicroappMode ? getRollupOptions() : undefined,
      assetsDir: isMicroappMode ? "" : "assets",
      manifest: isMicroappMode,
      minify: false,
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
