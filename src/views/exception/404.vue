<template>
  <a-result title="404 Not Found" sub-title="抱歉，您访问的页面不存在">
    <template #icon>
      <div style="color: #0052d9" class="result-bg-img">
        <img src="../../assets/images/assets-result-404.svg" />
      </div>
    </template>
    <template #extra>
      <RouterLink to="/HOME_PAGE">
        <a-button type="primary">返回首页</a-button>
      </RouterLink>
    </template>
  </a-result>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style lang="scss" scoped></style>
