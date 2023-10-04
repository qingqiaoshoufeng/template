<script setup>
import { ref, markRaw, computed } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import userSettings from "#/utils/getUserSettings.js";
import zhCN from "@castle/ant-design-vue/es/locale/zh_CN";
import { bus } from "#/utils/event-bus";
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  // auto as followSystemColorScheme,
  // exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled,
} from "darkreader";

const LAYOUTS = {
  default: import("#/layout/basic-layout.vue"),
  blank: import("#/layout/page-layout.vue"),
};

const route = useRoute();
const router = useRouter();
const layout = ref();
let lastLayoutType = "";

const handleLayout = async ({ metaLayout, to }) => {
  if (lastLayoutType === metaLayout) return;
  lastLayoutType = metaLayout;

  setTimeout(() => router.push(to));

  const component = (await LAYOUTS[metaLayout]) || (await LAYOUTS["default"]);
  layout.value = markRaw(component?.default);
};

bus.on("CASTLE__changeLayout", (e) => handleLayout(e));

const isAppRoutes = computed(() => route.matched.map((i) => i.path).includes("/"));

const defaultTheme = {
  brightness: 100,
  contrast: 100,
  sepia: 0,
};

const defaultFixes = {
  invert: [],
  css: ".ant-pro-global-header-layout-mix .ant-switch { background-color: var(--darkreader-border--ant-primary-3)!important; }",
  ignoreInlineStyle: [],
  ignoreImageAnalysis: [],
};

bus.on("CASTLE__changeDarknessMode", (v) => {
  if (v) {
    disableDarkMode();
  } else {
    if (isDarkReaderEnabled()) return;
    enableDarkMode(
      {
        ...defaultTheme,
        ...userSettings?.darkness?.theme,
      },
      {
        ...defaultFixes,
        ...userSettings?.darkness?.fixes,
      },
    );
  }
  localStorage.setItem("CASTLE__darknessMode", v ? "light" : "dark");
});

const localCastleDarknessMode = localStorage.getItem("CASTLE__darknessMode");
if (
  localCastleDarknessMode === "dark" ||
  (!localCastleDarknessMode && userSettings?.darkness?.defaultMode === "dark")
) {
  bus.emit("CASTLE__changeDarknessMode", false);
}

// window.CASTLE__AppInstance = getCurrentInstance();
</script>

<template>
  <a-config-provider v-bind="{ locale: zhCN, ...(userSettings?.themeConfigProvider || {}) }">
    <component v-if="isAppRoutes" :is="layout" />
    <RouterView v-else />
  </a-config-provider>
</template>

<style scoped></style>
