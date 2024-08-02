import type { App } from "vue";
import { getUser } from "@/utils/auth";

export function hasRole(app: App<Element>) {
  app.directive("hasRole", (el, binding) => {
    const { value } = binding;
    const super_admin = "admin";
    const roles = getUser().roles;

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value;

      const hasRole = roles.some((role: string) => {
        return super_admin === role || roleFlag.includes(role);
      });

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("请设置角色权限标签值");
    }
  });
}
