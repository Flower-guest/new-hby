<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-03-13 10:51:22
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-28 09:36:40
 * @FilePath: \hby\src\pages\home\components\modal\designModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    class="w-100% h-100% absolute inset-0 z-3333 bg-[#00000099]"
    @click="updateShowDesign"
    v-show="show"
  >
    <div class="text-14px text-[#fff] flex-justify mb-24px mt-90px ml-176px">
      <div @click.stop class="py-7px px-25px mr-16px bg-#157780 rounded-l-15px">
        VR实景
      </div>
      <div @click.stop class="py-7px px-25px bg-#157780 rounded-r-15px">
        设计展示
      </div>
    </div>
    <div class="flex-center px-40px">
      <iframe
        @click.stop
        class="h-800px w-1000px mr-16px"
        :src="design?.url"
      ></iframe>
      <img loading="lazy" @click.stop class="h-800px w-824px" :src="design?.img" alt="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface detailProps {
  showDesign: boolean;
  designData: any;
}
const props = defineProps<detailProps>();

const dateType = {
  "WJB-51": {
    url: "https://www.jgqxw.com/index/tour/show/vid/85355aa71580783a",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/WJB-51.png",
  },
  "WJB-19": {
    url: "https://www.jgqxw.com/index/tour/show/vid/341e272a148cd9c3",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/WJB-19.png",
  },
  "WJB-26": {
    url: "https://www.jgqxw.com/index/tour/show/vid/41a99fcdf00f2c29",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/WJB-26.png",
  },
  "WJB-30": {
    url: "https://www.jgqxw.com/index/tour/show/vid/6d4519d7c186c564",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/WJB-30.png",
  },
  "WJB-36": {
    url: "https://www.jgqxw.com/index/tour/show/vid/97279df6c7bd0354",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/WJB-36.png",
  },
  "WJB-23": {
    url: "https://www.jgqxw.com/index/tour/show/vid/4e0b93b955950438",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/WJB-23.png",
  },
  主展馆: {
    url: "https://www.jgqxw.com/index/tour/show/vid/d6c86e3769683b78",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/zzg.png",
  },
  副展馆: {
    url: "https://www.jgqxw.com/index/tour/show/vid/d87365c456ccf03d",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/fzg.png",
  },
  新格林: {
    url: "https://www.jgqxw.com/index/tour/show/vid/f0e73b2efb70d595",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/xgl.png",
  },
};

const show = ref<boolean>(false);
const design = ref<any>();
watch(
  () => props.showDesign,
  (newValue) => {
    show.value = newValue;
    design.value = dateType[props.designData];
  }
);
const emit = defineEmits(["update:showDesign"]);
const updateShowDesign = () => {
  emit("update:showDesign", false);
};
</script>

<style lang="less" scoped></style>
