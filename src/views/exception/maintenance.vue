<template>
  <a-result title="系统维护中" sub-title="系统维护中，请稍后再试">
    <template #icon>
      <div style="color: #0052d9" class="result-bg-img">
        <img src="../../assets/images/assets-result-maintenance.svg" />
      </div>
    </template>
    <template #extra>
      <RouterLink to="/">
        <a-button type="primary">返回首页</a-button>
      </RouterLink>
    </template>
  </a-result>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style lang="scss" scoped></style>
