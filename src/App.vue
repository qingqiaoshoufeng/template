<script setup>
import { ref, watch, markRaw, computed } from "vue";
import { RouterView, useRoute } from "vue-router";

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
  <component v-if="isAppRoutes" :is="layout" />
  <RouterView v-else />
</template>

<style scoped></style>
