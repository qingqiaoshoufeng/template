<template>
  <a-result title="403 Forbidden" sub-title="抱歉，您无权限访问此页面">
    <template #icon>
      <div style="color: #0052d9" class="result-bg-img">
        <img src="../../assets/images/assets-result-403.svg" />
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
