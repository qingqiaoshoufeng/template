<script setup>
import { ref, markRaw, computed, onBeforeUnmount } from "vue";
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

// 主题设置
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

// 设置全局定时器事件
const globalTimerNum = ref(0);
const globalTimer = setInterval(() => {
  globalTimerNum.value += 1;
  bus.emit("CASTLE__globalTimer", globalTimerNum.value);
}, 1000);

onBeforeUnmount(() => {
  clearInterval(globalTimer);
});

const globalTipText = ref({});
// 全局定时监听
bus.on("CASTLE__globalTimer", async (t) => {
  if (!(t % 30)) {
    // 监听是否发版，提示刷新浏览器
    const base = import.meta.env.BASE_URL;
    const deployInfo = await fetch(`${base !== "/" ? base : ""}/deployInfo.json?t=${new Date().getTime()}`).then(
      (res) => res.json(),
    );
    if (deployInfo.time !== window?.CASTLE__deployTime) {
      globalTipText.value = {
        text: "检测到新版本，请刷新浏览器!",
        type: "warning",
        needReload: true,
      };
    }

    // 监听接口服务器状态，定向到维护页面
    const serverStatus = typeof userSettings?.serverStatus === "function" && (await userSettings?.serverStatus());
    if (serverStatus) router.push({ name: "maintenance" });

    // 监听全局通知
    const globalTip = typeof userSettings?.globalTip === "function" && (await userSettings?.globalTip());
    if (globalTip) {
      globalTipText.value = {
        text: globalTip.text,
        type: globalTip?.type || "warning",
      };
    }
  }
});

const reloadWindow = () => {
  window.location.reload();
};
</script>

<template>
  <a-alert v-if="globalTipText.text" type="warning" show-icon class="CASTLE_global-alert">
    <template #message>
      <div class="CASTLE_global-alert-content">
        <span>
          {{ globalTipText.text }}
        </span>
        <a-button v-if="globalTipText.needReload" type="default" size="small" @click="reloadWindow">刷新页面</a-button>
      </div>
    </template>
  </a-alert>

  <a-config-provider v-bind="{ locale: zhCN, ...(userSettings?.themeConfigProvider || {}) }">
    <component v-if="isAppRoutes" :is="layout" />
    <RouterView v-else />
  </a-config-provider>
</template>

<style scoped lang="less">
.CASTLE_global-alert-content {
  display: flex;
  justify-content: space-between;
}
</style>
