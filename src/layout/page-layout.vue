<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <WaterMark :content="watermarkContent">
        <keep-alive :include="cacheList" :max="10">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </WaterMark>
    </transition>
  </router-view>
</template>

<script setup>
import { computed } from "vue";
import { WaterMark } from "@castle/pro-layout";
// @ts-ignore
import { useTabBarStore, useAppStore, useUserStore } from "#/store";

const tabBarStore = useTabBarStore();
const appStore = useAppStore();
const userStore = useUserStore();

const cacheList = computed(() => tabBarStore.getCacheList);

const watermarkContent = computed(() => appStore.watermarkContent(userStore));
</script>

<style scoped lang="less"></style>
