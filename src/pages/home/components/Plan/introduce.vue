<template>
  <div class="left flex">
    <div v-show="dialog">
      <InfoDialog :title="'xcjj'">
        <template #infoMain>
          <div class="info_main">
            <!-- 轮播图 -->
            <el-carousel
              v-hasPermi="['panel:intro:swiper']"
              height="202px"
              :interval="3000"
            >
              <el-carousel-item
                v-for="i in props.ruralInfo?.rotationImages"
                :key="i"
              >
                <img
                  loading="lazy"
                  @click="showInfo(i, 'img')"
                  class="w-100% h-100%"
                  :src="i"
                  alt="轮播图"
                />
              </el-carousel-item>
            </el-carousel>
            <!-- 滚动文字 -->
            <div
              class="h-124px mt-12px"
              v-hasPermi="['panel:intor:scrollText']"
            >
              <AutoScroll :type="'text'" :scroll-length="2">
                <template #scrollList>
                  <div v-for="i in 2" :key="i">
                    <span
                      class="cursor-pointer"
                      @click="showInfo(props.ruralInfo?.villageContent, 'text')"
                      v-html="props.ruralInfo?.villageContent"
                    ></span>
                  </div>
                </template>
              </AutoScroll>
            </div>
            <!-- 片区统计 -->
            <div class="mt-32px" v-hasPermi="['panel:intor:sum']">
              <div class="main-title">
                <span>片区统计</span>
              </div>
              <div class="pl-18px grid grid-cols-2">
                <template v-for="i in props.dataCount" :key="i.val">
                  <DataCount
                    :data-count="{ ...i, val: props.ruralInfo[i.val] }"
                  />
                </template>
              </div>
            </div>
            <!-- 片区资讯 -->
            <div class="mt-32px" v-hasPermi="['panel:intor:news']">
              <div class="main-title flex justify-between">
                <span>片区资讯</span>
                <div class="flex">
                  <template v-for="i in ruralNews.tab" :key="i.value">
                    <div
                      class="cursor-pointer mr-20px text-14px"
                      @click="tabClick(i)"
                    >
                      <div :class="{ activeItem: activeTab?.value == i.value }">
                        {{ i.label }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="h-150px w-full mt-16px">
                <AutoScroll>
                  <template #scrollList>
                    <template v-for="i in ruralNews.list" :key="i.id">
                      <div
                        class="w-100% hide text-20px mb-12px cursor-pointer"
                        v-show="i.status == 1"
                        @click="showInfo(i, 'text')"
                      >
                        {{ i.title }}
                      </div>
                    </template>
                  </template>
                </AutoScroll>
              </div>
            </div>
          </div>
        </template>
      </InfoDialog>
    </div>
    <img
      loading="lazy"
      class="w-51px h-101px"
      :class="{ 'jump rotate-180': !dialog }"
      @click="dialog = !dialog"
      :src="getAssets('sq.png')"
      alt="icon"
    />
  </div>
  <div class="overlay_dialog" v-show="isOverlayDialogVisible">
    <div class="overlayMain">
      <img
        loading="lazy"
        @click="isOverlayDialogVisible = false"
        class="mt-23px mr-49px w-48px h-48px"
        :src="getAssets('gb4.png')"
        alt="关闭"
      />
      <div class="dialog-title">
        {{ overlayDialogInfo?.label ?? "简介" }}
      </div>
      <div class="carousel" v-if="overlayDialogType == 'img'">
        <el-carousel class="w-90%" height="auto" :interval="3000">
          <el-carousel-item
            v-for="i in props.ruralInfo.rotationImages"
            class="carousel-item"
            :key="i"
          >
            <img loading="lazy" class="w-100% h-100%" :src="i" alt="轮播图" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="article" v-else>
        <div class="text-36px text-center">
          {{ overlayDialogInfo?.title }}
        </div>
        <div class="main" v-html="overlayDialogInfo?.content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "./com.less";
import DataCount from "./components/dataCount.vue";
import { getAssets } from "@/utils";
import { getDictOptions } from "@/utils/dict";
import { getInformationPage, getInformationId } from "@/service/api/admin-api";

defineEmits(["change"]);

interface detailProps {
  ruralInfo: any;
  tabValue: any;
  dataCount: any;
}
const props = defineProps<detailProps>();

const dialog = ref<boolean>(true); //可视化面板是否显示
const isOverlayDialogVisible = ref<boolean>(false); //是否显示弹窗
const overlayDialogType = ref<any>(); //弹窗显示类型
const activeTab = ref<any>(null); //乡村资讯tab点击
const ruralNews = reactive<any>({ tab: null, list: [], info: null });

const overlayDialogInfo = ref<any>();

onMounted(async () => {
  try {
    ruralNews.tab = getDictOptions("information_type"); //获取资讯分类
    ruralNews.list = await getInformationPage(ruralNews.tab[0].value);
    activeTab.value = ruralNews.tab[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// 切换tab点击事件
const tabClick = async (i) => {
  activeTab.value = i;
  ruralNews.list = await getInformationPage(i.value);
};

// 弹窗显示
const showInfo = async (val, type) => {
  isOverlayDialogVisible.value = true;
  overlayDialogType.value = type;
  // 判断是咨询点击还是乡村简介点击
  overlayDialogInfo.value = val?.id
    ? { ...(await getInformationId(val.id)), label: activeTab.value.label }
    : { content: val, title: null, label: null };
};
</script>

<style lang="less" scoped>
.overlay_dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.6);
  .overlayMain {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url("@/assets/img/overlay_dialog_bg.png") no-repeat;
    background-size: 100% 100%;
    width: 1200px;
    height: 690px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: end;
    .dialog-title {
      position: absolute;
      left: 16%;
      top: -1%;
      color: #58e7ff;
      font-size: 28px;
    }
    .carousel {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 4%;
      .carousel-item {
        height: 490px;
      }
    }
    .article {
      padding: 0 42px;
      overflow: hidden;
      height: 560px;
      width: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      .main {
        width: 100%;
        overflow: hidden;
      }
    }

    .article::-webkit-scrollbar {
      width: 10px;
    }

    .article::-webkit-scrollbar-track {
      background: rgb(179, 177, 177);
      border-radius: 10px;
    }

    .article::-webkit-scrollbar-thumb {
      background: #5c9099;
      border-radius: 10px;
    }
  }
}
.hide {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>
<style lang="less" scoped>
:deep(.el-carousel) {
  .el-carousel__arrow {
    background-color: rgba(0, 0, 0, 0.7);
  }
  .el-carousel__indicators {
    display: none;
  }
  .el-icon svg {
    width: 12px;
    height: 12px;
  }
}
</style>
