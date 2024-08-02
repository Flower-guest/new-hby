<template>
  <div class="iframe z-3333" v-show="showIframe">
    <iframe class="inlineFrameExample w-100% h-100%" :src="toPageUrl"> </iframe>
    <div class="i-img">
      <img loading="lazy" @click="updateShowIframe" :src="getAssets('gb2.png')" alt="关闭"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface detailProps {
  showIframe: boolean;
  toPageUrl: any;
}
const props = defineProps<detailProps>();
const showIframe = toRef(props, "showIframe");
const toPageUrl = ref<any>(props.toPageUrl);
watch(
  () => props.toPageUrl,
  (newValue) => {
    toPageUrl.value = newValue;
  }
);
const emit = defineEmits(["update:showIframe"]);
const updateShowIframe = () => {
  toPageUrl.value = "";
  emit("update:showIframe", false);
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
