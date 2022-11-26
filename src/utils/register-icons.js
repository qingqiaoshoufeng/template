import * as Icons from "@ant-design/icons-vue";

const icons = Icons;

export default (app) => {
  for (const i in icons) {
    app.component(i, icons[i]);
  }
};
