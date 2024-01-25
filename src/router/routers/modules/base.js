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

export const MAINTENANCE_ROUTE = {
  path: "/maintenance",
  name: "maintenance",
  component: () => import("#/views/exception/maintenance.vue"),
  meta: {
    requiresAuth: false,
    permissions: [],
  },
};

export const NETWORK_ERROR_ROUTE = {
  path: "/network-error",
  name: "networkError",
  component: () => import("#/views/exception/network-error.vue"),
  meta: {
    requiresAuth: false,
    permissions: [],
  },
};

export const BROWSER_INCOMPATIBLE_ROUTE = {
  path: "/browser-incompatible",
  name: "browserIncompatible",
  component: () => import("#/views/exception/browser-incompatible.vue"),
  meta: {
    requiresAuth: false,
    permissions: [],
  },
};
