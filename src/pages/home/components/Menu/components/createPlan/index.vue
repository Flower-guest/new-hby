<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-03-20 15:37:46
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-08 17:19:03
 * @FilePath: \hby\src\pages\home\components\Menu\createPlan.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- 方案生成弹窗 -->
    <FormDialog
      v-show="formDialog.show"
      height="320px"
      :dialog="formDialog.show ? formDialog[formDialog.type] : {}"
      @handel-btn="handelFormEvent"
    />
    <!-- tool -->
    <div
      v-show="showAITool"
      class="absolute top-136px right-248px z-50 text-[#fff]"
    >
      <div
        class="flex-column-center mb-18px"
        v-for="i in AIToolList"
        :key="i.label"
        @click="toolClick(i.type)"
      >
        <img
          loading="lazy"
          class="w-64px h-64px mb-9px"
          :src="getAssets(i.icon)"
          alt="icon"
        />{{ i.label }}
      </div>
    </div>
    <div class="create-result-dialog" v-show="showCreateImg">
      <img loading="lazy" class="max-w-1580px max-h-880px" :src="resultImg" alt="img"/>
      <div class="flex-center flex-col ml-32px">
        <div
          class="success-btn"
          @click="toolClick(i.type)"
          v-for="i in AICreateSuccessBtn"
          :key="i.label"
        >
          {{ i.label }}
        </div>
      </div>
    </div>
  </div>
  <!-- 读取json -->
  <input
    type="file"
    name="file"
    accept=".json"
    ref="fileInput"
    @change="readUploadedJSON"
    style="display: none"
  />
</template>

<script setup lang="ts">
import { getTexture } from "@/service/api/admin-api";
import {
  postCreateShapes,
  postInner,
  postUpDateOuter,
  // postAIRender
} from "@/service/api/ai-create-plan";
import { ElLoading } from "element-plus";
import { toFormData } from "@/utils/upload";
import { getAssets, generateUUID } from "@/utils";
import AICreatePlan from "@/utils/cesium/AICreatePlan"; //划线等功能类
import { detailFormDialog, AIToolList, AICreateSuccessBtn } from "./const";

const drawUnit = window.cesiumInit.drawUnit,
  mapEvent = window.cesiumInit.mapEvent,
  aiCreatePlan = new AICreatePlan(window.cesiumInit.map3d);
let clickGraphic, //当前点击的图层对象
  resultImg = ""; //AI渲染后的图片

const fileInput = ref<InstanceType<typeof HTMLElement> | any>();

const showAITool = ref<boolean>(false);
const showCreateImg = ref<boolean>(false);
const formDialog = reactive(detailFormDialog);

// AI渲染图片
const AIcreateImg = {
  model: "", //单独建筑生成方案截图，背景为黑
  env: "", //整个场景截图
  frontEnv: "", //生成建筑 转为白色的 场景截图
  layOutMode: 0, //0代表单个建筑 1代表多个建筑
};

onMounted(async () => {
  const texture: any = await getTexture();
  texture.forEach((i) => {
    formDialog.updateBuild.formItem[1].selectOpt?.push({
      label: i.name,
      value: i.texturefile,
    });
  });
});

// 方案生成工具栏点击事件
const toolClick = async (type) => {
  switch (type) {
    case "draw": //方案生成功能点击进行面绘制 结束后弹出表单进行数据录入
      const uuid = generateUUID();
      aiCreatePlan.startDrawPolygon(uuid, async (graphic) => {
        graphicFormat(graphic, "build", uuid);
      });
      break;
    case "upload": //文件上传并读取上传文件json的数据
      fileInput.value.click();
      break;
    case "render": //AI渲染
      AIRender();
      break;
    case "againRender": //重新渲染
      const loading = ElLoading.service({
        lock: true,
        text: "正在渲染中....",
        background: "rgba(0, 0, 0, 0.8)",
      });
      getAIRenderImg(loading);
      break;
    case "cancel": //AI选软成功后的弹窗取消功能
      showCreateImg.value = false;
      break;
    case "down": //下载图片
      const a = document.createElement("a");
      a.href = resultImg;
      a.setAttribute("download", "aiImg.jpeg");
      a.click();
      break;
    default: //清空数据
      clearHandler();
      break;
  }
};

// 上传json文件并读取数据并生成面数据
const readUploadedJSON = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const fileContent = await readFileAsText(file);

  aiCreatePlan.createJsonLayer({
    data: fileContent,
    ck: (event) => graphicFormat(event.graphic, "build", generateUUID()),
  });
};

// 增加一些辅助函数来提高代码复用性和清晰度
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// 表单弹窗事件
const handelFormEvent = async (type: string) => {
  switch (type) {
    case "reset":
      resetForm();
      break;
    case "save":
      formDialog.show = false;
      // 如果弹窗类型为更新建筑
      if (formDialog.type === "updateBuild") {
        if (
          !formDialog.updateBuild.form["newFloors"] &&
          formDialog.updateBuild.form["materialImage"]
        ) {
          //如果没有填高度就不进行更新知识更新贴图
          await aiCreatePlan.updateAndDeletePolygonMaterial(
            clickGraphic.id,
            formDialog.updateBuild.form.materialImage
          );
        } else if (formDialog.updateBuild.form.newFloors) {
          await updateBuild(formDialog.updateBuild.form.materialImage);
        }
      } else {
        // 如果已经生成了建筑，删除已有建筑与白膜
        const arrName = aiCreatePlan.graphicLayer.getGraphicsByAttr(
          clickGraphic.id,
          "name"
        );
        if (arrName.length > 0) {
          arrName.forEach(async (i) => {
            await aiCreatePlan.deleteMaskAndInnerBuilding(i.id);
          });
        }
        //生成建筑
        await handleCreateModel();
      }
      resetForm();
      break;
    case "close":
      formDialog.show = false;
      resetForm();
      break;
  }
};

// 重置表单
const resetForm = () => {
  formDialog.build.form["newFAR"] = 2;
  formDialog.build.form["newDensity"] = 0.1;
  formDialog.build.form["landuse"] = "commercial";
  formDialog.build.form["lotMode"] = 0;
  formDialog.updateBuild.form["newFloors"] = null;
};

// 绘制完成|选择地块后点击后返回的数据处理
const graphicFormat = async (graphic, type, uuid = "") => {
  // 设置表单类型
  formDialog.type = type;

  // 记录点击的图形数据
  clickGraphic = graphic;
  clickGraphic["formatPoint"] = graphic.points.map((point) => [
    point.lng,
    point.lat,
  ]);

  // 同步表单字段值，优先使用图形属性，否则使用默认值
  for (const [key, defaultValue] of Object.entries(formDialog[type].form)) {
    formDialog[type].form[key] = graphic.attr?.[key] ?? defaultValue;
  }

  // 特殊处理'build'类型，计算面积并设置id与parent
  if (type === "build") {
    formDialog.build.form.area = graphic.area.toFixed(2);
    formDialog.build.form.parent = formDialog.build.form.id = uuid;
  }

  // 显示表单对话框
  formDialog.show = true;
};

// 生成模型
const handleCreateModel = async () => {
  try {
    const { result }: any = await postCreateShapes({
      type: "FeatureCollection",
      features: [
        entityToJSON({
          ...formDialog.build.form,
          geometry: [...clickGraphic["formatPoint"]],
        }),
      ],
    });

    formDialog.show = false;

    for (const feature of result.features) {
      const { geometry, properties } = feature;
      const innerData: any = await postInner(geometry.coordinates[0]);
      aiCreatePlan.createOuterMask({
        positions: geometry.coordinates,
        attr: {
          ...result.landproperties[0].properties,
          ...properties,
          geometry: innerData.geometry,
          far: result.landproperties[0].properties.newFAR,
        },
        ck: (event) => graphicFormat(event.graphic, "updateBuild"),
      });
    }
  } catch (error) {
    console.error("Error handling model creation:", error);
  }
};

// 生成建筑后点击 进行材质、高度修改
const updateBuild = async (image) => {
  const graphics = aiCreatePlan.graphicLayer.getGraphicsByAttr(
    clickGraphic.name,
    "name"
  );

  const buildingJSONInfo = graphics.map((graphic) =>
    entityToJSON(graphic.attr)
  );

  const { result } = (await postUpDateOuter({
    landinfo: JSON.stringify({
      ...clickGraphic.attr,
      id: clickGraphic.attr.parent,
    }),
    buildinginfos: JSON.stringify(buildingJSONInfo),
    outerID: clickGraphic.id,
    newFloors: formDialog.updateBuild.form["newFloors"],
    floorHeight: 3,
  })) as any;

  for (const key in result) {
    const { geometry, properties } = result[key];
    const innerData: any = await postInner(geometry.coordinates[0]);

    aiCreatePlan.updatePolygonPosition({
      key,
      image,
      shapes: {
        positions: geometry.coordinates,
        attr: { ...properties, ...innerData },
        ck: (event) => graphicFormat(event.graphic, "updateBuild"),
      },
    });
  }
};

//截图进行AI渲染
const AIRender = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在渲染中....",
    background: "rgba(0, 0, 0, 0.8)",
  });
  const types = ["env", "model", "frontEnv"];
  for (const type of types) {
    switch (type) {
      case "env":
        changeLayer("hide");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const shortMapImg1 = await mapEvent.shortMapImg({
          noSplit: true,
        }); //截图
        AIcreateImg.env = AIcreateImg.frontEnv = (await toFormData(
          shortMapImg1,
          "base64"
        )) as string;
        break;
      case "model":
        aiCreatePlan.switchBaseMaps(2023); //隐藏元素和切换成黑底
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const shortMapImg = await mapEvent.shortMapImg({
          noSplit: true,
        }); //截图
        AIcreateImg.model = (await toFormData(shortMapImg, "base64")) as string;
        changeLayer("show", 21);
        getAIRenderImg(loading);
        break;
    }
  }
};

// 获取AI渲染图片
const getAIRenderImg = async (loading) => {
  resultImg = "";
  console.log(AIcreateImg);
  // AIcreateImg.layOutMode = createPlan.form.lotMode;
  // const res: any = await postAIRender(AIcreateImg);
  // resultImg = "data:image/jpeg;base64," + res.result.result;
  if (!showCreateImg.value) showCreateImg.value = true;
  loading.close();
};

// 改变图层
const changeLayer = (state, baseMapId: number | null = null) => {
  window.cesiumInit.primitiveLoader.changeLayer(state);
  window.cesiumInit.divGraphic.changeLayer(state);
  window.cesiumInit.modelAndImage.changeLayer(state);
  baseMapId && aiCreatePlan.switchBaseMaps(baseMapId);
  drawUnit.changeLayer(state);
};

// 清除
const clearHandler = () => {
  aiCreatePlan.clearBuild();
  drawUnit.drawLayer.clear();
  fileInput.value.value = ""; //清空input里面的值 避免重复文件上传数据不加载问题
};

// 单个建筑Entity 转 json
const entityToJSON = (attr) => {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [attr.geometry],
    },
    properties: attr,
  };
};

defineExpose({
  showAITool,
});
</script>

<style lang="less" scoped>
.create-result-dialog {
  position: absolute;
  z-index: 50;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000000cc;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  .success-btn {
    text-align: center;
    width: 130px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    margin-bottom: 8px;
    background-color: transparent !important;
    color: #fff;
    border: 1px solid #1887aa;
  }
}
</style>
