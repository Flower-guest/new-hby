export default class MeasureUnit {
  viewer: any;
  measure: any;
  loading: any;
  constructor(viewer) {
    this.viewer = viewer;
    this.init();
  }
  init() {
    this.measure = new window.mars3d.thing.Measure({
      label: {
        color: "#ffffff",
        font_family: "楷体",
        font_size: 20,
        background: false,
      },
      enabled: false,
    });
    this.viewer.addThing(this.measure);
    this.bindMapDemo();
  }
  // 添加点位点击事件
  initClick(ck) {
    const that = this;
    this.measure.on(window.mars3d.EventType.drawCreated, function (event) {
      ck(event.graphic.points);
      that.measure.stopDraw();
    });
  }
  // 水平面积
  measureArea() {
    this.measure.area();
  }
  // 贴地面积
  measureSurfaceeArea() {
    this.measure.areaSurface({
      style: {
        color: "#ffff00",
      },
      splitNum: 10, // step插值分割的个数
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    });
  }
  // 三角测量
  measureTriangleHeight() {
    this.measure.heightTriangle();
  }
  // 水平量距
  measureLength() {
    this.measure.distance({
      showAddText: true,
      exact: false,
    });
  }
  // 地表量距
  measureSurfaceLength() {
    this.measure.distanceSurface({
      showAddText: true,
      exact: false, // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
    });
  }
  // 高度量距
  measureHeight() {
    this.measure.height();
  }
  removeAll() {
    this.measure.clear();
  }
  measureStart(type, callBack) {
    switch (type) {
      // 直线量距三角测量
      case 'triangulation':
        this.measureTriangleHeight();
        break;
      // 水平面积
      case 'area':
        this.measureArea();
        break;
      // 地表面积
      case 'surface':
        this.measureSurfaceeArea();
        break;
      // 水平量距
      case 'horizontal':
        this.measureLength();
        break;
      // 地表量距
      case 'distance':
        this.measureSurfaceLength();
        break;
      // 高度量距
      case 'height':
        this.measureHeight();
        break;
      case 'clear':
        this.removeAll();
        callBack();
        break;
    }
    this.initClick(callBack);
  }
  bindMapDemo() {
    const that = this;
    const mapContextmenuItems = [
      {
        text: "空间测量",
        // 也支持直接的svg代码
        children: [
          {
            text: "高度量距",
            callback: () => that.measureHeight(),
          },
          {
            text: "地表量距",
            callback: () => that.measureSurfaceLength(), // 也支持“方法名称”方式(如config.json中配置时)
          },
          {
            text: "水平量距",
            callback: () => that.measureLength(),
          },
          {
            text: "三角测量",
            callback: () => that.measureTriangleHeight(),
          },
          {
            text: "地表面积",
            callback: () => that.measureSurfaceeArea(),
          },
          {
            text: "水平面积",
            callback: () => that.measureArea(),
          },
          {
            text: "清空",
            callback: () => that.removeAll(),
          },
        ],
      },
    ];
    this.viewer.bindContextMenu(mapContextmenuItems);
  }
}
