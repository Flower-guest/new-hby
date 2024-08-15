<template>
  <div class="info" :style="{ width: props.width + 'rem' }">
    <div class="info_title">
      <img
        loading="lazy"
        class="w-19px h-26px ml-40px"
        :src="getAssets('icon_jt.png')"
        alt="icon"
      />
      {{ props?.title }}
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
