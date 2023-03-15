export const NOT_FOUND_ROUTE = {
  path: "/:pathMatch(.*)*",
  name: "Result404",
  component: () => import("#/views/exception/404.vue"),
  meta: {
    requiresAuth: false,
    permissions: [],
  },
};

export const FORBIDDEN_ROUTE = {
  path: "/403",
  name: "Result403",
  component: () => import("#/views/exception/403.vue"),
  meta: {
    requiresAuth: false,
    permissions: [],
  },
};
