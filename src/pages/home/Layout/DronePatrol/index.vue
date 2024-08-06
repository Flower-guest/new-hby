<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-19 14:06:57
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-08 17:17:48
 * @FilePath: \hby\src\pages\home\components\DronePatrol\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- 左侧菜单栏 -->
    <div class="left-menu" style="width: 70px" :class="classMenuL">
      <img
        loading="lazy"
        class="w-46px h-43px"
        :src="getAssets('drone-logo.png')"
        alt="logo"
      />
      <div
        class="flex-column-center text-#fff text-14px h-92px relative"
        v-for="i in leftMenu"
        :key="i.id"
        @click="handelLeftMenu(i)"
      >
        <img
          loading="lazy"
          v-show="drone.activeMenuL === i.id"
          class="w-68px h-92px absolute right-0 top-0"
          :src="getAssets('drone-icon-active-bg.png')"
          alt="icon"
        />
        <img
          loading="lazy"
          class="w-65px h-65px z-1"
          alt="menu"
          :src="getAssets(chooseMenuL(i))"
        />
        <span v-show="drone.activeMenuL !== i.id">{{ i.label }}</span>
      </div>
    </div>
    <!-- 顶部菜单 -->
    <div
      class="top-menu"
      :style="{
        width: drone.collapseState ? '100%' : `calc(100% - 70px)`,
        left: drone.collapseState ? '0' : '70px',
      }"
    >
      <!-- 顶部菜单左侧 -->
      <div class="menu-l">
        <!-- 收起展开功能 -->
        <img
          loading="lazy"
          @click="handelTopMenu('collapse')"
          class="w-40px h-40px"
          :class="{ 'rotate-180': drone.collapseState }"
          :src="getAssets('drone-icon-collapse.png')"
          alt="icon"
        />
        <div class="flex-center" v-for="i in topMenu.menuL" :key="i.id">
          <img
            v-if="i?.icon"
            loading="lazy"
            class="w-40px h-40px"
            :style="{ marginLeft: i?.margin }"
            :src="getAssets(i.icon)"
            alt="icon"
          />
          <div class="text-14px flex flex-col ml-16px">
            <span class="text-#fff">{{ i.label }}</span>
            <div class="text-#E2E5E6">
              <span class="text-#62B37B mr-4px">{{ dataTopMenu(i.props) }}</span
              >{{ i?.unit }}
            </div>
          </div>
        </div>
      </div>
      <!-- 顶部菜单右侧 -->
      <div class="menu-r">
        <div class="flex-center" v-for="i in topMenu.menuR" :key="i.id">
          <img
            v-if="i?.icon"
            loading="lazy"
            class="w-40px h-40px"
            :src="getAssets(i.icon)"
            alt="icon"
          />
          <div class="text-14px flex flex-col ml-16px">
            <span class="text-#fff">{{ i.label }}</span>
            <div class="text-#E2E5E6">
              <span class="text-#62B37B mr-4px">{{ dataTopMenu(i.props) }}</span
              >{{ i?.unit }}
            </div>
          </div>
        </div>
        <!-- 全屏功能 -->
        <div
          @click="handelTopMenu('fullScreen')"
          class="flex-center bg-#000 text-#fff w-90px h-40px justify-center"
        >
          <img
            loading="lazy"
            class="w-20px h-20px mr-10px"
            alt="icon"
            :src="
              getAssets(
                drone.fullState
                  ? 'drone-icon-fullScreen-a.png'
                  : 'drone-icon-fullScreen.png'
              )
            "
          />
          {{ drone.fullState ? "退出全屏" : "全屏" }}
        </div>
      </div>
    </div>
    <!-- 喊话文件上传 -->
    <input
      class="opacity-1"
      type="file"
      ref="fileInput"
      @change.stop="chooseAudio($event)"
      accept=".mp3"
    />
    <!-- 飞行任务弹窗 -->
    <div class="absolute top-90px left-90px flex" v-show="drone.listDialog">
      <InfoDialog>
        <template #infoMain>
          <div class="info_main">
            <!-- 顶部搜索 -->
            <div class="flex-center">
              <el-input v-model="drone.taskName" placeholder="输入航线名称搜索">
                <template #suffix>
                  <div class="flex-center" @click="getDroneList">
                    <div class="w-1px h-16px bg-[#5C9099]"></div>
                    <img
                      loading="lazy"
                      class="w-12px h-12px ml-18px mr-10px"
                      :src="getAssets('icon_ss.png')"
                      alt="icon"
                    />
                  </div>
                </template>
              </el-input>
              <el-button
                @click="changeFormDialog('taskName')"
                class="ml-8px"
                style="height: 36px"
                type="primary"
                color="#1887AA"
                icon="Plus"
                >新增航线</el-button
              >
            </div>
            <!-- 列表 -->
            <div class="mt-24px">
              <div
                class="task-list"
                :style="{
                  backgroundColor:
                    drone.activeTask == i.uuid ? 'rgba(51,116,128,0.8)' : '',
                }"
                @click.stop="handelAirline(i.uuid)"
                v-for="i in drone.list"
                :key="i.id"
              >
                <span>{{ i.name }}</span>
                <div class="text-12px text-#DAE5E6 mt-18px mb-29px">
                  <span>任务总里程：{{ i?.mileage }}m</span
                  ><span class="ml-28px">预计时间：{{ i?.usageTime }}s</span>
                  <span class="ml-28px"
                    >预估电量：{{ i?.electricQuantity }}%</span
                  >
                </div>
                <div class="flex">
                  <div
                    class="flex-justify text-14px mr-27px"
                    @click.stop="handelTaskBtn(i, btn.type)"
                    v-for="btn in taskListBtn"
                    :key="btn.type"
                  >
                    <img
                      loading="lazy"
                      class="w-14px h-14px mr-4px"
                      :src="getAssets(btn.icon)"
                      alt="icon"
                    />{{ btn.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </InfoDialog>
      <el-button
        v-show="drone.activeTask"
        class="ml-8px"
        style="height: 36px"
        type="primary"
        @click="changeFormDialog('takeOffLine')"
        color="#1887AA"
        >执行航线任务</el-button
      >
    </div>
    <!-- 机巢直播窗口 -->
    <div
      v-if="drone.showVideo"
      class="w-452px h-316px absolute top-86px right-102px"
    >
      <video-player :options="videoTarmac" />
    </div>
    <!-- 无人机直播窗口 -->
    <div
      v-show="drone.showVideo"
      class="w-452px h-316px absolute top-537px right-102px"
    >
      <video-player v-if="videoDrone.source" :options="videoDrone" />
      <div class="skeleton" v-else>暂无无人机视角</div>
    </div>
    <!-- 表单弹窗 -->
    <FormDialog
      v-show="formDialog.show"
      :dialog="formDialog.content"
      @handel-btn="handelFormEvent"
    />
  </div>
</template>

<script setup lang="ts">
import {
  postCreateAirline,
  getQueryTaskInfo,
  postTakeOffLine,
  getTaskList,
  getDroneInfo,
  deleteTask,
  getFlightEstimation,
  // getNewInfo,
  getTarmacStream,
  getDroneStream,
  postShout,
  getQueryAirline,
  getTaskRunTime,
} from "@/service/api/drone-patrol";
import {
  leftMenu,
  topMenu,
  booleanTranslations,
  taskListBtn,
  detailFormDialog,
} from "@/const/drone";
import localCache from "@/utils/cache";
import { comDroneLineStyle } from "@/const/util";
import { getAssets, isDecimal } from "@/utils";
import DronePatrolDraw from "@/utils/cesium/DronePatrolDraw"; //划线等功能类

const emit = defineEmits(["change", "backHome"]);
const message = useMessage();
const fileInput = ref<InstanceType<typeof HTMLElement> | any>();
const dronePatrolDraw = new DronePatrolDraw(window.cesiumInit.map3d);

// 无人机数据管理
const drone = reactive<any>({
  list: [],
  listDialog: false,
  activeMenuL: null,
  fullState: false,
  collapseState: false,
  info: {},
  taskName: "",
  activeTask: null,
  showVideo: false,
});
// 表单数据
const formDialog = reactive<any>(detailFormDialog);
// 视频流管理
const videoTarmac = reactive<any>({
  isLive: true,
  source: "",
  id: "tarmac-Video",
});
// 视频流管理
const videoDrone = reactive<any>({
  isLive: true,
  source: "",
  id: "drone-Video",
});

let flag = true;
let startCode = 83;

//选中的左侧菜单
const chooseMenuL = computed(() => (i) => {
  return drone.activeMenuL === i.id ? i.activeIcon : i.inactiveIcon;
});

// 左侧菜单样式
const classMenuL = computed(() => {
  return drone.collapseState ? "hidden" : "block";
});

// 顶部菜单展示数据
const dataTopMenu = computed(() => (props) => {
  const value = drone.info[props];
  if (typeof value === "boolean") {
    return booleanTranslations[String(value)];
  } else {
    return String(drone.info[props]) !== "undefined"
      ? isDecimal(drone.info[props], 10)
      : "未知";
  }
});

// 左侧菜单点击
const handelLeftMenu = (i) => {
  drone.activeMenuL = drone.activeMenuL === i.id ? null : i.id;
  if (!drone.activeMenuL) clearMap();
  switch (i.type) {
    case "home":
      if (flag) flag = false;
      handleHomeMenu();
      break;
    case "task":
      handleTaskMenu();
      break;
    case "history":
      break;
    case "event":
      break;
    case "shout":
      fileInput.value.click();
      break;
  }
};

// 清空地图数据
const clearMap = () => {
  window.cesiumInit.primitiveLoader.deleteFn();
  dronePatrolDraw.clearDroneLine();
};

// 首页按钮点击
const handleHomeMenu = () => {
  if (drone.showVideo) drone.showVideo = false;
  formDialog.content = {};
  clearMap();
  flag = false;
  emit("backHome");
};

// 任务列表点击
const handleTaskMenu = () => {
  drone.listDialog = !drone.listDialog;
  if (drone.listDialog) {
    drone.activeTask = null;
    getDroneList();
  }
};

//顶部菜单点击
const handelTopMenu = (type) => {
  switch (type) {
    case "fullScreen": //全屏
      toggleFullScreen();
      break;
    case "collapse": //收起展开左侧菜单
      drone.collapseState = !drone.collapseState;
      break;
  }
};

// 全屏|取消全屏
const toggleFullScreen = () => {
  drone.fullState = !drone.fullState;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
};

// 获取航线任务列表
const getDroneList = async () => {
  try {
    const list: any = await getTaskList(drone.taskName);
    // 使用map创建一个Promise数组，每个Promise代表一个异步操作
    drone.list = await Promise.all(list.map(getFlightEstimationWithTask));
  } catch (error) {
    console.error("获取飞行估计时发生错误:", error);
  }
};

// 获取飞行估计数据
const getFlightEstimationWithTask = async (task) => {
  const res: any = await getFlightEstimation(task.uuid);
  return { ...task, ...res };
};

// 喊话功能
const chooseAudio = async (event: any) => {
  const selectedFile = event.target.files[0];
  if (selectedFile && selectedFile.size <= 3 * 1024 * 1024) {
    const formData = new FormData();
    formData.append("audio", selectedFile); // 添加到表单，传入文件名
    await postShout(formData);
    fileInput.value.value = "";
  } else {
    message.error("文件大小超过3MB，请选择小于等于3MB的文件!");
  }
};

// 更改表单内容
const changeFormDialog = (type) => {
  formDialog.show = true;
  formDialog.type = type;
  formDialog.content = formDialog[type];
  if (type === "taskName") clearMap();
};

// 表单弹窗事件
const handelFormEvent = async (type: string) => {
  switch (type) {
    case "reset":
      formDialog.taskName.form.airlineName = "";
      formDialog.takeOffLine.form.type = "1";
      formDialog.takeOffLine.form.taskType = "0";
      break;
    case "save":
      formDialog.show = false;
      formDialog.type === "taskName" ? createNewTask() : takeOffLine();
      break;
    case "close":
      formDialog.show = false;
      break;
  }
};

// 绘制航线任务
const createNewTask = () => {
  dronePatrolDraw.starDrawDroneLine((points) => {
    const params: any = {
      airlineName: formDialog.taskName.form.airlineName,
      waypoints: points.map((e, idx) => ({
        seq: idx,
        marsLat: e.lat,
        marsLon: e.lng,
        heightFlight: e.alt > 100 ? e.alt : 100, //飞行高度
        angle: -20,
      })),
    };
    postCreateAirline(params).then(async () => {
      message.success("创建成功！");
      getDroneList();
    });
  });
};

// 航线任务点击
const handelAirline = async (uuid) => {
  clearMap();
  drone.activeTask = drone.activeTask === uuid ? null : uuid;
  if (drone.activeTask) {
    const res: any = await getQueryAirline(uuid);
    const positionsArr: any = res.map((e) => [
      e.lon,
      e.lat,
      e.heightFlight + 30,
    ]);
    positionsArr.forEach((pos, idx) => {
      dronePatrolDraw.addDivPoint({
        position: [pos[0], pos[1]],
        text: idx + 1,
      });
    });
    window.cesiumInit.primitiveLoader.addPolylinePrimitive({
      positions: positionsArr,
      style: comDroneLineStyle,
    });
  }
};

// 任务列表按钮点击
const handelTaskBtn = (item, type) => {
  switch (type) {
    case "delete":
      deleteTask(item.uuid).then(() => {
        message.success("删除成功！");
        drone.activeTask = null;
        clearMap();
        getDroneList();
      });
      break;
  }
};

// 执行航线任务
const takeOffLine = async () => {
  if (parseInt(drone.info.chargeRemainingInPercent) < 50) {
    message.warning("无人机电量过低无法执行飞行任务，请及时充电！");
    return;
  }
  const res: any = await postTakeOffLine({
    taskId: drone.activeTask,
    // taskId: "35aa5c88922b4a5ca1a546465ccdcdd8",
    type: formDialog.takeOffLine.form.type,
    taskType: formDialog.takeOffLine.form.taskType,
  });
  localCache.setCache("droneFly", true);
  console.log(res);
  configInfo(drone.activeTask);
};

// 视频流获取与飞机信息配置
const configInfo = async (taskId: string) => {
  const videoTarmacRes: any = await getTarmacStream();
  videoTarmac.source = videoTarmacRes.artc;
  startCode = 83;
  drone.listDialog = false;
  drone.showVideo = true;
  updateDroneInfo(1000, taskId);
};

// 轮询无人机飞行状态，并轮询获取无人机飞行实况数据
const updateDroneInfo = async (interval, taskId): Promise<void> => {
  while (flag) {
    try {
      const res: any = await getQueryTaskInfo(
        // "35aa5c88922b4a5ca1a546465ccdcdd8"
        taskId
      );
      if (parseInt(res.status) === startCode) {
        droneInfo();
        await new Promise((resolve) => setTimeout(resolve, interval));
      } else if (parseInt(res.status) <= 72) {
        if (!videoDrone.source && parseInt(res.status) > 31) {
          const videoDroneRes: any = await getDroneStream();
          videoDrone.source = videoDroneRes.artc;
        }
        startCode = 0;
        droneInfo();
        await new Promise((resolve) => setTimeout(resolve, interval));
      } else {
        handleTaskEnd();
      }
    } catch (error) {
      console.error("请求错误，停止轮询:", error);
      return;
    }
  }
};

// 获取无人机状态信息
const droneInfo = async () => {
  const response = await getDroneInfo();
  drone.info = response;
};

const handleTaskEnd = () => {
  message.success("任务结束");
  localCache.setCache("droneFly", false);
  flag = false;
  drone.listDialog = !drone.listDialog;
  if (drone.listDialog) getDroneList();
  drone.showVideo = false;
};

onMounted(async () => {
  try {
    // 查询无人机任务信息
    const taskInfo: any = await getTaskRunTime();
    const droneFly = localCache.getCache("droneFly");
    if (
      droneFly ||
      (parseInt(taskInfo.status) > 0 && parseInt(taskInfo.status) <= 72)
    ) {
      configInfo(taskInfo.taskID);
    } else {
      droneInfo();
    }
  } catch (err) {
    console.log(err);
  }
});
</script>

<style lang="less" scoped>
.top-menu {
  position: absolute;

  top: 0;
  height: 64px;
  display: flex;
  justify-content: space-between;
  background: #0b1011cc;
  padding: 0 20px;
  box-sizing: border-box;
  .menu-l {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  .menu-r {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
}
.left-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 100vh;
  padding-top: 10px;
  background: #145666cc;
  border-radius: 0px 4px 0px 0px;
  text-align: center;
  box-sizing: border-box;
}
.info_main {
  padding: 20px;
  box-sizing: border-box;
  :deep(.el-input) {
    flex: 1;
    height: 36px;

    .el-input__wrapper {
      background: #0d2124;
      box-shadow: inset 0px 0px 5px -1px #92efff;
      border-radius: 0;
      .el-input__inner {
        color: #7ac0cc;
      }

      .el-input__inner::placeholder {
        color: #7ac0cc;
      }
    }
  }
  .task-list {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #5c9099;
    color: #fff;
    font-size: 18px;
    padding: 18px 16px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
}
:deep(.el-loading-mask) {
  background-color: rgba(0, 0, 0, 0.4);
}
.skeleton {
  width: 100%;
  background: #000;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
