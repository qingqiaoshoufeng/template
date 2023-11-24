// 扁平化的路由数组
export default function flattenRoutes(routes, parentPath = "") {
  const flattenedRoutes = [];

  routes.forEach((route) => {
    const path = `${parentPath.length > 1 ? parentPath + "/" : ""}${route.path}`;
    // eslint-disable-next-line no-unused-vars
    const { children, ...rest } = route;
    const flattenedRoute = { ...rest, path };

    if (route.children) {
      const childrenRoutes = flattenRoutes(route.children, path);
      flattenedRoutes.push(...childrenRoutes);
    }

    flattenedRoutes.push(flattenedRoute);
  });

  return flattenedRoutes;
}
