import { ElLoading } from "element-plus";
import { getServeImg } from "@/utils";
import "@/assets/css/divGraphic.less";
export default class DivAndBillboard {
  map3d: any;
  graphicDivLayer: any; //marker图层
  loading: any;
  clusterLayer: any; //聚合图层
  ck: any;

  constructor(map3d) {
    this.map3d = map3d;
    this.initLayer();
  }
  initLayer() {
    this.graphicDivLayer = new window.mars3d.layer.GraphicLayer();
    this.map3d.addLayer(this.graphicDivLayer);
    this.clusterLayer = null;
  }
  // 添加点位点击事件
  initClick(ck) {
    this.ck = (event) => ck(event); //将回调函数保存避免聚合删掉后不执行事件了
    this.graphicDivLayer.on(window.mars3d.EventType.click, function (event) {
      ck(event);
    });
  }
  // 气泡Div标签
  bubbleFlag(option) {
    const graphic = new window.mars3d.graphic.DivGraphic({
      position: option.position,
      style: {
        html: `
          <div class="bubble-flag" ${option.img ? 'style="padding-left:2px"' : ''}>
            <div class="bubble-box">
              <img ${option.img ? "" : 'class="hidden"'} src="${getServeImg(option.img)}" />
              <span ${option.img ? "" : 'class="mt-4px ml-12px"'}>${option.text}</span>
            </div>
          </div>`,
        ...this.comData(option, option?.img)
      },
      name: option.name,
      attr: option?.attr ?? null,
    });
    this.graphicDivLayer.addGraphic(graphic);
  }
  // 三角标标签
  triangleFlag(option) {
    const graphic = new window.mars3d.graphic.DivGraphic({
      position: option.position,
      style: {
        html: `
        <div class="triangle-flag">
          <div class="triangle-box">${option.text}</div>
        </div>`,
        ...this.comData(option, option?.img)
      },
      name: option.name,
      attr: option?.attr ?? null,
    });
    this.graphicDivLayer.addGraphic(graphic);
  }
  // 图片点位
  customIcon(option) {
    const imgUrl = getServeImg(option.img);
    const qjUrl = new URL(`../../assets/img/icon-qjdw.png`, import.meta.url).href;
    const graphic = new window.mars3d.graphic.DivGraphic({
      position: option.position,
      name: option.name,
      style: {
        html: `
        <div class="custom-icon">
          <div class="label">${option.text}</div>
          <div class="custom-box">
            <div class="icon">
              <img loading="lazy" src="${imgUrl}" alt="花博园图标" />
            </div>
            <img loading="lazy" ${option.attr.vrLink ? 'class="qj-icon"' : 'class="hidden"'}  src="${qjUrl}" alt="花博园图标" />
          </div>
        </div>`,
        horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
        clampToGround: true,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, option?.diFar ?? 50000), // 按视距距离显示
      },
      attr: option?.attr ?? null,
    });
    this.graphicDivLayer.addGraphic(graphic);
  }
  //添加聚合点
  addClusterLayer(id) {
    console.log(id);
    if (!this.clusterLayer) {
      this.clusterLayer = new window.mars3d.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 5,
        },
        id,
        name:id
      });
      this.map3d.addLayer(this.clusterLayer);
      this.clusterLayer.on(window.mars3d.EventType.click, (event) => {
        if (event.graphic?.attr) {
          this.ck(event);
        } else {
          const p = window.mars3d.LngLatPoint.fromCartesian(event.cartesian);
          this.map3d.flyToPoint([p.lng, p.lat], {
            radius: p.alt + 150,
            duration: 2,
          });
        }
      });
    }
  }
  //添加基本点位
  addBillboard(option) {
    this.addClusterLayer(option.name);
    const graphic = new window.mars3d.graphic.BillboardPrimitive({
      position: option.position,
      attr: option?.attr ?? null,
      name: option.name,
      style: {
        image: getServeImg(option.img),
        width: 47,
        height: 52,
        horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, option?.diFar ?? 50000),
        visibleDepth: option.isCluster, //是否被遮挡
        clampToGround: !option.isCluster,
        label: option?.text ? this.addLabel(option) : {},
      },
    });
    // 判断是否需要点聚合
    if (option.isCluster) {
      this.clusterLayer.addGraphic(graphic);
    } else {
      this.graphicDivLayer.addGraphic(graphic);
    }
  }
  //添加文本元素
  addLabel(option: any) {
    return {
      text: option?.text, // 对应的属性名称
      font_size: 16,
      font_family: "微软雅黑",
      font_weight: "bold",
      color: "#CCF7FF",
      outline: true,
      outlineStyle: {
        color: "#62B6C4",
        width: 2,
      },
      pixelOffsetY: -60,
      background: true,
      backgroundColor: "#041822",
      backgroundOpacity: 0.7,
      backgroundPadding: new window.Cesium.Cartesian2(16, 4),
      distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, option?.diFar ?? 50000),
      clampToGround: true, //是否贴地
      visibleDepth: false, //是否被遮挡
    };
  }
  comData(option, imgUrl) {
    return {
      offsetX: this.countOffsetX(option.text, imgUrl),
      offsetY: -4,
      distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, option?.diFar ?? 50000), // 按视距距离显示
      clampToGround: true,
    }
  }
  // 根据字体长度微调偏移量，使偏移不明显
  countOffsetX(text, imgUrl) {
    if (text.length < 4) {
      return imgUrl ? -45 : -30;
    } else if (text.length > 3 && text.length < 7) {
      return imgUrl ? -61 : -46;
    } else if (text.length > 6 && text.length < 10) {
      return imgUrl ? -90 : -75;
    } else if (text.length > 9 && text.length < 12) {
      return imgUrl ? -91 : -76;
    } else {
      return imgUrl ? -121 : -106;
    }
  }
  // 删除点位
  deleteDivGraphic() {
    this.loading = ElLoading.service({
      lock: true,
      text: "正在加载中....",
      background: "rgba(0, 0, 0, 0.5)",
    });
    // 删除div点数据
    if (this.graphicDivLayer.graphics.length > 0) {
      this.graphicDivLayer.graphics.forEach((i) => {
        // 当isForever（永久显示）字段为true时或者type等于当前显示的页面类型 不进行点位处理
        if (i?.attr?.isForever) return;
        this.graphicDivLayer.removeGraphic(i);
      });
    }
    // 删除点聚合数据
    this.deleteClusterGraphic();
    setTimeout(() => {
      this.loading?.close();
    }, 0);
  }
  // 删除指定图层
  removeLayer(attrValue) {
    const nameLayerArr = this.graphicDivLayer.getGraphicsByAttr(attrValue, 'name');
    if (nameLayerArr.length > 0) {
      nameLayerArr.map(layer => {
        // 如果isForever为true则不删除
        !layer.isForever && this.graphicDivLayer.removeGraphic(layer)
      });
    }
  }

  deleteClusterGraphic() {
    if (this.clusterLayer) {
      this.clusterLayer.remove();
      this.clusterLayer = null;
    }
  }
}
