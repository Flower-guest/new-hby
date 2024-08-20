import Measure from "./Measure"; //划线等功能类
import MapEvent from "./MapEvent"; //地图事件类
import PrimitiveLoader from "./PrimitiveLoader"; //添加场景类
import ModelAndImage from "./ModelAndImage";  //模型和影像
import DivAndBillboard from "./DivAndBillboard"; //绘制div Billboard
import Split from "./Split"; //分屏比对
import { map3dConfig } from "@/const/mapConfig";
import { getProject } from "@/utils/auth";
import { workerFormat } from "@/hooks/useLoadData";
import "@/assets/css/cesiumNavigation.css";

// 加载cesium的domId
export const CESIUM_ID = "cesiumContainer";

class CesiumInit {
  measure: any; //划线、测量等功能类
  mapEvent: any; //地图事件类
  primitiveLoader: any; //mars3d功能
  modelAndImage: any; //模型和影像
  split: any; // 分屏比对
  map3d: any;
  divGraphic: any;
  clusterLayer: any;
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
    this.divGraphic = new DivAndBillboard(this.map3d);
    // 分屏比对
    this.split = new Split(this.map3d);
  }
  // 地球自转
  async loadData() {
    const { init_json, scene_camera, showlt, terrain, orthophoto } = getProject();

    this.map3d.scene.screenSpaceCameraController.minimumZoomDistance = 50;
    // this.map3d.scene.globe.depthTestAgainstTerrain = true;

    // 初始化罗盘点击事件
    this.map3d.controls.compass.on(window.mars3d.EventType.click, () => {
      this.mapEvent.flyToPoint(scene_camera);
    });

    if (terrain) {
      this.map3d.terrainProvider = window.mars3d.LayerUtil.createTerrainProvider({
        url: "https://data.mars3d.cn/terrain"
      })
    }

    if (showlt) {
      const locationBar = new window.mars3d.control.LocationBar({
        template:
          "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div class='hide1000'>横{crsx}  纵{crsy}</div> <div>海拔：{alt}米</div> <div class='hide700'>层级：{level}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div><div class='hide700'>视高：{cameraHeight}米</div><div class='hide700'>帧率：{fps} FPS</div>"
      })
      this.map3d.addControl(locationBar)
    }

    await workerFormat({
      type: 'loadMenuData',
      data: { '-1': { jsondata: init_json } },
      checkMenuArr: [-1],
      isForever: true
    });

    if (orthophoto) {
      const orthoPhoto = orthophoto.split(",");
      orthoPhoto.forEach((url) => {
        this.modelAndImage.addXyzLayer({ url });
      });
    }

    if (scene_camera) {
      await this.mapEvent.flyToPoint({ lng: scene_camera.lng, lat: scene_camera.lat, alt: 50000, duration: 5 });
      await new Promise(resolve => setTimeout(resolve, 6000)); // 等待7秒后再次飞越
      this.mapEvent.flyToPoint(scene_camera);
    }
  }
}

export default CesiumInit;
