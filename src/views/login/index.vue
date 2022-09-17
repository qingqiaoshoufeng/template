<template>
  <div class="login-wrap-bg">
    <header class="ant-layout-header ant-pro-fixed-header login-header">
      <div class="ant-pro-global-header ant-pro-global-header-layout-mix">
        <div class="ant-pro-global-header-logo">
          <a>
            <img src="@/assets/images/logo.png" />
            <h1 class="header-title">{{ appTitle }}</h1>
          </a>
        </div>
      </div>
    </header>
    <div class="login-wrap">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="6" :XXXl="4">
          <h1 class="header-title">登录到<br />{{ appTitle }}</h1>
          <br />
          <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish">
            <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名' }]">
              <a-input placeholder="用户名" size="large" v-model:value="formState.username">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
              <a-input-password placeholder="密码" size="large" v-model:value="formState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formState.remember">记住账号</a-checkbox>
              </a-form-item>
              <!-- <a class="login-form-forgot" href="">忘记密码</a> -->
            </a-form-item>

            <a-form-item>
              <a-button size="large" block type="primary" html-type="submit" class="login-form-button"> 登录 </a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>

    <footer class="copyright">{{ copyright }}</footer>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore, useUserStore } from "#/store";

const router = useRouter();

const appStore = useAppStore();
const appTitle = computed(() => appStore.title);
const copyright = computed(() => appStore.copyright);

const formState = reactive({
  username: "admin",
  password: "admin",
  remember: true,
});

const onFinish = (values) => {
  const userStore = useUserStore();
  console.log("Success:", values);
  userStore.login();
  router.push({
    path: "/HOME_PAGE",
  });
};
</script>

<style lang="less" scoped>
.login-wrap-bg {
  height: 100vh;
  background-image: url("@/assets/images/login-bg-white.png");
  background-size: cover;
  background-position: 100%;
}
.login-header {
  padding: 0px;
  height: 48px;
  line-height: 48px;
  width: 100%;
  z-index: 100;
  right: 0px;
  background: none;

  .ant-pro-global-header-layout-mix {
    background: none;
    backdrop-filter: blur(5px);
  }
}
.header-title {
  color: #222 !important;
}
.login-wrap {
  padding: 0 10%;
  position: absolute;
  width: 100%;
  top: 20%;
}
.copyright {
  padding: 0 10%;
  position: absolute;
  bottom: 5%;
  color: #666;
}
</style>
