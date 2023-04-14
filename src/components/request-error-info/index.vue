<template>
  <p>{{ description }}</p>
  <ABadgeRibbon text="仅在开发和测试模式下显示" color="volcano" v-if="showErrInfo">
    <div class="err-info-box">
      <pre>{{ errorInfo }}</pre>
      <AButton @click="copyErrInfo">复制错误信息</AButton>
    </div>
  </ABadgeRibbon>
</template>

<script>
import { Button as AButton, BadgeRibbon as ABadgeRibbon } from "@castle/ant-design-vue";
export default {
  name: "RequestErrorInfo",
  components: {
    AButton,
    ABadgeRibbon,
  },
  data() {
    return {
      showErrInfo: ["development", "test"].includes(import.meta.env.MODE),
    };
  },
  props: {
    description: {
      type: String,
      default: "",
    },
    response: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    errorInfo() {
      const {
        config: { url, headers, data: payload, method },
        status,
        data: responseData,
      } = this.response;
      return {
        method,
        url,
        status,
        payload,
        responseData,
        headers,
      };
    },
  },
  methods: {
    async copyErrInfo() {
      await navigator.clipboard.writeText(JSON.stringify(this.errorInfo, null, 2));
    },
  },
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
}
.err-info-box {
  background-color: rgba(0, 0, 0, 0.061);
  border-radius: 3px;
  padding: 8px;
}
</style>
