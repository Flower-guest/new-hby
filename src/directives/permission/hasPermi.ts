import type { App } from "vue";
import { getUser } from "@/utils/auth";

export function hasPermi(app: App<Element>) {
  app.directive("hasPermi", (el, binding) => {
    const { value } = binding;
    const all_permission = "*:*:*";
    const permissions = getUser().permissions;

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;

      const hasPermissions = permissions.some((permission: string) => {
        return (
          all_permission === permission || permissionFlag.includes(permission)
        );
      });

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("请设置操作权限标签值");
    }
  });
}
