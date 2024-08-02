/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-12-12 10:32:56
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-05-14 11:20:22
 * @FilePath: \hby\viteConfig\vite\plugins\autoImport.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @name AutoImportDeps
 * @description 按需加载，自动引入
 */
import AutoImport from "unplugin-auto-import/vite"; //自动导入api
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const AutoImportDeps = () => {
  return AutoImport({
    imports: ["vue", "vue/macros", "vue-router", "pinia", "@vueuse/core",
      // 可额外添加需要 autoImport 的组件
      {
        '@/hooks/useMessage': ['useMessage'],
        '@/hooks/useDefer': ['useDefer'],
        '@/hooks/useLoadData': ['useLoadData'],
      }],
    // 在 Vue 模板中自动导入
    vueTemplate: true,
    dts: "types/auto-imports.d.ts",
    resolvers: [ElementPlusResolver()],
  });
};

export default AutoImportDeps;
