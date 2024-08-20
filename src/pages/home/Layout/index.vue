<template>
  <!-- 顶部标题 -->
  <div class="top" v-show="!isDrone">
    <!-- 头部左侧标题、切换按钮 -->
    <div class="top_l">
      <div class="title">{{ projectInfo.name }}</div>
      <div class="flex flex-1 text-[#DAE5E6]">
        <template v-for="(i, idx) in btnTool" :key="i.id">
          <template v-if="i.menu_type !== 'moreTab'">
            <div
              class="top_btn top-hover"
              :class="{ active: activeTabId == i.id }"
              @click="tabClick(i.id)"
            >
              {{ i.title }}
            </div>
          </template>
          <div v-else class="top_btn relative" @click="i.show = !i.show">
            <span class="text-24px">{{ i.title }}</span>
            <img
              loading="lazy"
              class="w-24px h-14px ml-6px"
              :src="getAssets('icon_xl.png')"
              alt="icon"
            />
            <div v-show="i.show" class="many_main">
              <template v-for="j in i.childlist" :key="j.id">
                <div
                  class="mb-6px text-24px item relative"
                  :class="{ 'text-[#2FC6DC]': activeTabId == j.id }"
                  @click="manyClick(j)"
                >
                  {{ j.title }}
                </div>
              </template>
            </div>
          </div>
          <div v-if="idx < btnTool.length - 1" class="slash"></div>
        </template>
      </div>
    </div>
    <!-- 右侧天气进入后台等 -->
    <div class="top_r">
      <div class="top_info">
        <div
          class="flex-center text-14px cursor-pointer"
          @click="manyClick({ url: 'https://dash.yzbhe.com/index/login.html' })"
        >
          <img
            loading="lazy"
            class="w-72px h-77px mr-8px"
            :src="getAssets('icon_jrht.png')"
            alt="进入后台"
          />
          <span class="ml-[-20px]">进入后台</span>
        </div>
        <div class="w-1px h-36px bg-#ABBDE3 mx-17px opacity-60"></div>
        <div class="flex-column-center">
          <span class="text-20px">{{ time }}</span>
          <span class="text-12px">{{ years }}</span>
        </div>
        <div class="w-1px h-36px bg-#ABBDE3 mx-17px opacity-60"></div>
        <div class="flex-center" @click="userLoginOut">
          <img
            loading="lazy"
            class="w-73px h-73px"
            :src="getAssets(`icon-login-out.png`)"
            alt="退出登录"
          />
          <span class="ml-[-8px]">退出登录</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 左侧面板 -->
  <div v-show="!isDrone">
    <!-- 左侧面板 -->
    <AsyncPlan :plan-data="planData" />
  </div>
  <div v-show="isDrone">
    <!-- 无人机巡逻 -->
    <AsyncDronePatrol @back-home="tabClick(btnTool[0].id)" />
  </div>

  <!-- 右侧菜单 -->
  <AsyncMenu :menu="tabMenus" />
</template>

<script setup lang="ts">
import { GetGisBtnByMeun } from "@/service/api";
import { getAssets, formMenuData } from "@/utils";
import { getGid } from "@/utils/auth";
import { useProjectStore } from "@/store";
import { ElMessageBox } from "element-plus";

const AsyncMenu = defineAsyncComponent(() => import("./Menu/index.vue"));
const AsyncPlan = defineAsyncComponent(() => import("./Plan/index.vue"));
const AsyncDronePatrol = defineAsyncComponent(
  () => import("./DronePatrol/index.vue")
);

const { loginOut, projectInfo, menu } = useProjectStore();
const { replace } = useRouter();

const { tab, tabMenu } = formMenuData(menu);
const years = useDateFormat(useNow(), "YYYY.MM.DD"); //年份
const time = useDateFormat(useNow(), "HH:mm:ss"); //时间

const btnTool = ref<any>(); //按钮菜单
const tabMenus = ref<any>(""); //菜单
const activeTabId = ref<any>(""); //默认页面
const isDrone = ref<boolean>(false); //是否无人机
const planData = ref<any>();

const init = async () => {
  btnTool.value = tab; //根据权限给定tab值
  tabClick(btnTool.value[0].id);
};

const emit = defineEmits(["closeLayer", "changeVr"]);
// 页面切换按钮点击
const tabClick = async (id: number, type = "") => {
  activeTabId.value = id; //本次点击页面
  tabMenus.value = tabMenu[id];
  planData.value = await GetGisBtnByMeun(id);
  isDrone.value = type === "drone" ? true : false;
  emit("closeLayer"); //关闭弹窗
  emit("changeVr", type === "drone" ? false : true); //关闭vr按钮
};

// 更多点击功能
const manyClick = (item: any) => {
  // 判断是否是链接 如果是链接就webview 否则就是组件切换
  if (item.url) {
    window.open(item.url, "_blank");
  } else {
    tabClick(item.id, item.menu_type);
  }
};

// 退出登录
const userLoginOut = () => {
  ElMessageBox.confirm("是否退出本系统？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    customClass: "reset-login login-out",
  })
    .then(async () => {
      await loginOut();
      replace("/login?redirect=/index&gid=" + getGid());
      window.location.href = window.location.href;
    })
    .catch(() => {});
};

init();
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  height: 88px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  color: #fff;
  box-sizing: border-box;
  .top_l {
    display: flex;
    justify-content: space-between;
    height: 100%;
    padding-left: 40px;
    flex: 1;
    background: url("@/assets/img/top-bgl.png") no-repeat;
    background-size: 100% 100%;
    .top-hover:hover {
      color: var(--layout-top-hover-color) !important;
    }
    .title {
      font-family: "FZCHSJT";
      margin-top: 21px;
      width: 48%;
      // font-size: 40px;
      font-size: 36px;
      color: #fdfff7;
    }

    div {
      font-family: "USTitleBlack";
    }
    .slash {
      margin: 19px 29px 0;
      height: 18px;
      transform: rotate(30deg);
      background: var(--layout-slash-bg);
      width: 1px;
    }
  }
  .top_r {
    width: 435px;
    height: 56px;
    padding-right: 28px;
    display: flex;
    justify-content: flex-end;
    background: url("@/assets/img/top-bgr.png") no-repeat;
    background-size: 100% 100%;
    .top_info {
      display: flex;
      align-items: center;
      color: var(--layout-top-info-color);
      font-size: 16px;
    }
  }

  .top_btn {
    text-align: center;
    margin-top: 12px;
    font-size: 24px;
    cursor: pointer;
    font-family: "USTitleBlack";

    .user-menu {
      left: -60px !important;
    }

    .many_main {
      box-sizing: border-box;
      color: #dae5e6;
      position: absolute;
      top: 55px;
      left: -30px;
      width: 160px;
      padding: 14px 20px 8px;
      background: url("@/assets/img/many-bg.png") no-repeat;
      background-size: 100% 100%;

      .item:hover::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 100%;
        height: 8px;
        background: url("@/assets/img/icon_gy.png") no-repeat left center/100%
          auto;
      }
    }
  }

  .active {
    position: relative;
    color: var(--layout-top-active-color) !important;
    font-size: 28px !important;
  }
  .active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 30px;
    width: 100%;
    height: 3px;
    background: url("@/assets/img/line_top.png") no-repeat left center/100% auto;
  }
}
</style>
