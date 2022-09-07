import { defineStore } from "pinia";

import defaultSettings from "@/config/settings.json";

const useAppStore = defineStore("app", {
  state: () => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state) {
      return { ...state };
    },
    appDevice(state) {
      return state.device;
    },
    appAsyncMenus(state) {
      return state.serverMenu;
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },
  },
});

export default useAppStore;
