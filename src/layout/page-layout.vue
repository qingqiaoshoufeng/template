<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cacheList" :max="10">
      <KeepAliveComponent :component="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import KeepAliveComponent from "#/components/layout/keep-alive-component.vue"
import { computed } from "vue";
// @ts-ignore
import { useTabBarStore } from "#/store";
const tabBarStore = useTabBarStore();

const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
