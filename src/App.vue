<script setup>
import { ref, markRaw, computed } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import userSettings from "@/config/settings.js";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { bus } from "#/utils/event-bus";

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
</script>

<template>
  <a-config-provider v-bind="{ locale: zhCN, ...(userSettings?.themeConfigProvider || {}) }">
    <component v-if="isAppRoutes" :is="layout" />
    <RouterView v-else />
  </a-config-provider>
</template>

<style scoped></style>
