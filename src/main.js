import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import registerIcons from "#/utils/register-icons.js";
import provideUtils from "#/utils/provide-utils.js";
import PermissionDirective from "#/directive/permission";
import userSettings from "@/config/settings.js";

import "ant-design-vue/dist/antd.variable.less";
import "@ant-design-vue/pro-layout/dist/style.css";
import "#/assets/base.less";

import App from "./App.vue";
import router from "./router";

import "#/utils/request-interceptor";

const app = createApp(App);

if (typeof userSettings?.lifecycle?.beforeMount === "function") {
  userSettings?.lifecycle?.beforeMount(app);
}

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(ProLayout);
app.use(PageContainer);
app.use(PermissionDirective);

registerIcons(app);
provideUtils(app);

app.mount("#app");

if (typeof userSettings?.lifecycle?.mounted === "function") {
  userSettings?.lifecycle?.mounted(app);
}

export default app;
