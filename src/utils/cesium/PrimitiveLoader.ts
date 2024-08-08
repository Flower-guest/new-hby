import { simplify } from "@turf/turf";

const comStyleOptions = (option) => {
  return {
    distanceDisplayCondition: option?.di ?? false, //是否按视距显示
    distanceDisplayCondition_far: option?.diFar ?? Number.MAX_VALUE, //最大距离
    distanceDisplayCondition_near: option?.diNear ?? 0, //最小距离
    clampToGround: option?.clamp ?? true,
  };
};
export default class PrimitiveLoader {
  map3d: any;
  loadShp: any; //加载shp
  primitiveLayer: any;
  geoJsonLayer: any; //加载geoJson
  polyline: any; //线对象
  polylinePrimitive: any; //线图层
  polygon: any; //面对象
  polygonPrimitive: any; //面图层
  circle: any;
  circlePrimitive: any;
  manyColor: any;

  constructor(map3d) {
    this.map3d = map3d;
    // geoJson
    this.geoJsonLayer = [];
    this.primitiveLayer = new window.mars3d.layer.GraphicLayer();
    // polyline
    this.polyline = [];
    // polygon
    this.polygon = [];
    // Circle
    this.circle = [];
    this.map3d.addLayer(this.primitiveLayer);
  }
  // 初始化点击事件
  initClick(ck) {
    this.primitiveLayer.on(window.mars3d.EventType.click, function (event) {
      ck(event);
    });
  }

  // mars3d添加GeoJsonLayer
  addGeoJsonLayer(option: any) {
    const graphicLayer = new window.mars3d.layer.GeoJsonLayer({
      id: option?.id || null,
      name: option?.name || null,
      url: option?.url
        ? option.url.includes("http") ? option.url : import.meta.env.VITE_BASE_FILE_URL + option.url
        : null, //geojson文件或服务url地址
      data: option.data, //geojson格式规范数据对象，与url二选一即可。
      format: this.simplifyGeoJSON,
      mask: option.mask || false, // 标识是否绘制区域边界的反选遮罩层
      symbol: option.symbol || null, // 标识是否绘制区域边界的反选遮罩层
      zIndex: option?.zIndex ?? 1,
      flyTo: option?.flyTo ?? false,
    });
    graphicLayer["isForever"] = option?.isForever ?? false;
    this.geoJsonLayer.push(graphicLayer);
    this.map3d.addLayer(graphicLayer);
  }
  // 简化geojson的坐标
  simplifyGeoJSON(geojson) {
    try {
      geojson = simplify(geojson, { tolerance: 0.0001, highQuality: true, mutate: true })
    } catch (e) { }
    return geojson
  }
  // 添加线
  addPolylinePrimitive(option: any) {
    const graphic = new window.mars3d.graphic.PolylinePrimitive({
      positions: option.positions,
      name: option.name,
      style: option.style
        ? {
          ...option.style,
          ...comStyleOptions(option),
          clampToGround: true,
        }
        : {
          width: option?.width ?? 3,
          color: option.color,
          opacity: option?.opc ?? 1,
          ...comStyleOptions(option),
        },
      attr: option?.attr ?? {},
      flyTo: option?.flyTo ?? false,
    });
    this.polyline.push(graphic);
    this.primitiveLayer.addGraphic(graphic);
  }
  // 添加面
  addPolygonPrimitive(option: any) {
    const outline = option.outline || true;
    const graphic = new window.mars3d.graphic.PolygonPrimitive({
      positions: option.positions,
      name: option.name,
      style: option.style
        ? {
          ...option.style,
          ...comStyleOptions(option),
        }
        : {
          outline,
          outlineStyle: outline
            ? {
              color: option?.outCol ?? "#FED976",
              width: option?.outWid ?? 4,
              opacity: option?.outOpc ?? 1,
            }
            : {},
          width: option?.width ?? 3,
          color: option?.color ?? "#409EFF",
          opacity: option?.opc ?? 1,
          ...comStyleOptions(option),
        },
      attr: option?.attr ?? {},
      flyTo: option?.flyTo ?? false,
      flyToOptions: option?.flyToOptions ? option.flyToOptions : {},
    });
    this.polygon.push(graphic);
    this.primitiveLayer.addGraphic(graphic);
  }
  // 删除面、线数据
  deleteFn() {
    // isForever== "true"的代表永存
    if (this.geoJsonLayer.length > 0) {
      this.removeFeatures(this.geoJsonLayer, 'isForever', 'clear');
    }
    if (this.polyline.length > 0) {
      this.removeFeatures(this.polyline, 'attr.isForever');
    }
    if (this.polygon.length > 0) {
      this.removeFeatures(this.polygon, 'attr.isForever');
    }
    if (this.circle.length > 0) {
      this.removeFeatures(this.circle, 'attr.isForever');
    }
  }

  removeFeatures(features, isForeverKey, removalMethod = 'remove') {
    for (let i = features.length - 1; i >= 0; i--) {
      const feature = features[i];
      if (feature?.[isForeverKey]) continue;
      feature[removalMethod]();
      features.splice(i, 1);
      this.map3d.removeLayer(feature, true);
    }
  }
}
