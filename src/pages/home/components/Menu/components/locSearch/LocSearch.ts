export default class LocSearch {
  map3d: any;
  billboard: any; //marker图层

  constructor() {
    this.map3d = window.cesiumInit.map3d;
    this.billboard = new window.mars3d.layer.GraphicLayer();
    this.map3d.addLayer(this.billboard);
  }
  // 位置搜索时加载的点位信息
  addDemoGraphics(option) {
    const imgUrl = new URL(`@/assets/img/default_marker.png`, import.meta.url)
      .href;
    const graphic = new window.mars3d.graphic.BillboardEntity({
      position: option.position,
      style: {
        image: imgUrl,
        width: 36,
        height: 44,
        scaleByDistance: new window.Cesium.NearFarScalar(1000, 1, 20000, 0.5),
        clampToGround: true, // 贴地
        visibleDepth: false, //是否被遮挡
        label: {
          text: option.text,
          font: "20px 楷体",
          color: window.Cesium.Color.AZURE,
          outline: true,
          outlineColor: window.Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -30), // 偏移量
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(
            0.0,
            200000
          ),
          clampToGround: true, // 贴地
        },
      },
      flyTo: true,
      flyToOptions: { radius: 500 },
    });
    this.billboard.addGraphic(graphic);
  }
  // 删除位置搜索所产生的点位
  deleteSpecifyDiv(id) {
    this.billboard.graphics.forEach((i) => {
      if (i?.attr?.id == id) i.remove();
    });
  }
}
