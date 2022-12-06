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
        <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="6" :xxxl="4">
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
              <a-input-password placeholder="密码" size="large" autoComplete="on" v-model:value="formState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item v-if="false">
              <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formState.remember">记住账号</a-checkbox>
              </a-form-item>
              <a class="login-form-forgot" href="">忘记密码</a>
            </a-form-item>

            <a-form-item>
              <a-button
                size="large"
                block
                type="primary"
                html-type="submit"
                class="login-form-button"
                :loading="loading"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>

    <footer class="copyright">{{ typeof copyright === "function" && copyright() }}</footer>
  </div>
</template>

<script setup>
import { computed, reactive, inject, ref } from "vue";
import { useRouter } from "vue-router";
// @ts-ignore
import { useAppStore, useUserStore } from "#/store";

const encrypt = inject("encrypt");

const router = useRouter();

const appStore = useAppStore();
const appTitle = computed(() => appStore.title);
const copyright = computed(() => appStore.copyright);

const formState = reactive({
  username: "",
  password: "",
  remember: false,
});

let loading = ref(false);

const onFinish = (formData) => {
  loading.value = true;
  const userStore = useUserStore();
  const { redirect, ...othersQuery } = router.currentRoute.value.query;

  userStore
    .login({ ...formData, encryptPassword: encrypt(formData.password) })
    .then(() => {
      router.push({
        // @ts-ignore
        name: redirect || "index",
        query: {
          ...othersQuery,
        },
      });
    })
    .finally(() => {
      loading.value = false;
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
