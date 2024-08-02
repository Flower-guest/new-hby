/**
 * 数据字典工具类
 */
import { useDictStore } from "@/store";

const dictStore = useDictStore();

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @returns {*|Array} 数据字典数组
 */
export interface DictDataType {
  name: string;
  nickname: string;
  image: string;
  diyname: string;
}

export const getDictOptions = (id: string) => {
  return dictStore.getDictById(id) || [];
};

export const getDictLabel = (id: string): string => {
  const dictOptions: DictDataType = getDictOptions(id);
  return dictOptions.nickname;
};

export const getDictName = (id: string): string => {
  const dictOptions: DictDataType = getDictOptions(id);
  return dictOptions.name;
};
