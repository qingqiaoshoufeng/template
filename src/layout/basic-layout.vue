<template>
  <pro-layout
    v-bind="layoutConf"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: breadcrumb }"
  >
    <template #menuHeaderRender>
      <RouterLink to="/">
        <img src="@/assets/images/logo.png" />
        <h1 class="logo-title">{{ appTitle }}</h1>
      </RouterLink>
    </template>

    <!-- custom breadcrumb itemRender  -->
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{ route.breadcrumbName }}</span>
      <RouterLink v-else :to="{ path: route.path, params }">
        {{ route.breadcrumbName }}
      </RouterLink>
    </template>

    <template #rightContentRender>
      <a-space :size="10">
        <darkness-mode-switch v-if="userSettings?.darkness?.showSwitch" />
        <avatar-dropdown :menu="state.showMenu" :current-user="state.currentUser" />
      </a-space>
    </template>

    <PageContainer
      :title="$route.meta.showPageTitle !== false && !userSettings.multiTab && $route.meta.title"
      :sub-title="$route.meta.subTitle"
    >
      <template v-if="userSettings.multiTab" #content>
        <MultiTab />
      </template>
      <a-spin :spinning="loading">
        <PageLayout />
      </a-spin>
    </PageContainer>
  </pro-layout>
</template>

<script setup>
import { reactive, computed, watchEffect, ref, inject } from "vue";
import { useRouter } from "vue-router";
import PageLayout from "./page-layout.vue";
import { getMenuData, clearMenuItem } from "@ant-design-vue/pro-layout";
// @ts-ignore
import avatarDropdown from "#/components/layout/avatar-dropdown.vue";
import darknessModeSwitch from "#/components/darkness-mode-switch/index.vue";

// @ts-ignore
import { useAppStore, useUserStore, usePermissionStore } from "#/store";
// @ts-ignore
import userSettings from "@/config/settings.js";

import MultiTab from "#/components/multi-tab/index.vue";

const appStore = useAppStore();
const userStore = useUserStore();
const appTitle = computed(() => appStore.title);

const name = computed(() => userStore.name);
const role = computed(() => userStore.role);

const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const permissionStore = usePermissionStore();
const sortAndFilterMenuData = (menuData) => {
  const handledMenuData = menuData
    .sort((a, b) => {
      return typeof a?.meta?.sort === "number" && typeof b?.meta?.sort === "number" ? a?.meta?.sort - b?.meta?.sort : 0;
    })
    .filter((i) => {
      const requiresAuth = i?.meta?.requiresAuth ?? true;
      const permissions = i?.meta?.permissions ?? [];
      return requiresAuth ? permissionStore.checkPermission(permissions) : true;
    });

  handledMenuData.forEach((element) => {
    if (element?.children) element.children = sortAndFilterMenuData(element?.children);
  });

  return handledMenuData;
};

const loading = ref(false);
const bus = inject("bus");

bus.on("castle-global-loading", (status) => (loading.value = status));

const state = reactive({
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
  showMenu: true,
  currentUser: {
    name,
    role,
  },
});

// 更多配置参考 https://www.npmjs.com/package/@ant-design-vue/pro-layout
const layoutConf = reactive({
  // navTheme: "dark",
  headerTheme: "dark",
  layout: "mix",
  splitMenus: false,
  menuData: sortAndFilterMenuData(menuData),
  ...userSettings?.layout,
});

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat();

    state.selectedKeys = [
      // @ts-ignore
      ...matched.filter((r) => r.name !== "index").map((r) => r.path),
      // @ts-ignore
      router.currentRoute.value?.meta?.activeMenuPath,
    ];
    // @ts-ignore
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

<style scoped>
.logo-title {
  margin-right: 16px;
}

:deep(.ant-page-header-content) {
  margin-bottom: -16px;
}
</style>
