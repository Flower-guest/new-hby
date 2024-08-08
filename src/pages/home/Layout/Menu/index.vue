<template>
  <!-- 顶部搜索功能 -->
  <AsyncLocSearch v-model:visible="comVisible.locSearch" />
  <!-- 划线功能按钮 -->
  <div class="draw_tool">
    <template v-for="menuItem in menuVal" :key="menuItem.id">
      <div class="tool_list" @click="handleToolClick(menuItem)">
        <img
          loading="lazy"
          class="ml-8px w-24px h-24px"
          :style="{ opacity: menuItem?.image ? 1 : 0 }"
          :src="getServeImg(menuItem.image)"
          alt="icon"
        />
        <span class="text-18px">{{ menuItem.name }}</span>
        <img
          loading="lazy"
          class="w-14px h-10px"
          alt="icon"
          :style="xlStyle(menuItem)"
          :src="getAssets('icon_xl1.png')"
        />
      </div>
      <!-- <template v-if="menuItem.menuType === 'zsdl'">
        <div
          class="menuBox"
          v-show="shouldShowXL(menuItem) && isActiveMenu(menuItem.id)"
        >
          <div
            v-for="i in menuItem.children"
            :key="i.id"
            class="raido"
            :class="{ activeText: report.id == i.id ? true : false }"
            @click="handleReportClick(i)"
          >
            {{ i.reportName }}
          </div>
        </div>
      </template> -->
      <!-- <template v-else> -->
      <!-- 场景切换选项 -->
      <!-- <AsyncOperateMenu
        @handel-menu="saveActiveMenu"
      /> -->
      <AsyncOperateMenu
        ref="menuRef"
        v-show="menuItem.childlist.length > 0 && isActiveMenu(menuItem.id)"
        :event-type="menuItem.event_type"
        :tool-menu="menuItem.childlist"
      />
      <!-- </template> -->
    </template>
  </div>
  <!-- 日照分析 -->
  <AsyncShadow v-model:shadow="comVisible.sunlightCheck" />
  <!-- 淹没分析 -->
  <AsyncFlood v-model:flood="comVisible.floodCheck" />

  <!-- 规划分区功能 -->
  <AsyncPlanZone ref="zoneRef" />
  <!-- 招商导览功能 -->
  <!-- <AsyncReport v-show="report.show" :report-id="report.id" /> -->
</template>

<script setup lang="ts">
import { getAssets, getServeImg } from "@/utils";

// 异步子组件
const AsyncShadow = defineAsyncComponent(() => import("./Shadow/index.vue"));
const AsyncFlood = defineAsyncComponent(() => import("./Flood/index.vue"));
const AsyncLocSearch = defineAsyncComponent(
  () => import("./LocSearch/index.vue")
);
const AsyncOperateMenu = defineAsyncComponent(
  () => import("./OperateMenu/index.vue")
);
const AsyncPlanZone = defineAsyncComponent(
  () => import("./PlanZone/index.vue")
);
// const AsyncReport = defineAsyncComponent(
//   () => import("./components/invGuide/index.vue")
// );

const props = defineProps<{
  menu: any;
}>();

// const menuRef = ref<InstanceType<typeof AsyncOperateMenu> | null>();
const zoneRef = ref<InstanceType<typeof AsyncPlanZone> | null>();

// 组件显隐
const comVisible = reactive({
  locSearch: false,
  sunlightCheck: false,
  floodCheck: false,
});
const activeMenu = ref<any>(); //当前点击的按钮

// 招商导览组件
// const report = reactive<any>({
//   id: 0,
//   show: false,
// });

const menuVal = ref<any>(props.menu);

//监听页面切换执行对应函数
watch(
  () => props.menu,
  (newVal) => {
    newVal.forEach((item: any) => {
      if (item.menu_type === "planZoning") item.childlist = [];
    });
    menuVal.value = newVal;
    tabChange();
  }
);

// 当顶部按钮点击切换页面时触发的事件
const tabChange = () => {
  //进行数据删除
  window.cesiumInit.primitiveLoader.deleteFn();
  window.cesiumInit.divGraphic.deleteDivGraphic();
  comVisible.locSearch = false; // 隐藏点位搜索框
  comVisible.sunlightCheck = false; // 隐藏点位搜索框
  comVisible.floodCheck = false; // 隐藏点位搜索框
  zoneRef.value?.resetActive(); //重置分区状态
};

// 下拉菜单样式
const xlStyle = computed(() => (item: any) => {
  const res = activeMenu.value === item.id ? true : false;
  return {
    width: "14px",
    height: "10px",
    opacity: item.childlist.length > 0 ? 1 : 0,
    transform: res ? "rotate(0deg)" : "rotate(-90deg)",
  };
});

const isActiveMenu = computed(() => (id: string) => activeMenu.value === id);

// tool点击功能
const handleToolClick = (i) => {
  activeMenu.value = activeMenu.value == i.id ? "" : i.id; //点击相同取消选中状态

  if (i.menu_type !== "dualViewSync" || !activeMenu.value)
    window.cesiumInit.split.destroyControl();

  switch (i.menu_type) {
    case "locSearch": //位置搜索
    case "sunlightCheck": //日照分析
    case "floodCheck": //淹没分析
      comVisible[i.menu_type] = !comVisible[i.menu_type];
      break;
    case "panoPoints": //全景点位
    case "designCases": //全景设计比对点位
    case "planZoning": //规划分区
      if (activeMenu.value) {
        useLoadData([i.id], [{ url: i.jsonurl, id: i.id }]);
        window.cesiumInit.mapEvent.flyToPoint(i.scene_camera);

        if (i.menu_type === "planZoning") zoneRef.value?.loadData(i.id);
      } else {
        window.cesiumInit.mapEvent.removeLayer(i.id, "id");
        window.cesiumInit.divGraphic.removeLayer(i.id);

        if (i.menu_type === "planZoning") zoneRef.value?.resetActive(); //重置分区状态
      }
      break;
    case "rankScores": //积分排行榜
      break;
    case "dualViewSync": //双屏比对
      if (activeMenu.value) {
        window.cesiumInit.split.createControl(i);
      }
      break;
    case "modelFlattener": //模型压平
      break;
    case "animateInsight": //汇报动画
      break;
  }
};

// 招商导览点击
// const handleReportClick = (i) => {
//   report.id = report.id === i.id ? 0 : i.id;
//   report.show = report.id ? true : false;
// };

// 保存当前激活的菜单数据 用于导览的时候对应镜头数据展示
// const saveActiveMenu = () => {
//   store.setActiveMenu(menuRef.value);
// };
</script>

<style lang="less" scoped>
.draw_tool {
  position: absolute;
  right: 28px;
  top: 132px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #fff;

  .tool_list {
    height: 51px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 164px;
    margin-bottom: 21px;
    padding: 11px 11px 9px 8px;
    box-sizing: border-box;
    cursor: pointer;
    background: url("@/assets/img/btn-bg.png") no-repeat;
    background-size: 100% 100%;
    font-family: "USTitleBlack";
  }
}
.menuBox {
  margin-top: -24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  color: var(--menu-menuBox-color);
  width: 164px;
  padding: 14px 14px 8px;
  background: url("@/assets/img/sugges-list-bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
  .raido {
    width: 100%;
    text-align: center;
    cursor: pointer;
    padding: 8px 0;
    font-size: 14px;
    color: #fff;
    position: relative;
    &:hover::after {
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
  .activeText {
    color: var(--menu-activeText-color) !important;
  }
}
</style>
