<template>
  <a-dropdown placement="bottomRight">
    <span class="account-avatar">
      <a-avatar :size="28" style="background-color: rgba(255, 255, 255, 0.2)">
        <template #icon>
          <RenderJsxComponents v-if="userNavigationAvatar" :componentVnode="userNavigationAvatar" />
          <UserOutlined v-else />
        </template>
      </a-avatar>
      <span class="account-name">{{ currentUser.name || "未登录" }}</span>
      <DownOutlined />
    </span>
    <template v-slot:overlay>
      <a-menu class="drop-down menu" :selected-keys="[]">
        <template v-if="Array.isArray(userNavigation) && userNavigation.length > 0">
          <template v-for="item in userNavigation" :key="item.label">
            <a-menu-item v-if="item?.displayFn && item.displayFn() !== false" @click="item.handleFn($router)">
              {{ item.label }}
            </a-menu-item>
          </template>

          <a-menu-divider />
        </template>

        <a-menu-item v-if="currentUser?.name" key="logout" @click="handleLogout"> 退出 </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { Modal } from "@castle/ant-design-vue";
import { mapActions } from "pinia";
import { useUserStore, usePermissionStore } from "#/store";
import RenderJsxComponents from "#/components/render-jsx-components/index";
import userSettings from "#/utils/getUserSettings.js";
export default {
  name: "AvatarDropdown",
  components: {
    RenderJsxComponents,
  },
  props: {
    currentUser: {
      type: Object,
      default: () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    userNavigation() {
      return userSettings?.userNavigation;
    },
    userNavigationAvatar() {
      return userSettings?.userNavigationAvatar;
    },
  },
  methods: {
    ...mapActions(useUserStore, ["logout", "resetInfo"]),
    ...mapActions(usePermissionStore, ["resetPermissionData"]),
    handleLogout() {
      Modal.confirm({
        title: "提示",
        content: "你确认登出吗？",
        onOk: () => {
          this.resetPermissionData();
          this.resetInfo();

          this.logout().then(() => {
            this.$router.push({ name: "login" });
          });
        },
        onCancel() {},
        okText: "确认登出",
        cancelText: "取消",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.account-avatar {
  padding: 0 8px;
  cursor: pointer;
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  gap: 8px 4px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  .account-name {
    margin-left: 4px;
    color: #fff;
  }
}
.drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
