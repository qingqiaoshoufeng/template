import { createApp } from "vue";
import { createPinia } from "pinia";
// import Antd from "ant-design-vue";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import * as Icons from "@ant-design/icons-vue";

import "ant-design-vue/dist/antd.css";
import "@ant-design-vue/pro-layout/dist/style.css";
import "#/assets/base.less";

import App from "./App.vue";
import router from "./router";
import "#/utils/request-interceptor";

const app = createApp(App);

app.use(createPinia());
app.use(router);
// app.use(Antd);
app.use(ProLayout);
app.use(PageContainer);

app.mount("#app");

const icons = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}

export default app;
