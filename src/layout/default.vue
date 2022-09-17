<template>
  <div>
    <a-layout class="layout">
      <div class="layout-navbar">
        <NavBar />
      </div>
      <a-layout>
        <a-layout>
          <a-layout-sider
            v-show="!hideMenu"
            class="layout-sider"
            breakpoint="xl"
            :collapsed="collapsed"
            :collapsible="true"
            :width="menuWidth"
            :style="{ paddingTop: navbar ? '60px' : '' }"
            :hide-trigger="true"
            @collapse="setCollapsed"
          >
            <div class="menu-wrapper">
              <Menu />
            </div>
          </a-layout-sider>
          <a-drawer
            v-if="hideMenu"
            :visible="drawerVisible"
            placement="left"
            :footer="false"
            mask-closable
            :closable="false"
            @cancel="drawerCancel"
          >
            <Menu />
          </a-drawer>
          <a-layout class="layout-content" :style="paddingStyle">
            <TabBar v-if="appStore.tabBar" />
            <a-layout-content>
              <PageLayout />
            </a-layout-content>
            <Footer v-if="footer" />
          </a-layout>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import PageLayout from "./page.vue";
import { useAppStore } from "#/store";
import { computed, ref, provide } from "vue";

// import NavBar from "#/components/layout/navbar/index.vue";
import Menu from "#/components/layout/menu/index-old.vue";
// import Footer from "#/components/layout/footer/index.vue";
// import TabBar from "#/components/layout/tab-bar/index.vue";

const navbarHeight = `60px`;
const appStore = useAppStore();
// const userStore = useUserStore();
const hideMenu = computed(() => appStore.hideMenu);
const collapsed = computed(() => appStore.menuCollapse);
const menuWidth = computed(() => (appStore.menuCollapse ? 48 : appStore.menuWidth));
const navbar = computed(() => appStore.navbar);
const renderMenu = computed(() => appStore.menu);
const footer = computed(() => appStore.footer);

const setCollapsed = (val) => {
  appStore.updateSettings({ menuCollapse: val });
};

const paddingStyle = computed(() => {
  const paddingLeft = renderMenu.value && !hideMenu.value ? { paddingLeft: `${menuWidth.value}px` } : {};
  const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
  return { ...paddingLeft, ...paddingTop };
});

const drawerVisible = ref(false);
const drawerCancel = () => {
  drawerVisible.value = false;
};
provide("toggleDrawerMenu", () => {
  drawerVisible.value = !drawerVisible.value;
});

// TODO: 记得处理权限问题
// watch(
//   () => userStore.role,
//   (roleValue) => {
//     if (roleValue && !permission.accessRouter(route)) router.push({ name: "notFound" });
//   },
// );
</script>

<style lang="scss" scoped></style>
