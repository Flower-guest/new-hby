class Split {
  viewer: any;
  split: any;
  constructor(viewer: any) {
    this.viewer = viewer;
    this.split = null;
  }

  createControl(option) {
    if (this.split) {
      return;
    }
    window.cesiumInit.modelAndImage.delete3DTile();
    this.split = new window.mars3d.control.MapSplit({
      leftLayer: JSON.parse(option.dual_view.left),
      rightLayer: JSON.parse(option.dual_view.right),
    });
    this.viewer.addControl(this.split);

    // 增加2个div文本
    const addHTML = `
    <div style="position: absolute;top: 60px;left: -335px;width: 300px;height: 48px;line-height: 48px;border-radius: 3px;background-color: rgba(0,0,0,.6);font-size: 16px;color: #fff;text-align: center;pointer-events: none;"> 左侧影像：现实模型 </div>
    <div style="position: absolute;top: 60px;left: 45px;width: 300px;height: 48px;line-height: 48px;border-radius: 3px;background-color: rgba(0,0,0,.6);font-size: 16px;color: #fff;text-align: center;pointer-events: none;"> 右侧影像：方案效果 </div>
  `;
    const splitter = window.mars3d.DomUtil.parseDom(addHTML, true);
    this.split.container.appendChild(splitter);
  }

  destroyControl() {
    if (this.split) {
      this.viewer.removeControl(this.split);
      this.split = null;
    }
  }
}

export default Split;
