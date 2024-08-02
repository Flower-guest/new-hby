import { createPinia } from "pinia";
import { useProjectStore } from "./modules/project";
import { useWidGet } from "./modules/widget";
import { useDictStore } from "./modules/dict";
import { useToolStore } from "./modules/footTool";

// pinia持久化
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();

pinia.use(createPersistedState());

export {  useProjectStore, useWidGet, useDictStore, useToolStore };

export default pinia;
