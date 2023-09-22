<template>
  <!-- https://github.com/pure-admin/vue-pure-admin/issues/67#issuecomment-1396663541 -->
  <router-view v-slot="{ Component }">
    <keep-alive :include="cacheList" :max="10">
      <component :is="Component" :key="undefined" />
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
