<template>
  <div class="left flex">
    <div v-show="planState.dialog" class="info">
      <div class="info_top">
        <img
          loading="lazy"
          class="w-19px h-26px ml-40px"
          :src="getAssets('icon_jt.png')"
          alt="icon"
        />
        <span class="info_title">{{ planState.list?.[0]?.title }}</span>
      </div>
      <div class="info_main">
        <div
          v-if="planState.planZoneImg"
          class="px-25px py-20px h-820px overflow-y-auto"
        >
          <img
            loading="lazy"
            class="max-w-100%"
            :src="getServeImg(planState.planZoneImg)"
            alt="img"
          />
        </div>
        <div>
          <template v-for="i in planState.list.slice(1)" :key="i.id">
            <AsyncInformation
              v-if="i.data_model === 'Information'"
              :data="i"
              @show-dialog="showDialog"
            />
            <AsyncBaseList
              v-else-if="
                i.data_model === 'invesList' ||
                i.data_model === 'buildList' ||
                i.data_model === 'assetsList'
              "
              :data="i"
            />
            <AsyncBaseInfo
              v-else-if="i.data_model !== 'name'"
              :plan-data="i"
              @show-dialog="showDialog"
            />
          </template>
        </div>
      </div>
    </div>
    <img
      loading="lazy"
      class="w-51px h-101px"
      :class="{ 'jump rotate-180': !planState.dialog }"
      @click="planState.dialog = !planState.dialog"
      :src="getAssets('sq.png')"
      alt="icon"
    />
  </div>
  <div class="overlay_dialog" v-show="planState.visible">
    <div class="overlayMain">
      <img
        loading="lazy"
        @click="planState.visible = false"
        class="close"
        :src="getAssets('gb4.png')"
        alt="关闭"
      />
      <div class="dialog-title">{{ planState.label }}</div>
      <el-carousel
        v-if="planState.type === 'img'"
        class="carousel"
        :interval="3000"
      >
        <el-carousel-item
          v-for="i in planState.content"
          class="h-full"
          :key="i"
        >
          <img
            loading="lazy"
            class="w-100% h-100%"
            :src="getServeImg(i)"
            alt="轮播图"
          />
        </el-carousel-item>
      </el-carousel>
      <div class="article" v-else>
        <div class="text-36px text-center mb-10px">
          {{ planState?.title }}
        </div>
        <div class="main" v-html="planState.content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAssets, getServeImg } from "@/utils";
import { useToolStore } from "@/store";

const AsyncInformation = defineAsyncComponent(
  () => import("./Information.vue")
);
const AsyncBaseList = defineAsyncComponent(() => import("./BaseList.vue"));
const AsyncBaseInfo = defineAsyncComponent(() => import("./BaseInfo.vue")); //轮播图、滚动文字、数据统计

type PlanState = {
  list: Array<any>;
  dialog: boolean;
  type: string;
  content: any;
  visible: boolean;
  label: string;
  title: string;
  planZoneImg: string | null;
};

defineEmits(["change"]);

const props = defineProps<{ planData: any }>();
const store = useToolStore();

const planState = reactive<PlanState>({
  list: props.planData,
  dialog: true,
  type: "",
  label: "",
  content: {},
  visible: false,
  planZoneImg: null,
  title: "",
});

watch(
  () => props.planData,
  (newVal) => {
    planState.list = newVal;
  }
);

watch(
  () => store.planZoneImg,
  (newValue: any) => {
    planState.planZoneImg = newValue;
  }
);

// 弹窗显示
const showDialog = async (
  val: any,
  type: string,
  label: string,
  title = ""
) => {
  planState.visible = true;
  planState.type = type;
  planState.content = val;
  planState.label = label;
  planState.title = title;
};
</script>

<style lang="less" scoped>
@import "./com.less";
</style>
