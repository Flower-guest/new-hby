/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-15 16:36:02
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-08-02 18:23:37
 * @FilePath: \new-hby\src\utils\cesium\CesiumInit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Measure from "./Measure"; //划线等功能类
import MapEvent from "./MapEvent"; //地图事件类
import PrimitiveLoader from "./PrimitiveLoader"; //添加场景类
import ModelAndImage from "./ModelAndImage";  //模型和影像
import DivGraphic from "./DivGraphic"; //绘制div Billboard
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
  map3d: any;
  divGraphic: any;
  initCamera: any; //初始视角
  constructor() {
    this.initMap();
    this.initDataEvent();
  }
  // 初始化地图
  initMap() {
    this.map3d = new window.mars3d.Map(CESIUM_ID, map3dConfig);
    this.map3d.unbindContextMenu(); //解除绑定的右键菜单
    this.map3d.on(window.mars3d.EventType.renderError, () => {
      window.location.reload();
    });
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
        fps: true,
        template:
          "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>海拔：{alt}米</div> <div>层级：{level}</div><div>方向：{heading}度</div> <div>俯仰角：{pitch}度</div><div>视高：{cameraHeight}米</div>"
      })
      this.map3d.addControl(locationBar)
    }

    workerFormat({ '-1': init_json }, [-1], true)
  }
}

export default CesiumInit;
