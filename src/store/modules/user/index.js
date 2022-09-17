import { defineStore } from "pinia";

import { setToken, clearToken } from "#/utils/auth";
import { login, logout, getUserInfo } from "#/api/user";

const useUserStore = defineStore("user", {
  state: () => ({
    name: undefined,
    // TODO: 需要去掉默认角色，现在是为了方便调试
    role: "admin",
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
      return new Promise((resolve, reject) => {
        login(loginForm)
          .then((res) => {
            setToken(res.data.token);
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
      try {
        await logout();
      } finally {
        // this.logoutCallBack();
        this.resetInfo();
        clearToken();
      }
    },
    async info() {
      const res = await getUserInfo();

      this.setInfo(res.data);
    },
  },
});

export default useUserStore;
