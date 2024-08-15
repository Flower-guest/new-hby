<template>
  <el-carousel
    v-if="planData.data.name === 'banner'"
    height="202px"
    :interval="3000"
  >
    <el-carousel-item v-for="img in planData.data.value" :key="img">
      <img
        loading="lazy"
        @click="showInfo(planData, 'img')"
        class="w-100% h-100%"
        :src="getServeImg(img)"
        alt="轮播图"
      />
    </el-carousel-item>
  </el-carousel>
  <!-- 简介 -->
  <div v-else-if="planData.data.name === 'intro'" class="h-124px mt-12px">
    <AutoScroll :type="'text'" :scroll-length="2">
      <template #scrollList>
        <div
          v-for="i in 2"
          :key="i"
          class="cursor-pointer"
          @click="showInfo(planData, 'text')"
          v-html="planData.data.value"
        ></div>
      </template>
    </AutoScroll>
  </div>
  <!-- 数据统计 -->
  <div v-else>
    <div class="main-title">
      <span>{{ planData.title }}</span>
    </div>
    <div class="pl-24px grid grid-cols-2">
      <div
        v-for="i in planData.data.value"
        :key="i.content"
        class="mt-22px mr-8px flex items-end"
      >
        <img
          loading="lazy"
          class="w-51px h-50px mr-15px"
          :src="getServeImg(i.image)"
          alt="img"
        />
        <div class="grid">
          <div class="text-32px count-to">
            <template v-if="i.content">
              <CountTo
                :end="Number(i.content)"
                :autoPlay="true"
                :duration="3000"
              />
            </template>
            <span class="text-16px">&nbsp;{{ i.unit }}</span>
          </div>
          <span class="text-[#2FC6DC] text-16px">{{ i.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getServeImg } from "@/utils";

interface CarouselData {
  title: string;
  data: {
    name: "banner" | "intro" | "stats";
    value: any;
    title?: string;
  };
}

defineProps<{ planData: CarouselData }>();

const emit = defineEmits(["showDialog"]);

const showInfo = (data: any, type: "img" | "text"): void => {
  emit("showDialog", data.data.value, type, data.title);
};
</script>

<style lang="less" scoped>
@import "./com.less";
</style>
