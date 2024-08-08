import { getMenuData, getDict } from "@/utils/auth";
import { ElLoading } from "element-plus";

export const useLoadData = async (checkMenuArr: any = [], jsonUrl: any = []) => {
  if (checkMenuArr.length < 1) return;
  const noHaveLayerId: any = [], noHasJsonUrl: any = []; //没有加载的图层id
  checkMenuArr.forEach(id => {
    const layers = window.cesiumInit.map3d.getLayersByAttr(id, 'id');
    const divLayer = window.cesiumInit.divGraphic.graphicDivLayer.getGraphicsByAttr(id, 'name');
    if (layers.length < 1 && divLayer.length < 1) noHaveLayerId.push(id);
  })
  jsonUrl.forEach(item => {
    const layers = window.cesiumInit.map3d.getLayersByAttr(item.id, 'id');
    const divLayer = window.cesiumInit.divGraphic.graphicDivLayer.getGraphicsByAttr(item.id, 'name');
    if (layers.length < 1 && divLayer.length < 1) noHasJsonUrl.push(item);
  })

  workerFormat(getMenuData(), noHaveLayerId, false, noHasJsonUrl)
};

/**
 * 右侧菜单点位跟招商面数据加载
 * @param data :数据
 * @param checkMenuArr :需要加载的菜单id数组
 * @param isForever: 是否永久加载
 * @param jsonUrl :外链数据地址数组
 */
export const workerFormat = (data: any, checkMenuArr: any = [], isForever = false, jsonUrl: any = []) => {
  const worker = new Worker(new URL("../worker/loadMenuData.ts", import.meta.url));
  const primitiveLoader = window.cesiumInit.primitiveLoader;
  const divGraphic = window.cesiumInit.divGraphic;
  try {
    let loading = ElLoading.service({
      lock: true,
      text: "正在加载中....",
      background: "rgba(0, 0, 0, 0.5)",
    });
    // 向Worker发送消息
    worker.postMessage({ data, checkMenuArr, dict: getDict(), isForever });

    // 监听Worker消息
    const handleWorkerMessage = (e: MessageEvent) => {
      // 加载本地json数据
      checkMenuArr.forEach(id => {
        const { lineAndPolygon, marker, borderLine } = e.data.data[id];

        // 处理标记数据
        marker.forEach(val => {
          if (val?.markerType) {
            switch (val.markerType) {
              case "bubbleFlag": divGraphic.bubbleFlag(val); break;
              case "triangleFlag": divGraphic.triangleFlag(val); break;
              case "pano":
              case "design":
              case "houseInfo":
                // divGraphic.addBillboard({ ...val, isCluster: marker.length > 50 }); break;
                divGraphic.addBillboard({ ...val, isCluster: true }); break;
              default: divGraphic.customIcon(val); break;
            }
          }
        });

        // 加载面和线
        lineAndPolygon.features.length > 0 && primitiveLoader.addGeoJsonLayer({ id, data: lineAndPolygon, isForever })

        // 加载边界线
        isForever && primitiveLoader.addGeoJsonLayer({
          data: borderLine, mask: true, isForever: true, symbol: {
            styleOptions: {
              ...borderLine.features[0].properties.style,
              fill: true,
              color: "rgb(0,0,0)",
              opacity: 0.4,
              global: false,
            }
          }
        });
      })

      // 加载外链数据
      jsonUrl.length > 0 && jsonUrl.forEach(item => {
        item.url && primitiveLoader.addGeoJsonLayer({ id: item.id, url: item.url, })
      })

      // 清理监听器和终止Worker
      worker.removeEventListener("message", handleWorkerMessage);
      worker.terminate();
      loading.close()
    };

    worker.addEventListener("message", handleWorkerMessage);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    worker.terminate(); // 确保在异常情况下也终止Worker
  }
}
