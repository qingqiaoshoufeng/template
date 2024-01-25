<template>
  <a-result title="浏览器版本低" sub-title="抱歉，您正在使用的浏览器版本过低，无法打开当前网页！">
    <template #icon>
      <div style="color: #0052d9" class="result-bg-img">
        <img src="../../assets/images/assets-result-ie.svg" />
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
