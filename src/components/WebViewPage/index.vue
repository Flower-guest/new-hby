<template>
  <div class="iframe z-3333" v-show="show">
    <iframe class="inlineFrameExample w-100% h-100%" :src="pageUrl"> </iframe>
    <div class="i-img">
      <img
        loading="lazy"
        @click="updateShow"
        :src="getAssets('gb2.png')"
        alt="关闭"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface detailProps {
  show: boolean;
  pageUrl: any;
}

defineProps<detailProps>();
// const props = defineProps<detailProps>();
// watch(
//   () => props.pageUrl,
//   (newValue) => {
//     toPageUrl.value = newValue;
//   }
// );
const emit = defineEmits(["update:show"]);
const updateShow = () => {
  // toPageUrl.value = "";
  emit("update:show", false);
};
</script>

<style lang="less" scoped>
.iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;

  .i-img {
    position: absolute;
    transform: translate(-50%, -60%);
    left: 50%;
    top: 0%;
    transition: all 0.3s ease-in;
  }

  .i-img:hover {
    transform: translate(-50%, 0%);
    top: 10px;
  }
}
</style>
