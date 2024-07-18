<template>
  <!-- https://github.com/pure-admin/vue-pure-admin/issues/67#issuecomment-1396663541 -->
  <router-view v-slot="{ Component }">
    <keep-alive :include="cacheList" :exclude="excludeCacheList" :max="10">
      <a-spin :spinning="loading">
        <component :is="Component" :key="undefined" />
      </a-spin>
    </keep-alive>
  </router-view>
</template>

<script setup>
import { computed, ref, inject } from "vue";
// @ts-ignore
import { useTabBarStore } from "#/store";
const tabBarStore = useTabBarStore();

const cacheList = computed(() => tabBarStore.getCacheList);
const excludeCacheList = computed(() => tabBarStore.getExcludeCacheList);

const loading = ref(false);
const bus = inject("bus");
bus.on("CASTLE__globalLoading", (status) => (loading.value = status));
</script>

<style scoped lang="less"></style>
