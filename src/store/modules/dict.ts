import { defineStore } from "pinia";
import { getJson } from "@/utils"
import { getAPPId, getDict, setDict } from "@/utils/auth";

export interface DictState {
  dictMap: Map<string, any>;
  isSetDict: boolean;
}

export const useDictStore = defineStore("dict", {
  state: (): DictState => {
    return {
      dictMap: new Map<string, any>(),
      isSetDict: false,
    };
  },
  getters: {
    getDictMap(): any {
      const dictMap = getDict();
      if (dictMap) {
        this.dictMap = dictMap;
      }
      return this.dictMap;
    },
    getIsSetDict(): boolean {
      return this.isSetDict;
    },
  },
  actions: {
    async setDictMap() {
      const dictMap = getDict();
      if (dictMap) {
        this.dictMap = dictMap;
        this.isSetDict = true;
      } else {
        const res: any = await getJson(`/assets/source/dict${getAPPId()}.json`);
        // 设置数据
        this.dictMap = res;
        this.isSetDict = true;
        setDict(res);
      }
    },
    getDictById(id: string) {
      if (!this.isSetDict) {
        this.setDictMap();
      }
      return this.dictMap[id];
    },
  },
});
