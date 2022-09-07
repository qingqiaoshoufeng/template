import { defineStore } from "pinia";

import { setToken, clearToken } from "@/utils/auth";
import { login, logout, getUserInfo } from "@/api/user";

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
      try {
        const res = await login(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
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
