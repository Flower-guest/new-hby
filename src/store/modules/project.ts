import { defineStore } from "pinia";
import {
  getAccessToken,
  removeToken,
  getProject,
  setProjectData,
  getGid,
  removeAPPId, removeProjectData, removeDict
} from "@/utils/auth";
import { GetUserInterface, LoginOut } from "@/service/api";
import { getJson } from "@/utils"

interface ProjectInfoVO {
  menu: string[];
  menuData: any;
  isSetProject: boolean;
  projectInfo: any;
}

export const useProjectStore = defineStore("project", {
  state: (): ProjectInfoVO => {
    return {
      menu: [],
      menuData: [],
      isSetProject: false,
      projectInfo: {},
    };
  },
  getters: {
    getMenu(): string[] {
      return this.menu;
    },
    getIsSetProject(): boolean {
      return this.isSetProject;
    },
    getProjectInfo(): any {
      return this.projectInfo;
    },
  },
  actions: {
    async setProjectInfoAction() {
      if (!getAccessToken()) {
        this.resetState();
        return null;
      }
      let projectInfo = getProject();
      if (!projectInfo) {
        projectInfo = await GetUserInterface(getGid());
      }
      if (projectInfo.datajson_url) {
        this.menuData = await getJson(projectInfo.datajson_url);
      }
      this.menu = projectInfo.menus;
      this.projectInfo = projectInfo;
      this.isSetProject = true;

      // 获取前端展示菜单
      setProjectData(projectInfo, this.menu, this.menuData);
    },

    async loginOut() {
      await LoginOut();
      removeToken();
      removeAPPId(); removeProjectData(); removeDict();
      this.resetState();
    },

    resetState() {
      this.menu = [];
      this.isSetProject = false;
      this.projectInfo = {};
    },
  },
});
