// 加载3dtitles配置
const dTilesOption = {
  cullWithChildrenBounds: false,
  cacheBytes: 1073741824, // 1024MB = 1024*1024*1024 【重要】额定显存大小(以字节为单位)，允许在这个值上下波动。
  maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024 【重要】最大显存大小(以字节为单位)。
  skipLevelOfDetail: true, //是Cesium在1.5x 引入的一个优化参数，这个参数在金字塔数据加载中，可以跳过一些级别，这样整体的效率会高一些，数据占用也会小一些。但是带来的异常是：1） 加载过程中闪烁，看起来像是透过去了，数据载入完成后正常。2，有些异常的面片，这个还是因为两级LOD之间数据差异较大，导致的。当这个参数设置false，两级之间的变化更平滑，不会跳跃穿透，但是清晰的数据需要更长，而且还有个致命问题，一旦某一个tile数据无法请求到或者失败，导致一直不清晰。所以我们建议：对于网络条件好，并且数据总量较小的情况下，可以设置false，提升数据显示质量。
  cullRequestsWhileMoving: true,
  cullRequestsWhileMovingMultiplier: 10, //【重要】 值越小能够更快的剔除
  preferLeaves: true, //【重要】这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
  progressiveResolutionHeightFraction: 0.5, //【重要】 数值偏于0能够让初始加载变得模糊
  dynamicScreenSpaceError: true, // true时会在真正的全屏加载完之后才清晰化模型
  preloadWhenHidden: true, //tileset.show是false时，也去预加载数据
};

export default class ModelAndImage {
  map3d: any;
  tiles3dLayer: any; //加载3dTiles
  xyzLayer: any; //添加影像图层

  constructor(map3d) {
    this.map3d = map3d;
  }

  // 添加影像图层
  addXyzLayer(options: any) {
    const params: any = {
      type: options.type || "xyz", // 类型
      url: options.url,
      layer: options.layer, // 图层名
      crs: options.crs || "EPSG:4326", // 坐标系信息
      chinaCRS: options.chinaCRS || "WGS84", // 国内坐标系
      minimumLevel: options.minLevel || 0, // 最低层级
      maximumLevel: options.maxLevel || 21, // 最高层级
      minimumTerrainLevel: options.minTer || 0, // 展示影像图层的最小地形细节级别
      maximumTerrainLevel: options.maxTer || 21, // 展示影像图层的最大地形细节级别
      brightness: options.bri || 1, // 亮度
      opacity: options.opa || 1, // 透明度
    };
    this.xyzLayer = new window.mars3d.layer.XyzLayer(params);
    this.map3d.addLayer(this.xyzLayer);
  }

  // 模型菜单点击事件
  clickMXMenu(val) {
    // 判断是否加载了模型
    if (this.tiles3dLayer && this.tiles3dLayer.name === val.name) {
      // 判断是否已经记载过改模型，加载过就不需要重复加载了，没加载过就进行加载
      this.tiles3dLayer.show = !this.tiles3dLayer.show;
    } else {
      this.addCesium3DTileSet(val);
    }
  }
  // 添加3DTile模型
  addCesium3DTileSet(obj) {
    this.delete3DTile();
    this.tiles3dLayer = new window.mars3d.layer.TilesetLayer({
      name: obj.name,
      url: obj.url,
      position: obj?.Pos
        ? {
          lng: obj.Pos.lng,
          lat: obj.Pos.lat,
          alt: obj.alt,
          alt_offset: obj.Pos.alt_offset,
        }
        : { alt: obj?.alt ?? 100 },
      maximumScreenSpaceError: obj?.max ?? 1,
      scale: obj?.Pos ? obj.Pos.sca : 1,
      ...dTilesOption,
      enableDebugWireframe: false, // 是否可以进行三角网的切换显示
      flyTo: obj?.flyTo ?? false,
    });
    this.map3d.addLayer(this.tiles3dLayer);
  }
  // 删除模型
  delete3DTile() {
    if (this.tiles3dLayer) {
      this.map3d.removeLayer(this.tiles3dLayer, true);
      this.tiles3dLayer = null;
    }
  }
  // 隐藏图层
  changeLayer(type) {
    this.xyzLayer.setOpacity(type == "hide" ? 0 : 1);
  }
}
