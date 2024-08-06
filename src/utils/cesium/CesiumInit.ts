import Measure from "./Measure"; //划线等功能类
import MapEvent from "./MapEvent"; //地图事件类
import PrimitiveLoader from "./PrimitiveLoader"; //添加场景类
import ModelAndImage from "./ModelAndImage";  //模型和影像
import DivGraphic from "./DivGraphic"; //绘制div Billboard
import Split from "./Split"; //分屏比对
import { map3dConfig } from "@/const/mapConfig";
import "@/assets/css/cesiumNavigation.css";
import { getProject } from "@/utils/auth";
import { workerFormat } from "@/hooks/useLoadData";


// 加载cesium的domId
export const CESIUM_ID = "cesiumContainer";

class CesiumInit {
  measure: any; //划线、测量等功能类
  mapEvent: any; //地图事件类
  primitiveLoader: any; //mars3d功能
  modelAndImage: any; //模型和影像
  split:any; // 分屏比对
  map3d: any;
  divGraphic: any;
  initCamera: any; //初始视角
  constructor() {
    this.initMap();
  }
  // 初始化地图
  initMap() {
    this.map3d = new window.mars3d.Map(CESIUM_ID, map3dConfig);
    this.map3d.unbindContextMenu(); //解除绑定的右键菜单
    this.map3d.on(window.mars3d.EventType.renderError, () => {
      window.location.reload();
    });
    this.initDataEvent();
  }
  // 初始化数据和事件
  initDataEvent() {
    // 初始化测量工具
    this.measure = new Measure(this.map3d);
    // 初始化地图事件
    this.mapEvent = new MapEvent(this.map3d);
    // 初始化Primitive数据加载事件
    this.primitiveLoader = new PrimitiveLoader(this.map3d);
    // 初始化模型和影像
    this.modelAndImage = new ModelAndImage(this.map3d);
    // 初始化DIV数据图层
    this.divGraphic = new DivGraphic(this.map3d);
    // 分屏比对
    this.split = new Split(this.map3d);
  }
  // 地球自转
  async loadData() {
    const { init_json, scene_camera, showlt } = getProject();

    // 初始化罗盘点击事件
    this.map3d.controls.compass.on(window.mars3d.EventType.click, () => {
      this.mapEvent.flyToPoint(scene_camera);
    });
    scene_camera && this.mapEvent.flyToPoint(scene_camera);

    if (showlt) {
      const locationBar = new window.mars3d.control.LocationBar({
        template:
          "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>海拔：{alt}米</div> <div>层级：{level}</div><div>方向：{heading}度</div> <div>俯仰角：{pitch}度</div><div>视高：{cameraHeight}米</div>"
      })
      this.map3d.addControl(locationBar)
    }

    workerFormat({ '-1': {jsondata:init_json} }, [-1], true)
  }
}

export default CesiumInit;
