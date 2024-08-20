<template>
  <div class="w-100vw h-100vh overflow-hidden">
    <!-- cesium画布元素 -->
    <div id="cesiumContainer"></div>
    <!-- 全景与卫星切换 -->
    <div class="vr cursor-pointer" v-show="visible.vr">
      <div class="relative w-168x h-100%" @click="showWebView()">
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
    <AsyncLayout
      @close-layer="visible.layer = false"
      @change-vr="visible.vr = $event"
    />
    <!-- <AsyncLayout @change="handelLayer" /> -->
    <!-- 表单弹窗 -->
    <LayerInfoDialog
      :info="layerInfo"
      v-model:show="visible.layer"
      @show-web-view="showWebView"
    />
    <!-- 人房信息表单弹窗 -->
    <AsyncPersonModal
      :info="personInfo"
      v-model:show="visible.person"
      @show-web-view="showWebView"
    />
    <!-- 设计案例 -->
    <AsyncDesignModal :design-data="design" v-model:show="visible.design" />
    <!-- webview组件 -->
    <WebViewPage :page-url="pageUrl" v-model:show="visible.webView" />

    <!-- 底部经纬度信息 -->
    <div class="location">
      <div class="h-30px w-300px leading-30px text-[#707070] text-16px px-34px">
        湖南方田科技有限公司提供技术支持
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets, getServeImg } from "@/utils";
import CesiumInit from "@/utils/cesium/CesiumInit";
import { getProject } from "@/utils/auth";

// 异步子组件
const AsyncLayout = defineAsyncComponent(() => import("./Layout/index.vue"));
const AsyncPersonModal = defineAsyncComponent(
  () => import("./PersonModal/index.vue")
);
const AsyncDesignModal = defineAsyncComponent(
  () => import("./DesignModal.vue")
);

const design = ref<any>();
const pageUrl = ref<any>(); //跳转全景默认地址
const layerInfo = ref<any>(); //点击图层详情信息弹窗
const personInfo = ref<any>(); //点击的人房信息弹窗
const visible = reactive({
  layer: false,
  webView: false,
  person: false,
  design: false,
  vr: true,
});

let VRUrl;

// billboard点击事件
const billboardClick = async (event) => {
  const attr = event.graphic.attr;
  console.log(attr);
  switch (attr?.markerType) {
    case "pano": //全景点位
      showWebView(attr.vrLink);
      break;
    case "design": //全景设计比对
      visible.design = true;
      design.value = { img: getServeImg(attr.designImg), url: attr.vrLink };
      break;
    case "hot": //景点点位
    case "asset": //资产点位
    case "investment": //招商点位
    case "build": //建设点位
      handelInfoDialog(attr);
      break;
    case "houseInfoBuild": //人房信息楼栋
    case "houseInfoHold": //人房信息户
      handelInfoDialog(attr, true, "personInfo");
      break;
  }
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

// 展示信息弹窗 info:点击的图层数据  type：事件类型
const handelInfoDialog = (info, show = true, type = "layerInfo") => {
  switch (type) {
    case "layerInfo":
      visible.layer = show;
      if (!info) return;
      layerInfo.value = info;
      break;
    case "personInfo":
      visible.person = show;
      personInfo.value = info;
      break;
  }
};

const showWebView = (url = "") => {
  pageUrl.value = url || VRUrl;
  visible.webView = true;
};

onMounted(() => {
  window.cesiumInit = new CesiumInit();
  window.cesiumInit.loadData();
  VRUrl = getProject().pano_link;
  // 添加billboard点击事件
  window.cesiumInit.divGraphic.initClick((event) => billboardClick(event));
});

provide("handelInfoDialog", handelInfoDialog);
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
</style>
