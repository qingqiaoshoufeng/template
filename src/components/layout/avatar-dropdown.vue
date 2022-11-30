<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="account-avatar">
      <a-avatar :size="30" style="background-color: #53abfd">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <span class="account-name">{{ currentUser.name }}</span>
      <DownOutlined />
    </span>
    <template v-slot:overlay>
      <a-menu class="drop-down menu" :selected-keys="[]">
        <template v-if="Array.isArray(userNavigation) && userNavigation.length > 0">
          <a-menu-item v-for="item in userNavigation" :key="item.label" @click="item.handleFn">
            {{ item.label }}
          </a-menu-item>

          <a-menu-divider />
        </template>

        <a-menu-item key="logout" @click="handleLogout"> 退出 </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from "ant-design-vue";
import { mapActions } from "pinia";
import { useUserStore } from "#/store";
import userSettings from "@/config/settings.js";
export default {
  name: "AvatarDropdown",
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
  },
  methods: {
    ...mapActions(useUserStore, ["logout"]),
    handleLogout() {
      Modal.confirm({
        title: "提示",
        content: "你确认登出吗？",
        onOk: () => {
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
