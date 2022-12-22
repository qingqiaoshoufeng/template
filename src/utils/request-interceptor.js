import axios from "axios";
import { notification } from "ant-design-vue";
import { useUserStore } from "#/store";
import { getToken } from "#/utils/auth";
import userSettings from "@/config/settings.js";
import { getCodeMessages } from "#/utils/http-code-messages";

import "ant-design-vue/es/message/style/css";

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

const requestSetting = userSettings?.httpInterceptors?.request;
if (requestSetting) {
  axios.interceptors.request.use(requestSetting);
} else {
  axios.interceptors.request.use(
    (config) => {
      // let each request carry token
      // this example using the JWT token
      // Authorization is a custom headers key
      // please modify it according to the actual situation
      const token = getToken();
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      // do something
      return Promise.reject(error);
    },
  );
}

// add response interceptors
const responseSetting = userSettings?.httpInterceptors?.response;
if (responseSetting) {
  axios.interceptors.response.use(...responseSetting);
} else {
  axios.interceptors.response.use(
    (response) => {
      const { data } = response;
      const { code, data: resData } = data;

      if (code !== 200) {
        if (code === 403) {
          notification.error({
            message: "无权限",
            description: data.message,
          });
        } else if (code === 406) {
          notification.info({
            message: "非法参数",
            description: data.message,
          });
        } else if (code === 500) {
          notification.error({
            message: "系统内部错误",
            description: data.message,
          });
        } else {
          notification.error({
            message: data.message || "未知错误",
          });
        }

        return Promise.reject(new Error(data.message || "Error"));
      }

      return resData;
    },
    (error) => {
      if (error.response) {
        const { status, statusText, data } = error.response;
        const { message } = data;
        const token = getToken();

        if (status === 401) {
          notification.error({
            message: "操作未授权",
            description: message || "授权验证失败",
          });
          if (token) {
            useUserStore()
              .logout()
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              });
          }
        } else {
          notification.error({
            message: `${status} ${statusText}` || "请求失败",
            description: message || getCodeMessages(status) || `未知错误 ${statusText}`,
          });
        }
      }

      return Promise.reject(error);
    },
  );
}
