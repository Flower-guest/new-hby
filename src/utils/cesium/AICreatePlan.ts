const FLOOR_HEIGHT = 3; // 楼层高度
const POLYGON_STYLE = { //面公共样式
  color: "#29cf34",
  opacity: 0.5,
  outline: true,
  outlineWidth: 3,
  outlineColor: "#ffffff",
  clampToGround: true,
}

const HIGHLIGHT_STYLE = { //公共高亮样式
  type: "click",
  opacity: 0.2,
  color: "#ff0000",
}

export default class AICreatePlan {
  map3d: any;
  loadShp: any; //加载shp
  geoJsonLayer: any;
  graphicLayer: any; //绘制图层
  floorNum: number;//楼层数
  constructor(map3d) {
    this.map3d = map3d;
    this.floorNum = 0;
    // geoJson
    this.geoJsonLayer = [];
    this.graphicLayer = new window.mars3d.layer.GraphicLayer();
    this.map3d.addLayer(this.graphicLayer);

    this.bindLayerContextMenu();
  }

  // 读取上传文件进行数据加载
  createJsonLayer(option) {
    const geoJson = new window.mars3d.layer.GeoJsonLayer({
      data: option.data, //geojson格式规范数据对象，与url二选一即可。
      symbol: {
        styleOptions: {
          ...POLYGON_STYLE,
          highlight: {
            ...HIGHLIGHT_STYLE,
            outlineStyle: {
              width: 6,
              color: "#FFFF00",
              addHeight: 1,
            },
          },
          label: { text: `面积：{area}` }
        },
      },
      flyTo: true,
      flyToOptions: { duration: 2, scale: 2 },
    });

    this.geoJsonLayer.push(geoJson);
    this.map3d.addLayer(geoJson);

    geoJson.on(window.mars3d.EventType.click, (event) => option.ck(event))
  }

  // 绘制建筑面  用id字段来取对应生成的建筑物遮罩与内部建筑
  startDrawPolygon(id, callBack) {
    this.graphicLayer.startDraw({
      type: "polygon",
      id,
      style: POLYGON_STYLE,
      success: function (graphic) {
        graphic.setStyle({
          label: { text: `面积：${graphic.area.toFixed(2)}` },
        });
        // 给绘制的面添加点击事件
        graphic.on(window.mars3d.EventType.click, () => callBack(graphic))
        // 执行回调函数进行弹窗事件触发
        callBack(graphic);
      },
    });
  }

  // 创建外层白膜建筑 用parent来取对应的遮罩name属性  用id字段来取对应生成的遮罩和name属性为id值的内部建筑物
  createOuterMask(option: any) {
    this.floorNum = Math.floor(option.attr.height / FLOOR_HEIGHT);
    const graphic = new window.mars3d.graphic.PolygonPrimitive({
      positions: option.positions,
      id: option.attr.id,
      name: option.attr.parent,
      style: {
        color: "#fff",
        opacity: 0.05,
        height: option.attr.base,
        diffHeight: option.attr.height,
        highlight: HIGHLIGHT_STYLE,
      },
      attr: option?.attr,
    });
    this.graphicLayer.addGraphic(graphic);

    // 添加点击事件
    graphic.on(window.mars3d.EventType.click, (event) => option.ck(event));

    // 生成内部建筑
    for (let i = 1; i < this.floorNum + 1; i++) {
      this.createInnerBuilding(option.attr, i);
    }
  }

  // 创建内部建筑根据楼高进行分层
  createInnerBuilding(attr: any, i: number) {
    const graphic = new window.mars3d.graphic.PolygonPrimitive({
      positions: attr.geometry,
      name: attr.id,
      style: {
        color: "#fff",
        opacity: 1,
        outline: true,
        outlineStyle: { width: 3, color: "#000" },
        height: attr.base,
        diffHeight: i * FLOOR_HEIGHT,
      },
    });
    this.graphicLayer.addGraphic(graphic);
  }

  /**
   * @description: 更新建筑纹理贴图 或者删除指定name的建筑模型
   * @param {*} name 检索graphicLayer的名称
   * @param {*} image 纹理贴图地址
   * @param {*} action 事件类型
   */
  updateAndDeletePolygonMaterial(name, image, action = "update") {
    const polygonArr = this.graphicLayer.getGraphicsByAttr(name, 'name');
    for (const polygon of polygonArr) {
      if (action === "delete") {
        this.graphicLayer.removeGraphic(polygon);
      } else {
        polygon.setStyle({
          materialType: "Image",
          materialOptions: {
            // image: getImgUrl(image),
            repeat_x: 1000,
            repeat_y: 1,
          },
        });
      }
    }
  }

  /**
   * @description: 更新建筑位置
   * @param {*} key postUpDateOuter接口返回的对象键值对--也就是inner建筑对应的name值
   * @param {*} image 纹理贴图地址
   * @param {*} shapes 建筑外层白膜需要的参数
   */
  async updatePolygonPosition(option: any) {
    // 获取建筑面纹理贴图地址
    const imageUrl = option?.image ?? this.graphicLayer.getGraphicsByAttr(option.key, 'name')[0]?.options.style?.materialOptions?.image;
    // 删除内外层建筑对象
    await this.deleteMaskAndInnerBuilding(option.key);
    // 创建新的白膜建筑与层高建筑
    await this.createOuterMask(option.shapes);
    // 恢复之前的贴图材质
    if (imageUrl) {
      await this.updateAndDeletePolygonMaterial(option.key, imageUrl);
    }
  }

  // 删除建筑白膜与内层建筑
  async deleteMaskAndInnerBuilding(graphicId) {
    const graphicById = this.graphicLayer.getGraphicById(graphicId); // 获取外层白膜建筑对象
    // 不删除绘制的面
    this.graphicLayer.removeGraphic(graphicById);
    await this.updateAndDeletePolygonMaterial(graphicId, "", "delete");
  }

  // 切换地图
  switchBaseMaps(id) {
    const baseMaps = this.map3d.getBasemaps();
    baseMaps.forEach(i => {
      i.show = i.id === id ? true : false;
      if (i.show) this.map3d.basemap = i.id;
    })
  }

  // 清除
  clearBuild() {
    if (this.geoJsonLayer.length > 0) {
      this.geoJsonLayer.forEach((i) => {
        i.remove();
      });
      this.geoJsonLayer = [];
    }
    this.graphicLayer.clear();
  }

  // 右键菜单
  bindLayerContextMenu() {
    this.graphicLayer.bindContextMenu([
      {
        text: "删除对象",
        show: (event) => event.graphic || !event.graphic.isDestroy,
        callback: (e) => this.deleteMaskAndInnerBuilding(e.graphic.id),
      },
    ]);
  }
}
