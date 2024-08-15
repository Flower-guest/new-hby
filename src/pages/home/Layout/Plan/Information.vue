<template>
  <!-- 片区资讯 -->
  <div class="mt-32px">
    <div class="main-title flex justify-between">
      <span>{{ data.title }}</span>
      <div class="flex">
        <template v-for="i in info.channel" :key="i.id">
          <div
            class="cursor-pointer mt-6px mr-20px text-14px"
            @click="tabClick(i.id, i.name)"
          >
            <div :class="{ activeItem: info.active == i.id }">
              {{ i.name }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="h-180px w-full mt-16px">
      <AutoScroll>
        <template #scrollList>
          <template v-for="i in info.list" :key="i.id">
            <div
              class="w-100% hide text-20px mb-12px cursor-pointer"
              @click="getArticleById(i.id)"
            >
              {{ i.title }}
            </div>
          </template>
        </template>
      </AutoScroll>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GetArticleChannel,
  GetArticleListByChannel,
  GetArticleById,
} from "@/service/api";

defineProps<{ data: any }>();

const info = reactive<any>({
  channel: [],
  active: "",
  list: [],
  content: "",
  activeName: "",
});

onMounted(async () => {
  try {
    info.channel = await GetArticleChannel();
    tabClick(info.channel[0].id, info.channel[0].name);
  } catch (err) {
    console.log(err);
  }
});

const tabClick = async (id: number, name: string) => {
  info.active = id;
  info.activeName = name;
  try {
    info.list = await GetArticleListByChannel(id);
  } catch (err) {
    console.log(err);
  }
};

const emit = defineEmits(["showDialog"]);
const getArticleById = async (id: number) => {
  try {
    info.content = await GetArticleById(id);
    emit(
      "showDialog",
      info.content[0].content,
      "txt",
      info.activeName,
      info.content[0].title
    );
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="less" scoped>
@import "./com.less";
</style>
