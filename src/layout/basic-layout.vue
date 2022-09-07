<template>
  <pro-layout
    v-bind="layoutConf"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: breadcrumb }"
    :loading="loading"
  >
    <template #menuHeaderRender>
      <a>
        <img src="@/assets/images/logo.png" />
        <h1>Castle</h1>
      </a>
    </template>

    <!-- custom breadcrumb itemRender  -->
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{ route.breadcrumbName }}</span>
      <router-link v-else :to="{ path: route.path, params }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>

    <template #rightContentRender>
      <avatar-dropdown :menu="state.showMenu" :current-user="state.currentUser" />
    </template>

    <!-- content begin -->
    <router-view v-slot="{ Component }">
      <!-- <WaterMark :content="watermarkContent"> -->
      <component :is="Component" />
      <!-- </WaterMark> -->
    </router-view>
  </pro-layout>
</template>

<script setup>
import { reactive, computed, watchEffect, ref } from "vue";
import { useRouter } from "vue-router";
import { getMenuData, clearMenuItem } from "@ant-design-vue/pro-layout";

const router = useRouter();

const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const loading = ref(false);

const state = reactive({
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
  showMenu: true,
  currentUser: {
    // TODO: 记得修改名称
    name: "admin",
  },
});

// 更多配置参考 https://www.npmjs.com/package/@ant-design-vue/pro-layout
const layoutConf = reactive({
  navTheme: "realDark",
  headerTheme: "dark",
  layout: "mix",
  splitMenus: false,
  menuData,
});

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat();
    state.selectedKeys = matched.filter((r) => r.name !== "index").map((r) => r.path);
    state.openKeys = matched.filter((r) => r.path !== router.currentRoute.value.path).map((r) => r.path);
  }
});

const breadcrumb = computed(() =>
  router.currentRoute.value.matched.concat().map((item) => {
    return {
      path: item.path,
      breadcrumbName: item.meta.title || "",
    };
  }),
);
</script>
