<template>
  <div>
    <div v-show="report.show" class="guide">
      <!-- 上一页按钮 -->
      <img
        loading="lazy"
        @click="currentChange('prev')"
        class="mt-34px w-50px h-39px"
        :src="getAssets('guide-pagination.png')"
        alt="上一页"
      />
      <!-- 拖拽内容 -->
      <VueDraggable
        class="guide-list"
        ref="draggableRef"
        v-model="report.list"
        :disabled="report.disabled"
        :animation="150"
      >
        <div
          class="flex-column-center relative"
          :class="draggableListStyle(idx)"
          v-for="(item, idx) in report.list"
          :key="item.id"
          @click="handelGuide(item)"
        >
          <!-- <img
            loading="lazy"
            v-show="report.isSave"
            class="w-10px h-10px absolute top-0 right-0"
            @click.stop="handelDelete(item.id)"
            :src="getAssets('gb3.png')"
            alt="关闭"
          /> -->
          <img
            loading="lazy"
            class="w-68px h-68px origin-center"
            :class="{ 'scale-130': report.active == item.id }"
            :src="getAssets(report.icon)"
            alt="icon"
          />
          <div class="w-90px text-center truncate">
            {{ item.animationName }}
          </div>
        </div>
      </VueDraggable>
      <!-- 添加按钮 -->
      <div
        @click="formDialog.show = true"
        class="w-90px flex-column-center mr-14px"
        :style="{ display: report.isSave ? '' : 'none' }"
      >
        <img
          loading="lazy"
          class="w-68px h-68px"
          :src="getAssets('guide-add-icon.png')"
          alt="添加"
        />
        <div class="w-90px text-center">添加</div>
      </div>
      <!-- 下一页按钮 -->
      <img
        loading="lazy"
        @click="currentChange('next')"
        class="mt-34px w-50px h-39px rotate-180"
        :src="getAssets('guide-pagination.png')"
        alt="下一页"
      />
      <!-- 竖线 -->
      <div class="mt-24px h-80px w-1px bg-[#30444D] ml-10px mr-19px"></div>
      <!-- 编辑|保存按钮 -->
      <span class="edit" @click="handelEdit">{{ report.label }}</span>
    </div>
    <FormDialog
      v-show="formDialog.show"
      :dialog="formDialog.show ? formDialog : {}"
      @handel-btn="handelFormEvent"
    />
    <Detail
      :detail="report.detail"
      @change-detail="changeDetail"
      v-show="report.detailShow"
    />
    <div
      v-show="imgDialog.show"
      class="absolute top-0 left-0 w-full h-full flex-justify bg-[#000] bg-opacity-80"
    >
      <img loading="lazy" class="max-h-80%" :src="imgDialog.url" alt="icon"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Detail from "./detail.vue";
// import {
//   getPageReportAnimation,
//   postCreateReportAnimation,
//   deleteReportAnimation,
//   getPageReportFrame,
//   putUpdateReportAnimation,
// } from "@/service/api/report";
import { guideFormDialog } from "./const";
import { Report } from "./types";
// import { ElMessageBox } from "element-plus";
import { type UseDraggableReturn, VueDraggable } from "vue-draggable-plus";
import { getAssets } from "@/utils";

interface DetailProps {
  reportId: number;
}
const props = defineProps<DetailProps>();

const message = useMessage();
const draggableRef = ref<UseDraggableReturn>();
const formDialog = reactive(guideFormDialog);

const report = reactive<Report>({
  show: true,
  detailShow: false,
  label: "编辑",
  icon: "guide-main-icon.png",
  isSave: false,
  disabled: true,
  active: null,
  reportId: 0,
  list: [],
  detail: null,
  pageNo: 1,
  total: 0,
  pageSize: 5,
});

const imgDialog = reactive({
  url: "",
  show: false,
});

// 拖拽list样式
const draggableListStyle = computed(() => (idx: number) => {
  if (idx < report.list.length) {
    return report.isSave ? "mr-60px" : "mr-88px";
  }
  return "";
});

watch(
  () => props.reportId,
  (newValue) => {
    report.reportId = newValue;
    init();
  }
);

let animationData: any;
const init = async () => {
  // animationData = await getPageReportAnimation(report.reportId);
  report.total = animationData.length - report.pageSize;
  updateReportList();
};

const updateReportList = () => {
  report.list = animationData.slice(
    (report.pageNo - 1) * report.pageSize,
    report.pageNo * report.pageSize
  );
};

// 分页功能
const currentChange = (type: string) => {
  if (type === "prev" && report.pageNo > 1) {
    report.pageNo--;
  } else if (type === "next" && report.pageNo <= report.total) {
    report.pageNo++;
  }
  updateReportList();
};

// 动画点击功能
const handelGuide = async (item) => {
  if (report.isSave) {
    report.detail = item;
    //保存状态点击进行动画帧管理页面
    report.show = false;
    report.detailShow = true;
  } else {
    // const frames = await getPageReportFrame(item.id);
    await playAnimationFrames(frames);
  }
};

const playAnimationFrames = async (frames) => {
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    await clearExistingGraphics();
    if (!frame.sceneX) {
      imgDialog.show = true;
      imgDialog.url = parseLayersForImage(JSON.parse(frame.layersConfig));
    } else {
      await displayFrameContent(frame);
      await adjustCameraView(frame);
    }
    await delay(frame.timeWait * 1000);
    imgDialog.show = false;
  }
};

const clearExistingGraphics = async () => {
  window.cesiumInit.primitiveLoader.deleteFn();
  window.cesiumInit.divGraphic.deleteDivGraphic();
};

const parseLayersForImage = (layersConfig) => {
  return layersConfig.find((item) => item.type === "img")?.imgUrl || "";
};

const displayFrameContent = async (frame) => {
  const { geoLayers, markerLayers } = separateLayers(
    JSON.parse(frame.layersConfig)
  );
  if (markerLayers.length) useLoadData(markerLayers);
  if (geoLayers.length) await loadGeoJsonLayers(geoLayers);
};

const separateLayers = (layersConfig) => {
  const geoLayers: any = [],
    markerLayers: any = [];
  layersConfig.forEach((layer) => {
    if (layer.eventType !== "marker" && layer.name === layer.planName) {
      geoLayers.push(layer);
    } else {
      markerLayers.push(layer);
    }
  });
  return { geoLayers, markerLayers };
};

const loadGeoJsonLayers = async (layers) => {
  for (const layer of layers) {
    await window.cesiumInit.primitiveLoader.addGeoJsonLayer({
      ...layer,
      url: layer.jsondata,
    });
  }
};

const adjustCameraView = async (frame) => {
  await delay(500);
  window.cesiumInit.map3d.setCameraView(
    {
      lng: frame.sceneX,
      lat: frame.sceneY,
      alt: frame.sceneZ,
      heading: frame.sceneYaw,
      pitch: frame.scenePitch,
    },
    { duration: frame.timeFly }
  );
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 删除动画
// const handelDelete = (id: number) => {
//   ElMessageBox.confirm("确定删除该动画?", "", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//     customClass: "reset-login",
//   }).then(async () => {
//     // await deleteReportAnimation(id);
//     message.success("删除成功");
//     init();
//   });
// };

// 编辑功能
const handelEdit = () => {
  report.isSave = !report.isSave;
  report.disabled = !report.disabled;
  report.icon = report.isSave ? "guide-edit-icon.png" : "guide-main-icon.png";
  report.label = report.isSave ? "保存" : "编辑";
  report.isSave ? draggableRef.value?.start() : draggableRef.value?.pause();
  if (!report.isSave) updateAnimation(); //如果点击保存按钮更新动画
};

// 添加汇报动画管理表单功能
const handelFormEvent = (type: string) => {
  switch (type) {
    case "reset":
      formDialog.form.animationName = "";
      break;
    case "save":
      // 创建汇报动画
      // postCreateReportAnimation({
      //   reportId: report.reportId,
      //   animationName: formDialog.form.animationName,
      // }).then(() => {
      //   formDialog.show = false;
      //   init();
      //   handelFormEvent("reset"); //将时间重置
      // });
      break;
    case "close":
      formDialog.show = false;
      break;
  }
};

// 更新动画
const updateAnimation = async () => {
  // const apiList = report.list.map((item, animationOrder) =>
  //   putUpdateReportAnimation({ ...item, animationOrder })
  // );
  // await Promise.all(apiList);
  init();
  message.success("保存成功");
};

// 详情页退出时触发
const changeDetail = () => {
  report.detailShow = false;
  report.show = true;
  init();
};
</script>

<style lang="less" scoped>
.guide {
  position: absolute;
  bottom: 40px;
  left: 526px;
  width: 1099px;
  height: 125px;
  display: flex;
  padding: 0 14px;
  border-radius: 10px;
  color: #adcacc;
  font-size: 24px;
  font-family: "USTitleBlack";
  border: 1px solid #83a1b9;
  background: linear-gradient(
      to top,
      rgba(16, 23, 25, 0.6),
      rgba(16, 23, 25, 0.6)
    ),
    linear-gradient(
      to top,
      rgba(3, 161, 189, 0.28) 0%,
      rgba(3, 161, 189, 0) 61%,
      rgba(3, 86, 189, 0.28) 100%
    );

  .guide-list {
    background: url("@/assets/img/guide-main-bg.png") no-repeat center center;
    background-position: 50% 46px;
    width: 843px;
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 52px;
    background-size: 100% 14px;
    padding: 0 18px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .edit {
    margin-top: 28px;
    writing-mode: vertical-rl;
    /* 竖排文字方向，从右向左 */
    letter-spacing: 0.5em;
  }
}
</style>
