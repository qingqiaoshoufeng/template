const BASIC_LAYOUT = () => import("#/layout/basic-layout.vue");

export default [
  {
    path: "/dashboard",
    name: "dashboard",
    component: BASIC_LAYOUT,
    redirect: "/dashboard/workplace",
    meta: {
      title: "仪表盘",
      icon: "DashboardOutlined",
      // hideChildrenInMenu: true,
      // hideInMenu: true,
    },
    children: [
      {
        path: "workplace",
        name: "workplace",
        component: () => import("#/views/dashboard/index.vue"),
        hidden: true,
        meta: {
          title: "仪表盘",
          icon: "DashboardOutlined",
        },
      },
      {
        path: "workplace1",
        name: "workplace1",
        component: () => import("#/views/dashboard/index.vue"),
        hidden: true,
        meta: {
          title: "仪表盘1",
          icon: "DashboardOutlined",
          hideInMenu: true,
        },
      },
    ],
  },
];
