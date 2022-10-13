import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), Pages()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "#": path.resolve(process.cwd(), "./node_modules/@castle/castle-template/src"),
    },
  },
  optimizeDeps: {
    include: ["ant-design-vue", "@ant-design-vue/pro-layout", "@ant-design/icons-vue", "axios", "vue", "pinia"],
  },
});
