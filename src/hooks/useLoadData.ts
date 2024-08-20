import { getMenuData, getDict } from "@/utils/auth";
import { ElLoading } from "element-plus";

/**
 * 检查图层和图形是否已加载
 * @param items - 要检查的图层或图形数组
 * @param key - 要检查的属性名
 * @returns 未加载的图层或图形数组
 */
export const findUnloadedItems = (items: any[], key: string) => {
  return items.filter(item => {
    const layers = window.cesiumInit.map3d.getLayersByAttr(item[key], 'id');
    const divLayer = window.cesiumInit.divGraphic.graphicDivLayer.getGraphicsByAttr(item[key], 'name');
    return layers.length < 1 && divLayer.length < 1;
  });
};

export const useLoadData = async (checkMenuArr: number[] = [], jsonUrl: { id: number, url: string }[] = [], tilesUrl: { id: number, url: string }[] = []) => {
  if (checkMenuArr.length === 0) return;
  const noHaveLayerId = findUnloadedItems(checkMenuArr.map(id => ({ id })), 'id');//查找为在加载的菜单id数据
  const noHasJsonUrl = findUnloadedItems(jsonUrl, 'id');//查找为在加载的图层json数据
  const noHasTilesUrl = findUnloadedItems(tilesUrl, 'id');//查找为在加载的图层模型数据
  if (noHaveLayerId.length || noHasJsonUrl.length) {
    workerFormat({
      type: 'loadMenuData',
      checkMenuArr: noHaveLayerId.map(item => item.id),
      isForever: false, jsonUrl: noHasJsonUrl
    });
  }
  // 加载模型
  noHasTilesUrl.length && noHasTilesUrl.forEach(i => window.cesiumInit.modelAndImage.addCesium3DTileSet(i))
};

/**
 * 右侧菜单点位跟招商面数据加载
 * @param type :loadMenuData:加载菜单数据 loadListData:加载列表点击数据
 * @param data :数据
 * @param checkMenuArr :需要加载的菜单id数组
 * @param menuId :菜单id
 * @param findIdArr :需要查找的id数组
 * @param isForever: 是否永久加载
 * @param jsonUrl :外链数据地址数组
 */
// export const workerFormat = (options: {
//   type: 'loadMenuData' | 'loadListData';
//   data?: any,
//   checkMenuArr?: number[];
//   menuId?: number;
//   findIdArr?: string[] | number[];
//   isForever?: boolean;
//   jsonUrl?: { id: number; url: string }[];
// }) => {
//   const { type, data = getMenuData(), checkMenuArr, menuId, findIdArr, isForever = false, jsonUrl = [] } = options;

//   const worker = new Worker(new URL("../worker/formatLayerData.ts", import.meta.url));
//   const { primitiveLoader, divGraphic } = window.cesiumInit;
//   let loading: any;
//   const startLoading = () => {
//     loading = ElLoading.service({
//       lock: true,
//       text: "正在加载中....",
//       background: "rgba(0, 0, 0, 0.5)",
//     });
//   };

//   const stopLoading = () => {
//     if (loading) loading.close();
//   };

//   try {
//     startLoading();

//     worker.postMessage({
//       type,
//       data,
//       checkMenuArr,
//       dict: getDict(),
//       isForever,
//       menuId,
//       findIdArr,
//     });

//     const handleWorkerMessage = (e: MessageEvent) => {
//       const processLayerData = (id: number, layerData: any) => {
//         const { lineAndPolygon, marker, borderLine } = layerData;

//         // 处理标记数据
//         marker.forEach(val => {
//           if (val?.markerType) {
//             switch (val.markerType) {
//               case "bubbleFlag":
//                 divGraphic.bubbleFlag(val);
//                 break;
//               case "triangleFlag":
//                 divGraphic.triangleFlag(val);
//                 break;
//               case "pano":
//               case "design":
//               case "houseInfoHold":
//               case "houseInfoBuild":
//                 divGraphic.addBillboard({ ...val, isCluster: marker.length > 50 });
//                 break;
//               default:
//                 divGraphic.customIcon(val);
//                 break;
//             }
//           }
//         });

//         // 加载面和线
//         if (lineAndPolygon.features.length > 0) {
//           primitiveLoader.addGeoJsonLayer({ id, data: lineAndPolygon, isForever });
//         }

//         // 加载边界线
//         if (isForever && borderLine.features.length > 0) {
//           primitiveLoader.addGeoJsonLayer({
//             data: borderLine,
//             mask: true,
//             isForever: true,
//             symbol: {
//               styleOptions: {
//                 ...borderLine.features[0].properties.style,
//                 fill: true,
//                 color: borderLine.features[0].properties?.maskColor ?? "rgb(0,0,0)",
//                 opacity: borderLine.features[0].properties?.maskColor ? null : 0.6,
//                 global: false,
//               },
//             },
//           });
//         }
//       };

//       if (type === 'loadMenuData') {
//         checkMenuArr && checkMenuArr.forEach(id => processLayerData(id, e.data.data[id]));
//       } else {
//         menuId && processLayerData(menuId, e.data.data);
//       }

//       // 外链json数据加载
//       jsonUrl.forEach(item => {
//         if (item.url) {
//           primitiveLoader.addGeoJsonLayer({ id: item.id, url: item.url });
//         }
//       });

//       stopLoading();
//       worker.terminate();
//     };

//     worker.addEventListener("message", handleWorkerMessage);
//   } catch (error) {
//     console.error('Error fetching or processing data:', error);
//     worker.terminate();
//     stopLoading();
//   }
// }
export const workerFormat = (options: {
  type: 'loadMenuData' | 'loadListData';
  data?: any,
  checkMenuArr?: number[];
  menuId?: number;
  findIdArr?: string[] | number[];
  isForever?: boolean;
  jsonUrl?: { id: number; url: string }[];
}) => {
  const { type, data = getMenuData(), checkMenuArr, menuId, findIdArr, isForever = false, jsonUrl = [] } = options;

  const workers: Worker[] = [];
  const numWorkers = navigator.hardwareConcurrency || 1;

  // 将数据按核显数分块
  const dataChunks = checkMenuArr ? chunkArray(checkMenuArr, numWorkers) : [checkMenuArr];

  const { primitiveLoader, divGraphic } = window.cesiumInit;
  let loading: any;

  const startLoading = () => {
    loading = ElLoading.service({
      lock: true,
      text: "正在加载中....",
      background: "rgba(0, 0, 0, 0.5)",
    });
  };

  const stopLoading = () => {
    if (loading) loading.close();
  };

  let completedWorkers = 0;
  let allLayerData: any = {};

  const handleWorkerMessage = (e: MessageEvent, workerIndex: number) => {
    const layerData = e.data.data;

    // 合并各个worker的结果
    allLayerData = { ...allLayerData, ...layerData };
    completedWorkers++;
    console.log(completedWorkers);

    // 处理所有worker的结果
    if (type === 'loadMenuData' && checkMenuArr) {
      checkMenuArr.forEach(id => {
        processLayerData(id, allLayerData[id]);
      });
    } else if (menuId) {
      processLayerData(menuId, allLayerData);
    }

    // 外链json数据加载
    jsonUrl.forEach(item => {
      if (item.url) {
        primitiveLoader.addGeoJsonLayer({ id: item.id, url: item.url });
      }
    });

    stopLoading();

    workers[workerIndex].terminate();
  };

  const processLayerData = (id: number, layerData: any) => {
    const { lineAndPolygon, marker, borderLine } = layerData;

    marker.forEach(val => {
      if (val?.markerType) {
        switch (val.markerType) {
          case "bubbleFlag":
            divGraphic.bubbleFlag(val);
            break;
          case "triangleFlag":
            divGraphic.triangleFlag(val);
            break;
          case "pano":
          case "design":
          case "houseInfoHold":
          case "houseInfoBuild":
            divGraphic.addBillboard({ ...val, isCluster: marker.length > 50 });
            break;
          default:
            divGraphic.customIcon(val);
            break;
        }
      }
    });

    if (lineAndPolygon.features.length > 0) {
      primitiveLoader.addGeoJsonLayer({ id, data: lineAndPolygon, isForever });
    }

    if (isForever && borderLine.features.length > 0) {
      primitiveLoader.addGeoJsonLayer({
        data: borderLine,
        mask: true,
        isForever: true,
        symbol: {
          styleOptions: {
            ...borderLine.features[0].properties.style,
            fill: true,
            color: borderLine.features[0].properties?.maskColor ?? "rgb(0,0,0)",
            opacity: borderLine.features[0].properties?.maskColor ? null : 0.6,
            global: false,
          },
        },
      });
    }
  };
  // 创建worker并分配数据块
  dataChunks.forEach((chunk, index) => {
    const worker = new Worker(new URL("../worker/formatLayerData.ts", import.meta.url));
    workers.push(worker);
    try {
      startLoading();
      worker.postMessage({
        type,
        data,
        checkMenuArr: chunk,
        dict: getDict(),
        isForever,
        menuId,
        findIdArr,
      });

      worker.addEventListener("message", (e) => handleWorkerMessage(e, index));
    } catch (error) {
      console.error('Error fetching or processing data:', error);
      worker.terminate();
      stopLoading();
    }
  });
}

// 辅助函数：将数组按指定大小分块
function chunkArray(arr: any[], chunkSize: number) {
  const chunks: any = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}
