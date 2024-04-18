<template>
  <a-result title="网络异常" sub-title="网络异常，请稍后再试">
    <template #icon>
      <div style="color: #0052d9" class="result-bg-img">
        <img src="../../assets/images/assets-result-wifi.svg" alt="网络异常" />
      </div>
    </template>
    <template #extra>
      <a-button type="primary" @click="reloadPage">刷新页面</a-button>
      <RouterLink to="/">
        <a-button type="default">返回首页</a-button>
      </RouterLink>
    </template>
  </a-result>
</template>

<script setup>
import { RouterLink } from "vue-router";
const reloadPage = () => location.reload();
</script>

<style lang="scss" scoped></style>
