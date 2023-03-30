<template>
  <a-switch v-model:checked="status">
    <template #checkedChildren><icons mode="light" /></template>
    <template #unCheckedChildren><icons mode="dark" /></template>
  </a-switch>
</template>

<script setup>
import icons from "./icons.vue";
import { ref, watch } from "vue";
import { bus } from "#/utils/event-bus";

const status = ref(localStorage.getItem("CASTLE__darknessMode") !== "dark");

watch(status, (v) => bus.emit("CASTLE__changeDarknessMode", v));
</script>

<style lang="less" scoped></style>
