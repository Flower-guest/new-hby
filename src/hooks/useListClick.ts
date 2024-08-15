
// import {
//   getInvestmentProjectId,
//   getAssetManagementId,
//   getPlanningDataManagementOnly,
//   getVillagerId,
//   getBuiltProjectsId,
//   getBuildingManagementId,
// } from "@/service/api/admin-api";
// import { getAssets } from "@/utils";
// import { comPolygonOption } from "@/const/util";

const useListClick = () => {
  // tab点击事件
  const listClick = async (tabActive, item) => {
    const res = await fetchDataByTab(tabActive, item.id);
    // const positions: any = await getPlanningDataManagementOnly({
    //   dateName: tabActive.dateName,
    //   fnum: item.fnum,
    // });

    // const mapValue = positions.mapData || positions.surfaceShpData;
    // if (mapValue) {
    //   const isPoint = mapValue.features?.[0]?.geometry.type === "Point";
    //   if (isPoint) {
    //     handlePointData(res, mapValue, positions);
    //   } else {
    //     handlePolygonData(mapValue, res.markerType);
    //   }
    // }
    return res;
  };

  const fetchDataByTab = async (tabActive, id) => {
    console.log(id);
    switch (tabActive.val) {
      case "zsxm":
        // return { ...(await getInvestmentProjectId(id) as any), markerType: "zs" };
      case "jsxm":
        // return { ...(await getBuiltProjectsId(id) as any), markerType: "js" };
      case "rfxx":
        // return { ...(await getVillagerId(id) as any), markerType: "rfxx" };
      case "fwzs":
        // return { ...(await getBuildingManagementId(id) as any), markerType: "zc" };
      default:
        // return { ...(await getAssetManagementId(id) as any), markerType: "zc" };
    }
  };

  // const getThumbnail = (res, positions) => {
  //   if (res.markerType === "zs" || res.markerType === "rd") {
  //     return res?.thumbnail?.[0] ?? getAssets("default_thumb.jpg");
  //   }
  //   return positions?.thumbnail?.[0];
  // };

  // const createOption = (res, mapValue, positions) => ({
  //   ...res,
  //   position: mapValue.features?.[0]?.geometry.coordinates ?? [],
  //   img: getThumbnail(res, positions),
  //   text: res?.projectName ?? res?.titleInvestment ?? res?.assetName ?? res?.name,
  //   diFar: 20000,
  //   attr: res,
  //   vr: Boolean(res?.panoramicLink || res?.panoramicAddress),
  // });

  // const handlePointData = (res, mapValue, positions) => {
  //   const option = createOption(res, mapValue, positions);
  //   const addGraphic = res.markerType === "zs" || res.markerType === "rd"
  //     ? window.cesiumInit.divGraphic.addGradientDiv
  //     : window.cesiumInit.divGraphic.addBillboard;

  //   addGraphic.call(window.cesiumInit.divGraphic, option);
  //   window.cesiumInit.mapEvent.flyToPoint({
  //     position: option.position,
  //     radius: 1000,
  //     time: 2,
  //   });
  // };

  // const handlePolygonData = (mapValue, markerType) => {
  //   const primitiveLoader = window.cesiumInit.primitiveLoader;
  //   for (let i = 0; i < mapValue.features.length; i++) {
  //     const { properties, geometry } = mapValue.features[i];
  //     if (properties?.style?.label) {
  //       properties.style.label.text = properties?.name;
  //     }
  //     const option = {
  //       // ...comPolygonOption,
  //       positions: geometry.coordinates,
  //       style: properties?.style,
  //       attr: {
  //         ...properties,
  //         markerType: markerType ?? null,
  //       },
  //     };
  //     primitiveLoader.addPolygonPrimitive(option);
  //   }
  // };

  return { listClick };
};

export default useListClick;
