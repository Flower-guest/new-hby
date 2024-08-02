<template>
  <div v-if="showTable">
    <!-- 信息展示页面 -->
    <div class="overlayMain" v-if="tableInfos?.markerType !== 'wlw'">
      <div class="flex-between-center mt-31px px-12px">
        <img
          loading="lazy"
          @click="updateShowTable"
          class="w-23px h-32px ml-7px"
          :src="getAssets('icon_xxmb.png')"
          alt="icon"
        />
        <div class="text-23px">
          <!-- titleInvestment：资产招商标题 assetName：资产标题 projectName：招商|建设  pointName：常显点位 -->
          {{
            tableInfos?.projectName ??
            tableInfos?.assetName ??
            tableInfos?.pointName ??
            tableInfos?.titleInvestment
          }}
        </div>
        <img
          loading="lazy"
          @click="updateShowTable"
          class="w-20px h-20px"
          :src="getAssets('gb3.png')"
          alt="关闭"
        />
      </div>
      <div class="px-19px">
        <el-carousel
          class="w-100% mt-34px"
          height="auto"
          indicator-position="none"
        >
          <el-carousel-item
            class="carousel_item"
            v-for="j in tableInfos.thumbnail"
            :key="j"
          >
            <div class="relative w-100% h-100%">
              <img loading="lazy" class="w-100% h-100%" :src="j" alt="轮播图" />
              <img
                loading="lazy"
                class="qj_icon"
                alt="全景图标"
                v-show="
                  tableInfos?.panoramicAddress ??
                  tableInfos?.panoramicLink ??
                  tableInfos?.panoramicServiceAddress
                    ? true
                    : false
                "
                :src="getAssets('icon-qj.png')"
                @click="
                  vrClick(
                    tableInfos?.panoramicAddress ??
                      tableInfos?.panoramicLink ??
                      tableInfos?.panoramicServiceAddress
                  )
                "
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 产业信息展示页面 -->
      <template v-if="tableInfos?.markerType == 'zc'">
        <div class="my-10px pl-19px text-[#333] text-16px">
          <div class="relative">
            <Tab :tab-panes="tabPanes" :row-list="rowList" :data="tableInfos" />
            <span class="absolute top-5% right-12px text-18px text-[#E0E02D]"
              >{{ tableInfos?.listingPrice }}元/年</span
            >
          </div>
        </div>
      </template>
      <!-- 招商信息展示页面 -->
      <template v-else-if="tableInfos?.markerType == 'zs'">
        <div class="my-10px px-10px text-[#333] text-16px">
          <el-tabs v-model="activeName" class="demo-tab">
            <el-tab-pane label="基本信息" name="first">
              <div
                v-if="tableInfos?.projectIntroduction"
                class="jj com max-h-270px"
                v-html="tableInfos?.projectIntroduction"
              ></div>
              <div class="text-[#F2FEFF] text-18px my-14px">招商合作</div>
              <div class="py-15px pl-13px com">
                <div class="mb-14px">联系人:{{ tableInfos?.contactUnit }}</div>
                <div>联系电话: {{ tableInfos?.telephone }}</div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <!-- 常显热点点位展示页面 -->
      <template v-else-if="tableInfos?.markerType == 'rd'">
        <div class="my-10px px-10px text-[#333] text-16px">
          <el-tabs v-model="activeName" class="demo-tab">
            <el-tab-pane label="基本信息" name="first">
              <div v-show="tableInfos?.remark" class="mt-14px jj com">
                {{ tableInfos?.remark }}
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <!-- 项目管理信息展示页面 -->
      <template v-else>
        <div class="my-10px px-10px text-[#333] text-16px">
          <Tab :tab-panes="xmTabPanes" :row-list="xmList" :data="tableInfos" />
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
            @click="updateShowTable"
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
import { getAssets } from "@/utils";
import { tabPanes, rowList, xmList, xmTabPanes } from "@/const/tableInfo";
interface detailProps {
  showTable: boolean;
  tableInfo: any;
}
const props = withDefaults(defineProps<detailProps>(), {
  tableInfo: null,
});
const showTable = toRef(props, "showTable"); //是否显示弹窗
const tableInfos = ref<any>(); //表单信息

// tab活跃栏
const activeName = ref<string>("first");
// 监控弹窗时间戳
const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const videoOptions = reactive<any>({
  isLive: true,
  source: "",
  id: "tableInfo-Video",
});
// 传参实时监听变化与赋值
watch(
  () => props.tableInfo,
  (newValue) => {
    tableInfos.value = newValue;
    formatData();
  }
);

const formatData = () => {
  if (!tableInfos.value?.thumbnail || !tableInfos.value.thumbnail[0]) {
    tableInfos.value.thumbnail = [getAssets("default_thumb.jpg")];
  }
  tableInfos.value.videoUrl =
    tableInfos.value?.videoUrl ?? "http://demo.fantere.com/3dCock/test.mp4";
  videoOptions.source = tableInfos.value.videoUrl;
  videoOptions.isLive =
    tableInfos.value?.videoUrl.indexOf(".mp4") != -1 ? false : true;
};

const emit = defineEmits(["update:showTable", "showWebView"]);
// 全景按钮点击
const vrClick = (vrUrl) => {
  emit("showWebView", vrUrl);
};
const updateShowTable = () => {
  emit("update:showTable", false);
};
</script>

<style lang="less" scoped>
.table_info {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);

  .center_dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px 28px 20px;
    width: 820px;
    max-height: 308px;
  }

  .dialog_table {
    background: url("@/assets/img/table-bg.png") no-repeat;
    background-size: 100% 100%;

    :deep(.custom_table) {
      max-height: 260px;
      overflow: hidden;
      overflow-y: auto;

      tbody tr {
        pointer-events: none;
      }

      .el-table__header .el-table__cell {
        background-color: rgba(32, 88, 130);
        color: #fff;
      }

      .el-table__row {
        background-color: rgba(40, 70, 93, 0.8);
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .dialog_jk {
    background: url("@/assets/img/dialog-bg.png") no-repeat;
    background-size: 100% 100%;
  }

  :deep(.form_dialog) {
    position: absolute;
    width: 500px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background-color: #fff;

    .el-form-item__label {
      color: #fff;
    }
  }
}
.overlayMain {
  z-index: 1;
  position: absolute;
  top: 112px;
  right: 212px;
  width: 420px;
  color: #fff;
  height: 845px;
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

  .carousel_item {
    height: 230px;
  }
}
:deep(.demo-tab) {
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
    height: 410px;
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
:deep(.el-carousel) {
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
../../const/tableInfo
