import permission from "./permission";

export default {
  install(app) {
    app.directive("p", permission);
  },
};
