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
    excludeCacheTabList: new Set(),
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
    getExcludeCacheList() {
      return Array.from(this.excludeCacheTabList);
    },
  },

  actions: {
    updateTabList(router) {
      this.tagList.push(formatTag(router));
      if (router.matched && Array.isArray(router.matched)) {
        const matched = router.matched.concat();
        matched.forEach((e) => {
          const key = e.meta?.keepAlive;
          if (e.path !== "/" && key) {
            this.cacheTabList.add(key);
            this.excludeCacheTabList.delete(key);
          }
        });
      }
    },
    deleteTag(idx, tag) {
      this.tagList.splice(idx, 1);
      this.cacheTabList.delete(tag.name);
    },
    removeKeepAliveCache(key) {
      this.cacheTabList.delete(key);
      this.excludeCacheTabList.add(key);
    },
  },
});

export default useAppStore;
