import { usePermissionStore } from "#/store";

function checkPermission(el, binding) {
  const { value } = binding;
  const permissionStore = usePermissionStore();
  const hasPermission = permissionStore.checkPermission(value);

  if (!hasPermission) {
    el.parentNode && el.parentNode.removeChild(el);
  }
}

export default {
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  updated(el, binding) {
    checkPermission(el, binding);
  },
};
