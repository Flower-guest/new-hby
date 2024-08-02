/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-03-13 18:45:42
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-05-24 15:18:05
 * @FilePath: \hby\src\store\modules\footTool.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";

export interface FootToolState {
  zone: any;
  activeMenu: any[];
}

export const useToolStore = defineStore("footTool", {
  state: (): FootToolState => {
    return {
      zone: null, //分区菜单点击对象
      activeMenu: [],
    };
  },
  actions: {
    async setZone(val) {
      this.zone = val;
    },
    async setActiveMenu(menu) {
      this.activeMenu = []; //清空
      menu.forEach(i => {
        if (i.selectedItems.length > 0) {
          this.activeMenu = this.activeMenu.concat(i.selectedItems)
        }
      })
    }
  },
});
