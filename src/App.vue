<script setup>
import { ref, watch, markRaw, computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import userSettings from "@/config/settings.js";
import zhCN from "ant-design-vue/es/locale/zh_CN";

const LAYOUTS = {
  default: import("#/layout/basic-layout.vue"),
  blank: import("#/layout/page-layout.vue"),
};

const route = useRoute();
const layout = ref();

watch(
  () => route?.meta?.layout,
  async (metaLayout) => {
    const component = (await LAYOUTS[metaLayout]) || (await LAYOUTS["default"]);
    layout.value = markRaw(component?.default);
  },
  { immediate: true },
);

const isAppRoutes = computed(() => route.matched.map((i) => i.path).includes("/"));
</script>

<template>
  <a-config-provider v-bind="{ locale: zhCN, ...(userSettings?.themeConfigProvider || {}) }">
    <component v-if="isAppRoutes" :is="layout" />
    <RouterView v-else />
  </a-config-provider>
</template>

<style scoped></style>
