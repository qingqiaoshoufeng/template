import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import registerIcons from "#/utils/register-icons.js";
import provideUtils from "#/utils/provide-utils.js";
import PermissionDirective from "#/directive/permission";

import "ant-design-vue/dist/antd.css";
import "@ant-design-vue/pro-layout/dist/style.css";
import "#/assets/base.less";

import App from "./App.vue";
import router from "./router";

import "#/utils/request-interceptor";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(ProLayout);
app.use(PageContainer);
app.use(PermissionDirective);

registerIcons(app);
provideUtils(app);

app.mount("#app");

export default app;
