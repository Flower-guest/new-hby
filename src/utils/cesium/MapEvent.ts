import { ElMessage } from "element-plus";
import { GAODE_POI_KEY } from "@/const/util";

class MapEvent {
  viewer: any;
  queryGaodePOI: any;
  constructor(viewer) {
    this.viewer = viewer;
    this.queryGaodePOI = new window.mars3d.query.GaodePOI({
      key: [GAODE_POI_KEY],
    });
  }
  // 飞到指定点位
  flyToPoint(option) {
    option?.lng && this.viewer.flyToPoint([option.lng, option.lat], {
      ...option,
      radius: option.alt, // 距离目标点的距离
      lock: option?.lock ?? true, //是否是trackedEntity锁定视角状态
    });
  }
  searchGaodePOI(val, ck) {
    const lastQueryOptions = {
      count: 10, // count 每页数量
      text: val,
      success: function (res) {
        const data = res.list;
        ck && ck(data);
      },
      error: function (msg) {
        ElMessage.error(msg);
      },
    };
    this.queryGaodePOI.query(lastQueryOptions);
  }
  // 截图
  shortMapImg(options: any = {}) {
    return this.viewer
      .expImage({ download: false, type: "image/png", ...options })
      .then((result) => {
        return options?.noSplit ? result.image : result.image.split(",")[1];
      });
  }
  //
  changePitch(pitch, heading) {
    this.viewer.setPitch(pitch, { heading, duration: 0.2 });
  }
  //获取指定图层并进行删除
  removeLayer(attrValue, attrName) {
    const layerArr = this.viewer.getLayersByAttr(attrValue, attrName);
    if (layerArr.length > 0) {
      layerArr.map(layer => {
        if (layer.options?.clustering) {
          window.cesiumInit.divGraphic.deleteClusterGraphic();
        }
        // 如果isForever为true则不删除
        !layer.isForever && this.viewer.removeLayer(layer)
      });
    }
  }
}

export default MapEvent;
