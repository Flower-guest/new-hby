import { comDroneLineStyle } from "@/const/util";

export default class DronePatrolDraw {
  viewer: any;
  drawDroneLayer: any;//无人机绘制图层
  divSum: number;

  constructor(viewer) {
    this.viewer = viewer;
    this.divSum = 1;
    this.init();
  }

  init() {
    this.drawDroneLayer = new window.mars3d.layer.GraphicLayer();
    this.viewer.addLayer(this.drawDroneLayer);

    // 绘制完成后触发事件
    this.drawDroneLayer.on(window.mars3d.EventType.drawAddPoint, (e) => {
      const position = window.mars3d.LngLatPoint.fromCartesian(e.cartesian);
      this.addDivPoint({
        position: [position.lng, position.lat],
        text: this.divSum,
        name: e.graphic.id
      })
      this.divSum = this.divSum + 1;
    })

    // 删除最后一个点触发事件
    this.drawDroneLayer.on(window.mars3d.EventType.drawRemovePoint, (e) => {
      const deleteGraphicArr = this.drawDroneLayer.getGraphicsByAttr(e.graphic.id, "name");
      deleteGraphicArr[deleteGraphicArr.length - 1].remove();
      this.divSum = deleteGraphicArr.length;
    })

    this.drawDroneLayer.on(window.mars3d.EventType.drawCreated, () => {
      this.divSum = 1;
    })
  }

  // 绘制无人机航线
  starDrawDroneLine(callBack) {
    this.drawDroneLayer.startDraw({
      type: "polyline",
      style: comDroneLineStyle,
      success: (graphic) => {
        callBack(graphic.points);
      },
    })
  }

  // 生成对应点
  addDivPoint(option) {
    const graphic = new window.mars3d.graphic.DivGraphic({
      position: option.position,
      name: option.name,
      style: {
        html: ` <div class="marsNoVRDiv">
      <div class="label">${option.text}</div>
          </div></div>`,
        horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
        clampToGround: true,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(
          0,
          option?.diFar ?? Number.MAX_VALUE
        ), // 按视距距离显示
      },
    });
    this.drawDroneLayer.addGraphic(graphic);
  }

  // 清除无人机航线
  clearDroneLine() {
    if (this.drawDroneLayer.graphics.length > 0) {
      this.drawDroneLayer.graphics.forEach((i) => {
        i.remove();
      });
    }
  }
}
