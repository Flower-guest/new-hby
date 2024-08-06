class Shadows {
  viewer: any;
  shadows: any;
  eventTarget: any;
  constructor() {
    this.viewer = window.cesiumInit.map3d;
    this.eventTarget = new window.mars3d.BaseClass()
  }

  startShadows() {
    this.shadows = new window.mars3d.thing.Shadows({
      darkness: 0.4, // 阴影透明度, 0-1，值越大越透明
      multiplier: 1600
    } as any);
    this.viewer.addThing(this.shadows);

    this.shadows.on(window.mars3d.EventType.change, () => {
      const shadowTime = this.shadows.time
      this.eventTarget.fire("changeShadows", { shadowTime })
    })
  }

  deleteShadows() {
    this.viewer.removeThing(this.shadows)
  }

  /**
 * 开始播放
 *
 * @export
 * @param {*} date 年月日
 * @param {number} hours 小时
 * @param {number} minutes 分钟
 */
  startPlay(date, hours, minutes) {
    const currentTime = this.setShadows(date, hours, minutes)
    const startDate = new Date(date + " 00:00:00")
    const endDate = new Date(date + " 23:59:59")

    this.shadows.multiplier = 1600
    this.shadows.start(startDate, endDate, currentTime)
  }

  stopPlay() {
    if (this.shadows && this.shadows.isStart) {
      this.shadows.pause()
    }
  }

  setShadows(date, hours, minutes) {
    const dateTime = new Date(`${date} ${hours}:${minutes}:00`)
    this.shadows.time = dateTime

    return dateTime
  }

}

export default Shadows;
