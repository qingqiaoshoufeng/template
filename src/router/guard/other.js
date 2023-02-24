import { useTabBarStore } from "#/store";
import { bus } from "#/utils/event-bus";

export default function setupOtherGuard(router) {
  router.beforeEach(async (to) => {
    // to 的 meta 是一个非递归合并所有 meta 字段的（从父字段到子字段），所以只能从 matched 取最后一个
    const toRouter = to.matched[to.matched.length - 1];

    // 处理页面缓存
    const tabBarStore = useTabBarStore();
    if (toRouter.meta?.keepAlive) tabBarStore.updateTabList(to);

    // 切换布局
    bus.emit("CASTLE__changeLayout", { metaLayout: toRouter.meta?.layout ?? "default", toRouter });
  });
}
