import { ElLoading } from "element-plus";

const message = useMessage();

class FloodByMaterial {
  viewer: any;
  floodByMaterial: any;
  eventTarget: any;
  constructor() {
    this.viewer = window.cesiumInit.map3d;
    this.eventTarget = new window.mars3d.BaseClass()
    this.floodByMaterial = null;
  }

  create() {
    if (!this.floodByMaterial) {
      // 基于地球材质，可以多个区域
      this.floodByMaterial = new window.mars3d.thing.FloodByMaterial({
        color: "rgba(0, 123, 230, 0.5)" // 淹没颜色
      })
      this.viewer.addThing(this.floodByMaterial)

      this.floodByMaterial.on(window.mars3d.EventType.change, (e) => {
        const height = e.height
        this.eventTarget.fire("heightChange", { height })
      })
    }
  }

  async btnDraw(callback, floodColor) {
    this.create();
    this.clearDraw()

    const graphic = await this.viewer.graphicLayer.startDraw({
      type: "polygon",
      style: {
        color: floodColor || "rgba(0, 123, 230, 0.5)",
        outline: false,
        clampToGround: true
      }
    })
    const positions = graphic.positionsShow
    // 更新最大、最小高度值
    await this.updateHeightRange(graphic, positions, callback)
    this.floodByMaterial.addArea(positions)
  }

  // 求最大、最小高度值
  async updateHeightRange(graphic, positions, callback) {
    const loading = ElLoading.service({
      lock: true,
      text: "正在加载中....",
      background: "rgba(0, 0, 0, 0.5)",
    });
    // 求最大、最小高度值
    graphic.show = false // 会遮挡深度图，所以需要隐藏
    const result = await window.mars3d.PolyUtil.interPolygonByDepth({ scene: this.viewer.scene, positions })

    graphic.show = true // 恢复显示
    const minHeight = Math.ceil(result.minHeight)
    const maxHeight = Math.floor(result.maxHeight) + 2

    callback(minHeight, maxHeight)

    loading.close();
  }

  // 开始分析
  begin(data) {
    if (this.floodByMaterial.length === 0) {
      message.error("请首先绘制分析区域！")
      return
    }
    this.viewer.graphicLayer.clear()

    const minValue = Number(data.minHeight)
    const maxValue = Number(data.maxHeight)
    const speed = Number(data.speed)

    this.floodByMaterial.setOptions({
      minHeight: minValue,
      maxHeight: maxValue,
      speed
    })
    this.floodByMaterial.start()
  }

  // 高度选择
  onChangeHeight(height) {
    this.floodByMaterial.height = height
  }

  // 颜色发生改变
  onChangeColor(color) {
    this.floodByMaterial.color = color
  }

  // 自动播放
  startPlay() {
    if (this.floodByMaterial.isStart) {
      this.floodByMaterial.stop() // 暂停
    } else {
      if (this.floodByMaterial.height >= this.floodByMaterial._maxHeight - 1) {
        this.floodByMaterial.restart() // 重新开始
      } else {
        this.floodByMaterial.start() // 开始或继续
      }
    }
  }

  clearDraw() {
    this.floodByMaterial.clear()
    this.viewer.graphicLayer.clear()
  }

}

export default FloodByMaterial;
