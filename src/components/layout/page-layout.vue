<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <KeepAliveComponent :component="Component" :key="route.fullPath + route.name" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <KeepAliveComponent :component="Component" :key="route.fullPath + route.name" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>

<script setup>
import KeepAliveComponent from "#/components/layout/keep-alive-component.vue"
</script>
