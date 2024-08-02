<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-12-13 19:19:20
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-11 16:45:32
 * @FilePath: \hby\src\components\InfoDialog\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="info" :style="{ width: props.width + 'rem' }">
    <div class="info_title">
      <img
        loading="lazy"
        class="w-19px h-26px ml-40px"
        :src="getAssets('icon_jt.png')"
        alt="icon"
      />
      <img
        loading="lazy"
        class="w-88px h-31px"
        v-if="props?.title"
        :style="{
          width: props.imgWidth + 'px',
          height: props.imgHeight + 'px',
        }"
        :src="getAssets(`text-${props.title}.png`)"
        alt="标题"
      />
    </div>
    <div>
      <slot name="infoMain"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
import { toRefs } from "vue";

interface Props {
  title?: string;
  height?: string;
  width?: string;
  imgWidth?: number;
  imgHeight?: number;
}
const props = withDefaults(defineProps<Props>(), {
  height: "920px",
  width: "482px",
  padding: "18px 14px",
});
const { height } = toRefs(props);
</script>

<style scoped>
.info {
  background: url("@/assets/img/jjxqbg.png") no-repeat;
  background-size: 100% 100%;
  width: v-bind(width);
  height: v-bind(height);
  font-size: 20px;
  box-sizing: border-box;
  overflow: hidden;
  .info_title {
    background: url("@/assets/img/jjbg.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 50px;
    /* font-family: "USTitleBlack"; */
    display: flex;
    align-items: center;
  }
}
</style>
