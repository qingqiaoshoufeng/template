<template>
  <a-result title="404 Not Found" sub-title="抱歉，您访问的页面不存在">
    <template #icon>
      <div style="color: #0052d9" class="result-bg-img">
        <img src="../../assets/images/assets-result-404.svg" alt="404 访问的页面不存在" />
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
