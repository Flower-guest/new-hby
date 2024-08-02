import { useWidGet } from "@/store";

const store = useWidGet();

export default class Draw {
  viewer: any;
  drawLayer: any; //绘制图层
  constructor(viewer) {
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.drawLayer = new window.mars3d.layer.GraphicLayer();
    this.viewer.addLayer(this.drawLayer);
    this.bindLayerContextMenu();
  }


  draw(type, callBack) {
    switch (type) {
      // 绘制线
      case "hzx":
        this.startDrawLine(callBack);
        break;
      // 绘制面
      case "hzm":
        this.startDrawPolygon(callBack);
        break;
    }
  }
  // 开始划线
  startDrawLine(callBack) {
    this.drawLayer.startDraw({
      type: "polyline",
      style: {
        color: "#55ff33",
        width: 3,
        label: {
          font_size: 18,
          color: "#ffffff",
        },
        clampToGround: true,
      },
      success: function () {
        callBack();
      },
    });
  }
  // 开始画面
  startDrawPolygon(callBack) {
    this.drawLayer.startDraw({
      type: "polygon",
      style: {
        color: "#29cf34",
        opacity: 0.5,
        outline: true,
        outlineWidth: 3,
        outlineColor: "#ffffff",
        clampToGround: true,
      },
      success: function (graphic) {
        graphic.setStyle({
          label: {
            text: `面积：${graphic.area.toFixed(2)}`,
            font_size: 14,
            color: "#ffffff",
          },
        });
        callBack(graphic);
      },
    });
  }
  // 删除面或线
  deleteDraw(graphic) {
    const parent = graphic.parent; // 右击是编辑点时
    this.drawLayer.removeGraphic(graphic);
    if (parent) {
      this.drawLayer.removeGraphic(parent);
    }
  }
  // 右键菜单
  bindLayerContextMenu() {
    const that = this;
    that.drawLayer.bindContextMenu([
      {
        text: "开始编辑对象",
        icon: "fa fa-edit",
        show: function (e) {
          const graphic = e.graphic;
          if (!graphic || !graphic.hasEdit) {
            return false;
          }
          return !graphic.isEditing;
        },
        callback: (e) => {
          const graphic = e.graphic;
          if (!graphic) {
            return false;
          }
          if (graphic) {
            store.setCurrentWidget(graphic);
            that.drawLayer.startEditing(graphic);
          }
        },
      },
      {
        text: "停止编辑对象",
        icon: "fa fa-edit",
        show: function (e) {
          const graphic = e.graphic;
          if (!graphic || !graphic.hasEdit) {
            return false;
          }
          return graphic.isEditing;
        },
        callback: (e) => {
          const graphic = e.graphic;
          if (!graphic) {
            return false;
          }
          if (graphic) {
            store.setCurrentWidget("");
            graphic.stopEditing();
          }
        },
      },
      {
        text: "删除对象",
        icon: "fa fa-trash-o",
        show: (event) => {
          const graphic = event.graphic;
          if (!graphic || graphic.isDestroy) {
            return false;
          } else {
            return true;
          }
        },
        callback: (e) => {
          const graphic = e.graphic;
          if (!graphic) {
            return;
          }
          const parent = graphic.parent; // 右击是编辑点时
          that.drawLayer.removeGraphic(graphic);
          if (parent) {
            that.drawLayer.removeGraphic(parent);
          }
          store.setCurrentWidget("");
        },
      },
    ]);
  }

  // 隐藏图层
  changeLayer(type) {
    const graphics = this.drawLayer.getGraphics();
    if (graphics.length > 0) {
      graphics.forEach((i) => {
        i.setOpacity(type == "hide" ? 0 : 1);
      });
    }
  }
}
