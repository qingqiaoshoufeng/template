<template>
  <div class="castle-login-wrap-bg">
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
          <div class="login-form-wrap">
            <h1 class="header-title"><span class="login-tip">登录到</span><br />{{ appTitle }}</h1>
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

              <a-row v-if="getVerificationCodeFn" :gutter="[16, 16]" justify="space-between" align="middle">
                <a-col :span="14">
                  <a-form-item name="verificationCode" :rules="[{ required: true, message: '请输入验证码' }]">
                    <a-input placeholder="验证码" size="large" v-model:value="formState.verificationCode">
                      <template #suffix>
                        <a-tooltip title="点击刷新图形验证码">
                          <SyncOutlined
                            class="site-form-item-icon"
                            style="cursor: pointer"
                            @click="getVerificationCode"
                            :spin="codeLoading"
                          />
                        </a-tooltip>
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-spin :spinning="codeLoading">
                    <a-form-item>
                      <img
                        v-if="verificationCodeImgSrc"
                        style="height: 40px; float: right"
                        :src="verificationCodeImgSrc"
                        alt="code"
                      />
                    </a-form-item>
                  </a-spin>
                </a-col>
              </a-row>

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

                <ABadgeRibbon text="仅在开发模式下显示" color="volcano" v-if="showErrInfo">
                  <a-button size="large" block style="margin-top: 20px" @click="openPlatform">
                    🧭 跳转到中台登陆
                  </a-button>
                </ABadgeRibbon>
              </a-form-item>
            </a-form>

            <RenderJsxComponents
              v-for="c in userSettings?.userApiImplement?.customComponents"
              :key="c"
              :componentVnode="c"
            />
          </div>
        </a-col>
      </a-row>
    </div>

    <footer class="copyright">{{ typeof copyright === "function" && copyright() }}</footer>
  </div>
</template>

<script setup>
import { computed, reactive, inject, ref, createVNode, onMounted } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import MD5 from "md5-es/src/md5";
import { Modal } from "@castle/ant-design-vue";
import { useRouter } from "vue-router";
// @ts-ignore
import { useAppStore, useUserStore } from "#/store";
import { setToken } from "#/utils/auth";
import userSettings from "@/config/settings.js";
import RenderJsxComponents from "#/components/render-jsx-components/index";

const showErrInfo = ["development"].includes(import.meta.env.MODE);
const isDevelopmentEnv = showErrInfo;

const encrypt = inject("encrypt");

const router = useRouter();

const appStore = useAppStore();
const appTitle = computed(() => appStore.title);
const copyright = computed(() => appStore.copyright);

const formState = reactive({
  username: "",
  password: "",
  verificationCode: "",
  remember: false,
});

let loading = ref(false);

const onFinish = async (formData) => {
  loading.value = true;
  const userStore = useUserStore();
  const { redirect, ...othersQuery } = router.currentRoute.value.query;

  const getPublicKey = userSettings?.userApiImplement?.rsaPublicKey;
  let PUBLIC_KEY;
  if (getPublicKey) {
    PUBLIC_KEY = await getPublicKey();
  } else {
    if (isDevelopmentEnv) {
      console.warn(`[Castle] 未配置 RSA 公钥，请在 settings.js 里面添加 userApiImplement -> rsaPublicKey 项`);
    }
  }

  userStore
    .login({
      ...formData,
      encryptUserName: MD5.hash(formData.username),
      encryptPassword: encrypt(formData.password, PUBLIC_KEY),
      encryptVerificationCodeAndPassWord: encrypt(`${formData.verificationCode}${formData.password}`, PUBLIC_KEY),
    })
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

const verificationCodeImgSrc = ref(null);

const codeLoading = ref(false);
const getVerificationCodeFn = userSettings?.userApiImplement?.getVerificationCode;
const getVerificationCode = async () => {
  codeLoading.value = true;
  if (getVerificationCodeFn) {
    verificationCodeImgSrc.value = await getVerificationCodeFn();
    codeLoading.value = false;
  }
};

onMounted(() => {
  getVerificationCode();
});

const openPlatform = () => {
  const developerUserName = import.meta.env.VITE_DEVELOPER_USER_NAME;
  const projectName = import.meta.env.VITE_PROJECT_NAME;

  if (!(developerUserName && projectName)) {
    Modal.confirm({
      title: "提示",
      icon: createVNode(ExclamationCircleOutlined),
      content: "你未在 env.local 配置 VITE_DEVELOPER_USER_NAME 和 VITE_PROJECT_NAME 字段，该功能无法使用",
      okText: "确认",
      cancelText: "取消",
    });
    return;
  }
  setToken("Castle Platform");
  window.open(
    `http://castle-platform.cp.hxdi.cn/auto-login?developer=${developerUserName}&project=${projectName}&redirect=${window.location.origin}`,
  );
};
</script>

<style lang="less" scoped>
.castle-login-wrap-bg {
  height: 100vh;
  // background-image: url("@/assets/images/login-bg-white.png");
  // background-size: cover;
  // background-position: 100%;
}

.login-form-wrap {
  padding: 10px 16px;
  background: none;
  backdrop-filter: blur(5px);
  border-radius: 5px;
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
