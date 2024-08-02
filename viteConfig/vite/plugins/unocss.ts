import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss";
// import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  // transformers: [transformerDirectives()],
  presets: [presetUno(), presetAttributify(), presetIcons()],
  // 自定义一组样式的缩写
  shortcuts: [
    ["flex-center", "flex items-center"],
    ["flex-column-center", "flex flex-col justify-center items-center"],
    ["flex-justify", "flex items-center justify-center"],
    ["flex-between", "flex justify-between"],
    ["flex-between-center", "flex justify-between items-center"],
  ],
  rules: [],
});
