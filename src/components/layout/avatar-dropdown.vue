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
        <a-menu-item v-if="menu" key="center" @click="handleToCenter"> 用户名 </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings"> 设置 </a-menu-item>
        <a-menu-divider v-if="menu" />
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
  methods: {
    handleToCenter() {
      this.$router.push({ path: "/account/center" });
    },
    handleToSettings() {
      this.$router.push({ path: "/account/settings" });
    },
    handleLogout() {
      Modal.confirm({
        title: "提示",
        content: "你确认登出吗？",
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          // return this.$store.dispatch("Logout").then(() => {
          //   this.$router.push({ name: "login" });
          // });
        },
        onCancel() {},
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
