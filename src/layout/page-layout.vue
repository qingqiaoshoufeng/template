<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cacheList" :max="10">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { computed } from "vue";
// @ts-ignore
import { useTabBarStore } from "#/store";
const tabBarStore = useTabBarStore();

const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
