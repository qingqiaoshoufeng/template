<template>
  <img v-if="logo?.path" :src="logo?.path" :style="`width: ${logo?.width}; height:${logo?.height}`" :alt="appTitle" />
  <img v-else src="@/assets/images/logo.png" :style="`width: ${logo?.width}; height:${logo?.height}`" :alt="appTitle" />
</template>

<script setup>
import { computed } from "vue";
import userSettings from "#/utils/get-user-settings.js";
import { useAppStore } from "#/store";

const appStore = useAppStore();
const appTitle = computed(() => (typeof appStore.title === "function" ? appStore.title() : appStore.title));
const logo = userSettings?.logo;
</script>

<style lang="scss" scoped></style>
