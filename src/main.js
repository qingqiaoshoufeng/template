import { createApp, Text, Comment, Fragment, Static } from "vue";
import { createPinia } from "pinia";
import Antd from "@castle/ant-design-vue";
import ProLayout, { PageContainer } from "@castle/pro-layout";
import registerIcons from "#/utils/register-icons.js";
import provideUtils from "#/utils/provide-utils.js";
import PermissionDirective from "#/directive/permission";
import userSettings from "#/utils/get-user-settings.js";
import PageLayout from "#/components/layout/page-layout.js";

import "@castle/pro-layout/dist/style.css";
import "@castle/ant-design-vue/dist/antd.variable.less";
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
app.use(PageLayout);

registerIcons(app);
provideUtils(app);

app.mount("#app");

if (typeof userSettings?.lifecycle?.mounted === "function") {
  userSettings?.lifecycle?.mounted(app);
}

// 微前端全局变量
window.CASTLE = app;
window.CASTLE.loadedMicroapp = [];
window.CASTLE.loadedMicroappRoutes = [];
window.CASTLE.nodeTypeSymbol = { Text, Comment, Fragment, Static };
window.CASTLE.baseUrl = import.meta.env?.BASE_URL;

export default app;
