import { defineStore } from "pinia";

const formatTag = (route) => {
  const { name, meta, fullPath, query } = route;
  return {
    title: meta.locale || "",
    name: String(name),
    fullPath,
    query,
  };
};

const useAppStore = defineStore("tabBar", {
  state: () => ({
    cacheTabList: new Set(),
    tagList: [
      // Set the first element dynamically as needed
      {
        title: "menu.dashboard.workplace",
        name: "Workplace",
        fullPath: "/dashboard/workplace",
      },
    ],
  }),

  getters: {
    getTabList() {
      return this.tagList;
    },
    getCacheList() {
      return Array.from(this.cacheTabList);
    },
  },

  actions: {
    updateTabList(route) {
      this.tagList.push(formatTag(route));
      route.meta?.keepAlive && this.cacheTabList.add(route.meta?.keepAlive);
    },
    deleteTag(idx, tag) {
      this.tagList.splice(idx, 1);
      this.cacheTabList.delete(tag.name);
    },
  },
});

export default useAppStore;
