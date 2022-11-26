import { defineStore } from "pinia";

import { setToken, clearToken } from "#/utils/auth";

import userSettings from "@/config/settings.js";

const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    role: "",
    roleName: "",
  }),

  getters: {
    userInfo(state) {
      return { ...state };
    },
  },

  actions: {
    setInfo(partial) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    async login(loginForm) {
      if (!userSettings?.userApiImplement?.login) throw "[Castle] settings.js 未配置 login 方法";
      return new Promise((resolve, reject) => {
        userSettings.userApiImplement
          .login(loginForm)
          .then(async (token) => {
            setToken(token);
            await this.getUserInfo();
            resolve();
          })
          .catch((err) => {
            clearToken();
            reject();
            throw err;
          });
      });
    },
    async logout() {
      if (!userSettings?.userApiImplement?.logout) throw "[Castle] settings.js 未配置 logout 方法";
      return new Promise((resolve, reject) => {
        userSettings.userApiImplement
          .logout()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject();
            throw err;
          })
          .finally(() => {
            this.resetInfo();
            clearToken();
          });
      });
    },
    getUserInfo() {
      if (!userSettings?.userApiImplement?.getUserInfo) throw "[Castle] settings.js 未配置 getUserInfo 方法";
      return new Promise((resolve, reject) => {
        userSettings.userApiImplement
          .getUserInfo()
          .then((res) => {
            this.setInfo(res);
            resolve();
          })
          .catch((err) => {
            reject();
            throw err;
          });
      });
    },
  },
});

export default useUserStore;
