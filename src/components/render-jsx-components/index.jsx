import { defineComponent } from "vue";

export default defineComponent({
  name: "RenderJsxComponents",
  props: {
    componentVnode: {
      type: Object,
      default: null,
    },
  },
  // eslint-disable-next-line no-unused-vars
  setup(props, { attrs, expose, emit }) {
    return () => props.componentVnode;
  },
});
