<template>
  <div class="w-100vw h-100vh overflow-hidden">
    <!-- cesium画布元素 -->
    <div id="cesiumContainer"></div>
    <!-- 全景与卫星切换 -->
    <div class="vr cursor-pointer" v-show="showVR">
      <div class="relative w-168x h-100%" @click="showWebView(vrTotalUrl)">
        <div class="qjdw">
          <img loading="lazy" :src="getAssets('icon-qjdw.png')" alt="icon" />
        </div>
        <img
          loading="lazy"
          class="w-100% h-100%"
          :src="getAssets('qj.png')"
          alt="icon"
        />
        <div class="dt bg-#156076">全景</div>
      </div>
    </div>
    <!-- 主要页面 -->
    <!-- <AsyncLayout
      @change-tab="showTable = false"
      @change="changeTabInfo"
      @change-vr="showVR = $event"
    /> -->
    <AsyncLayout />
    <!-- 表单弹窗 -->
    <TableInfo
      :table-info="tableInfo"
      v-model:show-table="showTable"
      @show-web-view="showWebView"
    />
    <!-- 设计案例 -->
    <AsyncDesignModal :design-data="design" v-model:show-design="showDesign" />
    <!-- 人房信息表单弹窗 -->
    <AsyncPersonModal
      :person-prop="personProp"
      v-model:show-person="showPerson"
      @show-web-view="showWebView"
    />
    <!-- webview组件 -->
    <WebViewPage
      v-if="toPageUrl"
      :to-page-url="toPageUrl"
      v-model:show-iframe="showIframe"
    />
    <!-- 底部经纬度信息 -->
    <div class="location">
      <div class="h-30px w-300px leading-30px text-[#707070] text-16px px-34px">
        湖南方田科技有限公司提供技术支持
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import {
// getPlanningDataManagementOnly,
// getInvestmentProjects,
// getAssetManagement,
// getPanoramicPoint,
// getMapPoints,
// getBuiltProjects,
// } from "@/service/api/admin-api";
import { getAssets } from "@/utils";
import CesiumInit from "@/utils/cesium/CesiumInit";

// 异步子组件
const AsyncLayout = defineAsyncComponent(
  () => import("./components/layout.vue")
);
const AsyncPersonModal = defineAsyncComponent(
  () => import("./components/modal/personModal.vue")
);
const AsyncDesignModal = defineAsyncComponent(
  () => import("./components/modal/designModal.vue")
);

// const message = useMessage();

const showTable = ref<boolean>(false); //是否展示表单
const showPerson = ref<boolean>(false); //是否展示人房信息表单
const showIframe = ref<boolean>(false); //是否显示iframe
const showDesign = ref<boolean>(false); //是否显示设计图
const showVR = ref<boolean>(true);
const design = ref<any>();
const toPageUrl = ref<any>(); //跳转全景默认地址
const personProp = ref<number>(0); //点击的人房信息fnum 用来进行数据查询
const tableInfo = ref<any>(); //点击建筑物table数据

let // divGraphic,
  vrTotalUrl;

//     vrTotalUrl = initData.vrUrl;
//     // 添加面点击事件
//     cesium.primitiveLoader.initClick((event) => billboardClick(event));
//   });
// };

// billboard点击事件
const billboardClick = async (event) => {
  const attr = event.graphic.attr;
  switch (attr?.markerType) {
    case "pano":
      console.log(attr);
      // showWebView(attr.url);
      break;
    case "design":
      console.log(attr);
      // showWebView(attr.url);
      break;
    case "houseInfo":
      console.log(attr);
      // showWebView(attr.url);
      break;
  }
  // if (!attr || attr.markerType === "bq") return;
  // const tableInfoFetch = async (fetchFn) => {
  //   const res = await fetchFn({ fnum: attr.fnum });
  //   if (res.length < 1) {
  //     message.warning("暂未查询到该信息！");
  //   } else {
  //     showInfoTable({ ...res[0], markerType: attr.markerType }, "showTable");
  //   }
  // };
  // const actions = {
  //   rfxx: () =>
  //     showInfoTable({ fnum: attr.fnum, dataName: attr.dataName }, "showPerson"),
  //   qjdw: async () => {
  //     const url =
  //       attr.url ||
  //       ((await getPanoramicPoint({ fnum: attr.fnum })) as any)[0]
  //         .panoramicServiceAddress;
  //     showWebView(url);
  //   },
  //   sjal: () => {
  //     showDesign.value = true;
  //     design.value = attr.name;
  //   },
  //   rd: () => tableInfoFetch(getMapPoints),
  //   js: () => tableInfoFetch(getBuiltProjects),
  //   zc: () => tableInfoFetch(getAssetManagement),
  //   default: () => tableInfoFetch(getInvestmentProjects),
  // };
  // const action = actions[attr.markerType] || actions.default;
  // await action();
};

// tabelInfo显示与内容替换
// const changeTabInfo = (i) => {
//   if (i?.infoType == "personModal") {
//     showPerson.value = true;
//     personProp.value = i;
//   } else {
//     showTable.value = i?.showTable ?? true;
//     tableInfo.value = i;
//   }
// };

// 模型点击\marker点点击 展示表单 info:点击模型返回的信息  type：事件类型
// const showInfoTable = (info, type) => {
//   //如果在使用划线功能就不展示弹窗
//   switch (type) {
//     case "showTable":
//       showTable.value = true;
//       tableInfo.value = info;
//       break;
//     case "showPerson":
//       showPerson.value = true;
//       personProp.value = info;
//       break;
//   }
// };

const showWebView = (url) => {
  toPageUrl.value = url || vrTotalUrl;
  showIframe.value = true;
};

onMounted(() => {
  window.cesiumInit = new CesiumInit();
  window.cesiumInit.loadData();
  // 添加billboard点击事件
  window.cesiumInit.divGraphic.initClick((event) => billboardClick(event));
});
</script>

<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.location {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  background: url("@/assets/img/location-bg.png") no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.vr {
  position: absolute;
  height: 124px;
  right: 110px;
  bottom: 56px;
  border-radius: 4px;
  display: flex;

  .qjdw {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.3);
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 33px;
      height: 24px;
    }
  }
  .dt {
    position: absolute;
    box-sizing: border-box;
    bottom: 0;
    right: 0;
    padding: 1px 5px 1px 8px;
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    border-radius: 4px 0px 4px 0px;
  }
}
.weather {
  position: absolute;
  top: 80px;
  right: 28px;
  display: flex;
  color: #fff;
  div {
    padding: 8px;
    margin-left: 8px;
    border-radius: 18px;
    background-color: rgba(12, 183, 189, 0.4);
  }
}
</style>
