import { defineStore } from "pinia";

export interface FootToolState {
  planZoneImg: string;
  activeMenu: any[];
}

export const useToolStore = defineStore("footTool", {
  state: (): FootToolState => {
    return {
      planZoneImg: '', //分区菜单点击对应展示图片
      activeMenu: [],
    };
  },
  actions: {
    async setPlanZoneImg(val) {
      this.planZoneImg = val;
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
