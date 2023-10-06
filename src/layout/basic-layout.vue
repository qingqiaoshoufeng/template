<template>
  <pro-layout
    v-bind="layoutConf"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: userSettings?.breadcrumb?.display === true ? breadcrumb : null }"
  >
    <template #menuHeaderRender>
      <RouterLink to="/">
        <Logo />
        <h1 class="logo-title">{{ appTitle }}</h1>
      </RouterLink>
    </template>

    <template
      v-if="!state.collapsed && projectSettings.microapp?.apps && (isDevelopment ? isDevMicroappMode : true)"
      #menuExtraRender
    >
      <a-select v-model:value="microapp" style="width: 100%" @change="microappHandleChange">
        <a-select-option
          :disabled="isDevMicroappMode && microappName !== item.name"
          :value="JSON.stringify(item)"
          v-for="item in isEnabledMicroapp()"
          :key="item.name"
        >
          {{ item.displayName }}
        </a-select-option>
      </a-select>
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
        <RenderJsxComponents v-for="c in userSettings?.userNavigationComponents" :key="c" :componentVnode="c" />
        <template v-if="userSettings?.darkness?.showSwitch">
          <a-divider
            type="vertical"
            v-if="userSettings?.userNavigationComponents?.length"
            style="background-color: #6f8edd"
          />
          <darkness-mode-switch />
        </template>
        <avatar-dropdown :menu="state.showMenu" :current-user="state.currentUser" />
      </a-space>
    </template>

    <PageContainer
      :title="$route.meta.showPageTitle !== false && !userSettings.multiTab && $route.meta.title"
      :sub-title="$route.meta.subTitle"
      :loading="microappLoadedLoading"
    >
      <template v-if="userSettings.multiTab" #content>
        <MultiTab />
      </template>
      <a-spin :spinning="loading">
        <WaterMark :content="watermarkContent">
          <PageLayout />
        </WaterMark>
      </a-spin>
    </PageContainer>
  </pro-layout>
</template>

<script setup>
import { reactive, computed, watchEffect, ref, inject } from "vue";
import { WaterMark } from "@castle/pro-layout";
import { useRouter } from "vue-router";
import PageLayout from "./page-layout.vue";
import { getMenuData, clearMenuItem } from "@castle/pro-layout";
import avatarDropdown from "#/components/layout/avatar-dropdown.vue";
import darknessModeSwitch from "#/components/darkness-mode-switch/index.vue";
import { useAppStore, useUserStore, usePermissionStore } from "#/store";
import userSettings from "#/utils/getUserSettings.js";
import projectSettings from "@/config/project-settings.mjs";
import MultiTab from "#/components/multi-tab/index.vue";
import RenderJsxComponents from "#/components/render-jsx-components/index";
import Logo from "#/components/logo/index.vue";

const bus = inject("bus");
const appStore = useAppStore();
const userStore = useUserStore();
const appTitle = computed(() => appStore.title);
const isDevMicroappMode = import.meta.env.VITE_APP_IS_DEV_MICROAPP_MODE === "true";
const isDevelopment = ["development"].includes(import.meta.env.MODE);

const name = computed(() => userStore.name);
const role = computed(() => userStore.role);

const watermarkContent = computed(() => appStore.watermarkContent(userStore));

const microapp = ref(null);
const microappLoadedLoading = ref(false);
const microappName = import.meta.env.VITE_APP_MICROAPP_NAME;
bus.on("CASTLE__microappLoadedLoading", (v) => (microappLoadedLoading.value = v));

const isEnabledMicroapp = () => {
  return projectSettings.microapp?.apps.filter((i) => {
    return i.enabled !== false && !JSON.parse(import.meta.env.VITE_APP_NOT_ENABLED_MICROAPP ?? "[]").includes(i.name);
  });
};

const router = useRouter();
const handleMenuDataFlag = ref(1);
const menuData = computed(() => {
  const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
  if (!microapp.value) return menuData;
  const { name } = JSON.parse(microapp.value);

  if (microapp.value && import.meta.env.VITE_APP_MICROAPP_NAME !== name && handleMenuDataFlag.value) {
    const filteredMicroappRoutes = window.CASTLE?.loadedMicroappRoutes.filter(({ path, meta }) => {
      const isCurrentMicroapp = path.indexOf(`/${name}`) === 0;
      const isCustomPath = Boolean(meta?.target);
      return isCurrentMicroapp || isCustomPath;
    });
    return getMenuData([{ path: "/", children: filteredMicroappRoutes }]).menuData;
  }
  return menuData;
});

const permissionStore = usePermissionStore();
const FilterAndSortMenuData = (menuData) => {
  const handledMenuData = menuData
    .filter((i) => {
      const requiresAuth = i?.meta?.requiresAuth ?? true;
      const permissions = i?.meta?.permissions ?? [];
      return requiresAuth ? permissionStore.checkPermission(permissions) : true;
    })
    .sort((a, b) => {
      return typeof a?.meta?.sort === "number" && typeof b?.meta?.sort === "number" ? a?.meta?.sort - b?.meta?.sort : 0;
    });

  handledMenuData.forEach((element) => {
    if (element?.children) element.children = FilterAndSortMenuData(element?.children);
  });

  return handledMenuData;
};

const loading = ref(false);

bus.on("castle-global-loading", (status) => (loading.value = status));
bus.on("CASTLE__globalLoading", (status) => (loading.value = status));

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

// 更多配置参考 https://www.npmjs.com/package/@castle/pro-layout
const layoutConf = reactive({
  // navTheme: "realDark",
  headerTheme: "dark",
  layout: "mix",
  splitMenus: false,
  menuData: computed(() => {
    return handleMenuDataFlag.value ? FilterAndSortMenuData(menuData.value) : FilterAndSortMenuData(menuData.value);
  }),
  ...userSettings?.layout,
});

bus.on("CASTLE__microappLoaded", () => {
  handleMenuDataFlag.value += 1;
});

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat();

    state.selectedKeys = [
      ...matched.filter((r) => r.name !== "index").map((r) => r.path),
      router.currentRoute.value?.meta?.activeMenuPath,
    ];
    state.openKeys = matched.filter((r) => r.path !== router.currentRoute.value.path).map((r) => r.path);

    if (projectSettings.microapp?.apps) {
      microapp.value = JSON.stringify(
        projectSettings.microapp?.apps.find((app) => router.currentRoute.value.path.indexOf(`/${app.name}`) === 0),
      );
    }
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

const microappHandleChange = (app) => {
  router.push(projectSettings.microapp?.baseUrl ?? "" + JSON.parse(app)?.homePath);

  if (typeof userSettings?.lifecycle?.microappChange === "function") {
    userSettings?.lifecycle?.microappChange(window.CASTLE, JSON.parse(app));
  }
};
</script>

<style scoped>
.logo-title {
  margin-right: 16px;
}

:deep(.ant-page-header) {
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.ant-page-header-content) {
  padding-top: 8px;
}
</style>
