import * as mars3d from "mars3d";
import * as Cesium from "mars3d-cesium";


//mars3d配资
export const map3dConfig: any = {
  scene: {
    center: { lat: 38.602075, lng: 160, alt: 37036414 },
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
    clock: { multiplier: 200 },
    shadows: false,
    removeDblClick: true,
    sceneMode: 3,
    showSun: true,
    showMoon: true,
    showSkyBox: true,
    showSkyAtmosphere: true,
    fog: true,
    fxaa: true,
    requestRenderMode: true, // 显式渲染
    globe: {
      depthTestAgainstTerrain: false,
      baseColor: "#546a53",
      showGroundAtmosphere: true,
      enableLighting: false,
    },
    cameraController: {
      zoomFactor: 3,
      minimumZoomDistance: 1,
      maximumZoomDistance: 5e7,
      enableRotate: true,
      enableTranslate: true,
      enableTilt: true,
      enableZoom: true,
      enableCollisionDetection: true,
    },
  },
  control: {
    baseLayerPicker: true,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    mouseDownView: false,
    terrainProviderViewModels: getTerrainProviderViewModelsArr(),
    compass: {
      bottom: "50px",
      right: "15px",
      innerSvg:
        '<svg t="1701226455497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7254" width="24" height="24"><path d="M982.028557 404.405174 573.32303 83.942886c-34.918864-27.694272-89.619352-27.694272-124.538216 0L43.175542 404.577188c-13.933143 11.008903-16.169326 31.134554-5.332437 44.895683s31.134554 16.169326 44.895683 5.332437l13.073072-10.320847 0 387.547791c0 54.872501 56.936671 95.983874 107.852847 95.983874l639.892491 0c50.22812 0 84.1149-38.531161 84.1149-95.983874L927.672098 443.452377l14.449185 11.352931c5.84848 4.644381 12.729044 6.880564 19.781623 6.880564 9.460776 0 18.921552-4.128339 25.286074-12.213002C998.369898 435.539728 995.789686 415.414077 982.028557 404.405174zM607.897867 797.113388l0 66.741475-63.989249 0-63.989249 0-63.989249 0 0-66.741475 0-112.325214c0-37.155048 30.102469-77.234336 95.983874-77.234336 66.053418 0 95.983874 40.079288 95.983874 77.234336L607.897867 797.113388 607.897867 797.113388z" fill="#1296DB" p-id="7255"></path></svg>',
    },
  },
  basemaps: [
    {
      id: 10,
      name: "地图底图",
      type: "group",
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      pid: -1,
      opacity: 1,
      zIndex: 0,
    },
    {
      id: 21,
      name: "ArcGIS影像",
      icon: "https://vill.fantere.com/img/esriWorldImagery.png",
      type: "arcgis",
      layer: "img_d",
      enablePickFeatures: false,
      show: true,
    },
    {
      id: 2021,
      pid: 10,
      name: "谷歌影像",
      icon: "https://vill.fantere.com/img/google_img.png",
      type: "google",
      layer: "img_d",
      show: false,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 1,
    },
    {
      id: 1,
      name: "天地图影像",
      icon: "https://vill.fantere.com/img/tdt_img.png",
      type: "tdt",
      layer: "img_d",
      show: false,
    },
    {
      pid: 10,
      name: "百度电子",
      icon: "https://demo.fantere.com/img/bd-vec.png",
      type: "baidu",
      layer: "vec",
      id: 15,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 15,
    },
    {
      id: 2017,
      pid: 10,
      name: "暗色底图",
      type: "gaode",
      icon: "https://demo.fantere.com/img/blackMarble.png",
      layer: "vec",
      invertColor: true,
      filterColor: "#4e70a6",
      brightness: 0.6,
      contrast: 1.8,
      gamma: 0.3,
      hue: 1,
      saturation: 0,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 22,
    },
    {
      pid: 10,
      name: "蓝色底图",
      icon: "https://demo.fantere.com/img/bd-c-midnight.png",
      type: "xyz",
      url: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      chinaCRS: "GCJ02",
      enablePickFeatures: false,
      id: 23,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 23,
    },
    {
      pid: 10,
      name: "黑色底图",
      icon: "https://demo.fantere.com/img/bd-c-dark.png",
      type: "tencent",
      layer: "custom",
      style: "4",
      id: 24,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 24,
    },
    {
      id: 2023,
      pid: 10,
      name: "无底图",
      type: "grid",
      color: "#000",
      backgroundColor: "rgba(0,0,0,1)",
      opacity: 0.9,
      zIndex: 30,
      show: false,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
    },
  ],
  layers: [
    {
      layer: "ibo",
      mapSplit: false,
      name: "行政区划界线",
      show: true,
      type: "tdt",
      zIndex: 2,
    },
    {
      layer: "img_z",
      name: "天地图影像注记",
      show: true,
      type: "tdt",
      key: mars3d.Token.tiandituArr,
      zIndex: 2,
    }
  ],
};

// 地形配置
function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "无地形",
      tooltip: "WGS84标准球体",
      iconUrl: "https://demo.fantere.com/img/TerrainEllipsoid.png",
      creationFunction: function () {
        return mars3d.LayerUtil.getNoTerrainProvider();
      },
    }),
    new Cesium.ProviderViewModel({
      name: "中国地形",
      tooltip: "中国国内地形",
      iconUrl: "https://demo.fantere.com/img/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          url: "https://data.mars3d.cn/terrain",
          type: ""
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "全球地形",
      tooltip: "由 Cesium官方 提供的高分辨率全球地形",
      iconUrl: "https://demo.fantere.com/img/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "ion",
          requestWaterMask: true,
          requestVertexNormals: true,
          url: ""
        })
      }
    }),
  ];
}
