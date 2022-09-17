export const NOT_FOUND_ROUTE = {
  path: "/:pathMatch(.*)*",
  name: "Result404",
  component: () => import("#/views/exception/404.vue"),
};

export const FORBIDDEN_ROUTE = {
  path: "/403",
  name: "Result403",
  component: () => import("#/views/exception/404.vue"),
};
