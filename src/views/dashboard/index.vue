<template>
  <PageContainer fixed-header :title="$route.meta.title" sub-title="is a sub-title.">
    <h1>dadad</h1>
    <RouterLink to="workplace1">Home</RouterLink>
  </PageContainer>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
