<template>
  <div
    class="w-100% h-100% absolute inset-0 z-3333 bg-[#00000099]"
    @click="updateVisible"
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
        :src="designData?.url"
      ></iframe>
      <img
        loading="lazy"
        @click.stop
        class="h-800px w-824px"
        :src="designData?.img"
        alt="icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface detailProps {
  show: boolean;
  designData: any;
}

defineProps<detailProps>();

const emit = defineEmits(["update:show"]);
const updateVisible = () => {
  emit("update:show", false);
};
</script>

<style lang="less" scoped></style>
