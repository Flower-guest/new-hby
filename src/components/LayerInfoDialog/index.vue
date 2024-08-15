<template>
  <div v-show="show">
    <!-- 信息展示 -->
    <div class="overlayMain" v-if="info?.markerType !== 'wlw'">
      <div class="flex-between-center mt-31px px-12px">
        <img
          loading="lazy"
          @click="updateShow"
          class="w-23px h-32px ml-7px"
          :src="getAssets('icon_xxmb.png')"
          alt="icon"
        />
        <div class="text-23px">{{ detail?.name }}</div>
        <img
          loading="lazy"
          @click="updateShow"
          class="w-20px h-20px"
          :src="getAssets('gb3.png')"
          alt="关闭"
        />
      </div>
      <div class="carousel">
        <el-carousel class="w-full h-full" indicator-position="none">
          <el-carousel-item
            class="carousel_item"
            v-for="j in detail?.images"
            :key="j"
          >
            <div class="relative w-100% h-100%">
              <img
                class="w-100% h-100%"
                loading="lazy"
                :src="getServeImg(j)"
                alt="轮播图"
              />
              <img
                loading="lazy"
                class="qj_icon"
                alt="全景图标"
                v-show="detail?.panoLink"
                :src="getAssets('icon-qj.png')"
                @click="vrClick(detail?.panoLink)"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 产业信息展示页面 -->
      <template v-if="info?.markerType == 'asset'">
        <div class="my-10px pl-19px text-[#333] text-16px">
          <div class="relative">
            <Tab :tab-panes="tabPanes" :row-list="rowList" :data="detail" />
            <span class="absolute top-5% right-12px text-18px text-[#E0E02D]"
              >{{ info?.listingPrice }}元/年</span
            >
          </div>
        </div>
      </template>
      <!-- 招商信息展示页面 -->
      <template v-else-if="info?.markerType == 'investment'">
        <div class="my-10px px-10px text-[#333] text-16px">
          <el-tabs v-model="activeName" class="demo-tab">
            <el-tab-pane label="基本信息" name="first">
              <div
                v-if="detail?.introduce"
                class="jj com max-h-270px"
                v-html="detail?.introduce"
              ></div>
              <div class="text-[#F2FEFF] text-18px my-14px">招商合作</div>
              <div class="py-15px pl-13px com">
                <div class="mb-14px">联系人:{{ detail?.contact_person }}</div>
                <div>联系电话: {{ detail?.telephone }}</div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <!-- 常显热点点位展示页面 -->
      <template v-else-if="info?.markerType == 'hot'">
        <div class="my-10px px-10px text-[#333] text-16px">
          <el-tabs v-model="activeName" class="demo-tab">
            <el-tab-pane label="基本信息" name="first">
              <div v-show="detail?.remark" class="mt-14px jj com h-360px">
                {{ detail?.remark }}
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <!-- 项目管理信息展示页面 -->
      <template v-else-if="info?.markerType == 'build'">
        <div class="my-10px px-10px text-[#333] text-16px">
          <Tab :tab-panes="xmTabPanes" :row-list="xmList" :data="detail" />
        </div>
      </template>
    </div>
    <!-- 监控弹窗 -->
    <div class="jk_dialog" v-else>
      <div class="flex justify-between">
        <div class="flex-center text-#00FFFF text-14px mr-79px pt-11px">
          <img
            loading="lazy"
            class="mr-13px w-13px h-15px"
            :src="getAssets('jc-icon.png')"
            alt="icon"
          />监控视频
        </div>
        <div class="flex-center text-#04BCC2 text-12px pt-11px">
          {{ formatted }}
          <img
            loading="lazy"
            class="ml-23px w-24px h-24px"
            @click="updateShow"
            :src="getAssets('gb1.png')"
            alt="关闭"
          />
        </div>
      </div>
      <div class="w-100% h-1px bg-#00F9FF mt-9px mb-10px"></div>
      <video-player :options="videoOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetDataByTypeId } from "@/service/api";
import { getAssets, getServeImg } from "@/utils";
import { tabPanes, rowList, xmList, xmTabPanes } from "@/const/tableInfo";
interface detailProps {
  show: boolean;
  info: any;
}
const props = withDefaults(defineProps<detailProps>(), {
  info: null,
});
const detail = ref<any>(); //表单信息

// tab活跃栏
const activeName = ref<string>("first");
// 监控弹窗时间戳
const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const videoOptions = reactive<any>({
  isLive: true,
  source: "",
  id: "layerInfo-Video",
});

// 传参实时监听变化与赋值
watch(
  () => props.info,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      getDataByTypeId(newValue);
    }
  }
);

const getDataByTypeId = async (val) => {
  try {
    detail.value = await GetDataByTypeId({
      type: val.dataType,
      id: val.dataValue,
    });
    if (val.dataType === "hotspot") {
      detail.value.images = detail.value.images.split(",");
    } else {
      detail.value.images = detail.value.thumbnail.split(",");
      detail.value.panoLink = detail.value.panoramic_link;
    }
    if (detail.value?.videoUrl) {
      videoOptions.source = detail.value.videoUrl;
      videoOptions.isLive =
        detail.value?.videoUrl.indexOf(".mp4") != -1 ? false : true;
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const emit = defineEmits(["update:show", "showWebView"]);
// 全景按钮点击
const vrClick = (url: string) => {
  emit("showWebView", url);
};
const updateShow = () => {
  emit("update:show", false);
};
</script>

<style lang="less" scoped>
:deep(.overlayMain) {
  z-index: 1;
  position: absolute;
  top: 112px;
  right: 212px;
  width: 420px;
  color: #fff;
  height: 820px;
  box-sizing: border-box;
  background-color: #fff;
  background: url("@/assets/img/info-bg.png") no-repeat;
  background-size: 100% 100%;
  .qj_icon {
    position: absolute;
    width: 57px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .el-divider {
    margin: 0;
  }
  .carousel {
    padding: 30px 20px 0;
    height: 260px;
    box-sizing: border-box;
    .el-carousel {
      height: 100%;
    }
    .carousel_item {
      height: 230px;
    }
    .el-carousel__arrow {
      background-color: rgba(46, 74, 77, 0.7);
    }
    .el-carousel__indicators {
      display: none;
    }
    .el-icon svg {
      width: 12px;
      height: 12px;
    }
  }
  .demo-tab {
    .el-tabs__item {
      padding: 30px 30px 20px;
      color: #dae5e6;
      font-size: 16px;
      font-weight: 600;
    }
    .is-active {
      color: #78d0e0;
    }
    .el-tabs__active-bar {
      background-color: #78d0e0;
    }
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .com {
      box-sizing: border-box;
      padding: 14px 15px 28px;
      background: rgba(107, 142, 153, 0.2);
      border: 1px solid #0c454c;
      color: #e6e6e6;
      font-size: 16px;
    }
    .jj {
      line-height: 26px;
      overflow: hidden;
      overflow-y: auto;
    }
    .jj::-webkit-scrollbar {
      width: 5px;
    }

    .jj::-webkit-scrollbar-track {
      background: rgb(179, 177, 177);
      border-radius: 10px;
    }

    .jj::-webkit-scrollbar-thumb {
      background: #5c9099;
      border-radius: 10px;
    }
  }
}
.jk_dialog {
  position: absolute;
  width: 600px;
  height: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: url("@/assets/img/dialog-bg.png") no-repeat;
  background-size: 100% 100%;
  padding: 11px 25px 13px;
}
</style>
