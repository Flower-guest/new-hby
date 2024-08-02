<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-03-19 15:15:42
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-06-26 17:22:13
 * @FilePath: \hby\src\pages\home\components\FootTool\addGuide.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="detail-guide">
      <div class="relative flex-between-center h-full w-full">
        <!-- 顶部按钮 -->
        <div class="top flex justify-between items-center text-[#E6FDFF]">
          <!-- 左侧按钮 -->
          <div class="flex">
            <div
              v-for="item in tool.topLeft"
              :key="item.type"
              @click="handleTool(item)"
              class="flex-center mr-12px"
            >
              <img
                loading="lazy"
                class="w-15px h-15px mr-4px"
                :src="getAssets(item.icon)"
                alt="icon"
              />
              {{ item.label }}
            </div>
          </div>
          <!-- 中间时间显示 -->
          <div>{{ totalTime }}</div>
          <!-- 右侧按钮 -->
          <div class="flex text-[#5FE0EE]">
            <div
              v-for="item in tool.topRight"
              :key="item.type"
              @click="handleTool(item)"
              class="bg-[#1E3033] py-4px px-12px rounded-4px ml-8px flex-center"
            >
              <img
                loading="lazy"
                class="w-20px h-20px mr-4px"
                :src="getAssets(item.icon)"
                alt="icon"
              />
              {{ item.label }}
            </div>
          </div>
        </div>
        <!-- 上一页 -->
        <img
          loading="lazy"
          @click="currentChange('prev')"
          class="w-36px h-64px"
          :src="getAssets('guide-detail-p.png')"
          alt="上一页"
        />
        <!-- 中间主要内容 -->
        <div class="flex">
          <VueDraggable class="flex" v-model="scene.list" :animation="150">
            <div
              v-for="(item, idx) in sceneItems"
              :key="idx"
              @click="scene.idx = idx"
              class="w-120px h-68px mr-8px"
              :class="{ relative: idx === scene.idx }"
            >
              <!-- 视角 -->
              <img
                loading="lazy"
                class="w-full h-full"
                :src="item?.frameThumbnail"
                alt="视角缩略图"
              />
              <!-- 视角对应事件 -->
              <div
                v-show="idx === scene.idx"
                class="absolute top-0 left-[-3px] flex-column-center"
              >
                <div
                  class="w-120px h-68px border border-#2ED3E6 rounded-8px border-solid"
                >
                  <img
                    loading="lazy"
                    @click.stop="updateScene('lAddScene')"
                    class="w-20px absolute top-24% left-[-8px]"
                    :src="getAssets('detail-guide-add-icon.png')"
                    alt="icon"
                  />
                  <img
                    loading="lazy"
                    @click.stop="updateScene('rAddScene')"
                    class="w-20px absolute top-24% right-[-8px]"
                    :src="getAssets('detail-guide-add-icon.png')"
                    alt="icon"
                  />
                </div>
                <div class="tip">
                  <img
                    loading="lazy"
                    v-for="tip in tool.tip"
                    :key="tip.icon"
                    @click.stop="handleTool(tip)"
                    class="w-24px h-24px"
                    :src="getAssets(tip.icon)"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
          </VueDraggable>
          <!-- 新增视角 -->
          <div class="guide-add">
            <img
              loading="lazy"
              class="w-31px h-28px"
              :src="getAssets('detail-guide-add-camera-icon.png')"
              alt="新增视角"
            />
            <div class="guide-add-hover">
              <div @click="handleTool({ type: 'addScene', icon: '' })">
                视角
              </div>
              <div class="relative">
                图片
                <input
                  class="opacity-0 absolute top-0 left-0"
                  type="file"
                  ref="fileInput"
                  @change.stop="chooseImg($event)"
                  accept=".jpg, .jpeg, .png"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 下一页 -->
        <img
          loading="lazy"
          @click="currentChange('next')"
          class="w-36px h-64px rotate-180"
          :src="getAssets('guide-detail-p.png')"
          alt="下一页"
        />
      </div>
    </div>
    <!-- 设置时间 | 导览名称 -->
    <FormDialog
      v-show="formDialog.show"
      :dialog="formDialog.content"
      @handel-btn="handelFormEvent"
    />
    <!-- 弹窗 -->
    <AlertDialog
      v-show="alertDialog.show"
      :dialog="alertDialog.content"
      @handel-btn="handelAlertEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { detailTool, detailFormDialog } from "./const";
import { DetailToolItem, ReportList, DetailScene } from "./types";
import { useToolStore } from "@/store";
import { getAssets } from "@/utils";
import { toFormData } from "@/utils/upload";
import { VueDraggable } from "vue-draggable-plus";
import {
  getPageReportFrame,
  postCreateReportFrame,
  putUpdateReportFrame,
  deleteReportFrame,
  putUpdateReportAnimation,
} from "@/service/api/report";

interface detailProps {
  detail: ReportList | null;
}

const message = useMessage();

const props = defineProps<detailProps>();
const store = useToolStore();
const tool = reactive(detailTool);
const formDialog = reactive(detailFormDialog);
const fileInput = ref<InstanceType<typeof HTMLElement> | any>();
const scene = reactive<DetailScene>({
  animation: null,
  deleteId: [],
  list: [],
  idx: -1,
  pageNo: 1,
  pageSize: 7,
  saveStatus: true,
});

// 消息弹窗
const alertDialog = reactive<any>({
  show: false,
  content: {},
});

// 总页数
const totalPages = computed(() =>
  Math.ceil(scene.list.length / scene.pageSize)
);

// 页面展示场景值处理
const sceneItems = computed(() => {
  const start = (scene.pageNo - 1) * scene.pageSize;
  const end = start + scene.pageSize;
  return scene.list.slice(start, end);
});

// 导览总时长 分:秒
const totalTime = computed(() => {
  const totalSeconds = scene.list.reduce(
    (acc, cur: any) => acc + parseInt(cur.timeFly) + parseInt(cur.timeWait),
    0
  );
  return `${Math.floor(totalSeconds / 60)}:${totalSeconds % 60}`;
});

watch(
  () => props.detail,
  async (newValue) => {
    scene.animation = newValue;
    tool.topLeft[1].label = newValue?.animationName;
    await getReportFrame();
  }
);

// 获得汇报帧管理分页
const getReportFrame = async () => {
  if (scene.animation) {
    const res: any = await getPageReportFrame(scene.animation.id);
    scene.list = res;
  }
};

// 分页功能
const currentChange = (direction: "prev" | "next") => {
  if (direction == "prev" && scene.pageNo > 1) {
    scene.pageNo--;
  } else if (direction === "next" && scene.pageNo < totalPages.value) {
    scene.pageNo++;
  }
};

// 功能按钮事件
const handleTool = async (item: DetailToolItem) => {
  switch (item.type) {
    case "back": //如果点击返回，判断是否有保存的动画帧
      if (!scene.saveStatus) {
        showAlertDialog(item.dialog);
      } else {
        emit("changeDetail");
        scene.idx = -1;
      }
      break;
    case "delete":
      showAlertDialog(item.dialog);
      break;
    case "save":
      await changeReportFrame("save");
      showAlertDialog(item.dialog);
      break;
    case "editName":
      openFormDialog("name");
      break;
    case "addScene":
    case "update":
      if (item.type === "update" && !scene.list[scene.idx].sceneX) {
        fileInput.value.click();
      } else {
        await updateScene(item.type);
      }
      break;
    case "deleteScene":
      if (scene.list[scene.idx]?.id)
        scene.deleteId.push(scene.list[scene.idx].id as number);
      scene.list.splice(scene.idx, 1);
      scene.idx = -1;
      break;
    case "time":
      openFormDialog("time");
      break;
  }
};

// 打开提示弹窗
const showAlertDialog = (content: any) => {
  alertDialog.show = true;
  alertDialog.content = content;
};

// 打开表单弹窗
const openFormDialog = (type: string) => {
  formDialog.show = true;
  formDialog.type = type;
  if (type === "name") {
    formDialog.content = formDialog.name;
    formDialog.name.form["guideName"] = tool.topLeft[1].label;
  } else {
    formDialog.content = formDialog.time;
    formDialog.time.form["timeFly"] = scene.list[scene.idx]?.timeFly || "1";
    formDialog.time.form["timeWait"] = scene.list[scene.idx]?.timeWait || "1";
  }
};

// 消息弹窗事件
const emit = defineEmits(["changeDetail"]);
const handelAlertEvent = async (type: string) => {
  switch (type) {
    case "save":
      changeReportFrame("save");
      emit("changeDetail");
      break;
    case "noSave":
      scene.saveStatus = true;
      emit("changeDetail");
      break;
    case "confirm":
      await changeReportFrame("delete");
      break;
  }
  if (alertDialog.show) alertDialog.show = false;
  alertDialog.content = {};
};

// 表单弹窗事件
const handelFormEvent = async (type: string) => {
  switch (type) {
    case "reset":
      formDialog.name.form["guideName"] = tool.topLeft[1].label;
      formDialog.time.form["timeFly"] = "1";
      formDialog.time.form["timeWait"] = "1";
      break;
    case "save":
      formDialog.show = false;
      if (formDialog.type === "name") {
        await updateAnimationName();
      } else {
        setListTime(scene.idx);
      }
      handelFormEvent("reset"); //将时间重置
      break;
    case "close":
      formDialog.show = false;
      break;
  }
};

const updateAnimationName = async () => {
  tool.topLeft[1].label = formDialog.name.form["guideName"];
  await putUpdateReportAnimation({
    ...scene.animation,
    animationName: formDialog.name.form["guideName"],
  });
  message.success("修改名称成功！");
};

// 场景更新|新增
const updateScene = async (type) => {
  scene.saveStatus = false; //数据进行更新就将保存状态置为false
  const tree = store.activeMenu.map((item) => ({ ...item, isShow: true }));
  const shortMapImg = await window.cesiumInit.mapEvent.shortMapImg({
    noSplit: true,
  });
  const cameraView = window.cesiumInit.map3d.getCameraView();
  const frameThumbnail = await toFormData(shortMapImg, "base64");

  const newScene: any = {
    ...scene.list[scene.idx],
    animationId: scene.animation?.id,
    frameThumbnail,
    sceneX: cameraView.lng,
    sceneY: cameraView.lat,
    sceneZ: cameraView.alt,
    scenePitch: cameraView.pitch,
    sceneYaw: cameraView.heading,
    layersConfig: JSON.stringify(tree),
  };
  if (type === "update") {
    scene.list[scene.idx] = newScene;
  } else {
    const idx = type === "lAddScene" ? scene.idx : scene.idx + 1;
    scene.list.splice(Math.max(0, idx), 0, newScene);
    if (type === "addScene") {
      setListTime(scene.list.length - 1);
      scene.pageNo = Math.max(1, totalPages.value);
    }
  }
  scene.idx = -1;
};

// 设置时间
const setListTime = (idx) => {
  const { timeFly, timeWait } = formDialog.time.form;
  scene.list[idx].timeFly = timeFly;
  scene.list[idx].timeWait = timeWait;
};

// 动画帧 删除|保存
const changeReportFrame = async (type: string) => {
  const apiCalls = scene.list.map((item, frameOrder) => {
    const requestData = { ...scene.animation, ...item, frameOrder };
    if (type === "delete") return deleteReportFrame(item.id);
    return item.id
      ? putUpdateReportFrame(requestData)
      : postCreateReportFrame(requestData);
  });

  if (scene.deleteId.length) {
    scene.deleteId.forEach((id) => apiCalls.push(deleteReportFrame(id)));
  }

  await Promise.all(apiCalls);
  await getReportFrame();
  scene.deleteId = [];
  scene.saveStatus = true;
  message.success(type === "delete" ? "删除成功" : "保存成功");
};

// 图片上传
const chooseImg = async (event) => {
  const selectedFile = event.target.files[0];
  console.log(selectedFile);
  if (selectedFile) {
    // 检查文件大小
    if (selectedFile.size > 3 * 1024 * 1024) {
      // 3MB转换成字节数
      message.error("文件大小超过3MB，请选择小于等于3MB的文件!");
    } else {
      const frameThumbnail: any = await toFormData(selectedFile);
      const newScene = {
        ...scene.list[scene.idx],
        frameThumbnail,
        animationId: scene.animation?.id,
        type: "img",
        layersConfig: JSON.stringify([
          {
            imgUrl: frameThumbnail,
            isShow: true,
            type: "img",
          },
        ]),
      };
      fileInput.value.value = "";
      if (scene.idx >= 0) {
        scene.list[scene.idx] = newScene;
      } else {
        scene.list.push(newScene);
        setListTime(scene.list.length - 1);
        scene.pageNo = Math.max(1, totalPages.value);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detail-guide {
  position: absolute;
  bottom: 40px;
  left: 526px;
  width: 1099px;
  height: 179px;
  padding: 0 14px;
  border-radius: 10px;
  color: #adcacc;
  font-size: 14px;
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

  .top {
    position: absolute;
    top: 12px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 33px;
    box-sizing: border-box;
  }

  .tip {
    background-color: #323a42;
    border-radius: 4px;
    width: 110px;
    margin-top: 10px;
    padding: 6px 8px;
    display: flex;
    justify-content: space-between;
    position: relative;

    &:after {
      content: "";
      border-style: solid;
      border-width: 0 8px 6px 8px;
      border-color: transparent transparent #323a42 transparent;
      position: absolute;
      left: 56px;
      top: -4px;
      z-index: 1;
    }
  }

  .guide-add {
    width: 120px;
    height: 68px;
    border: 1px solid #63657d;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &:hover .guide-add-hover {
      display: flex;
      div {
        width: 49%;
        height: 100%;
        text-align: center;
      }
    }

    .guide-add-hover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 68px;
      background-color: rgba(0, 0, 0, 0.6);
      display: none;
    }
  }
}
</style>
