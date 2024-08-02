import jsonRequest from "..";
import {
  InformationPage,
  InformationId,
  PlanningDataManagementOnlyVO,
  ManagementVO,
  InvestmentProjectVO,
  VillagerVO,
  PointsVO,
} from "./types";

const constructUrl = (base: string, params: Record<string, any>): string => {
  const queryParams = new URLSearchParams(params).toString();
  return `${base}?${queryParams}`;
};

//
const getBaseParams = (
  requestUrl: string,
  data: any
): [Record<string, any>, string] => {
  const {
    pageNo = 1,
    pageSize = 10,
    fnum = "",
    name = "",
    status = "",
    filter = true,
    rentalIntention = "",
    assetUsage = "",
  } = data;
  const url = constructUrl(requestUrl, {
    pageNo,
    pageSize,
    fnum,
    projectName: name,
    projectStatus: status,
    rentalIntention,
    assetUsage,
  });
  const params = { filterData: filter };
  return [params, url];
};

// 获得乡村基本信息分页
export const getVillageInfoPage = () => {
  const url = `/admin-api/dv/village-info/page?pageNo=1&pageSize=1`;
  return jsonRequest.get({ url });
};

// 获得资讯管理分页
export const getInformationPage = (type = "") => {
  const url = `/admin-api/dv/information/page?pageNo=1&pageSize=100&type=${type}`;
  return jsonRequest.get<InformationPage>({ url });
};
// 获得资讯详情
export const getInformationId = (id: number) => {
  const url = `/admin-api/dv/information/get?id=${id}`;
  return jsonRequest.get<InformationId>({ url });
};

// 获得空间数据管理分页
export const getPlanningDataManagement = () => {
  const url = `/admin-api/dv/planning-data-management/page?pageNo=1&pageSize=100`;
  return jsonRequest.get({ url });
};
// 获得指定空间数据 dateName:数据名称 fnum:关联对象id
export const getPlanningDataManagementOnly = (
  data: PlanningDataManagementOnlyVO
) => {
  const { dateName, fnum = "", type = "" } = data;
  const url = `/admin-api/dv/planning-data-management/getPlanningDataManagement?dateName=${dateName}&fnum=${fnum}&type=${type}`;
  return jsonRequest.get({ url }) as any;
};

// 获得其它资产管理分页  rentalIntention:出租意愿  assetUsage：资产用途 （当资产用途为闲置且出租意愿为想出租的时候为招商数据）
export const getAssetManagement = (data: ManagementVO) => {
  const [params, url] = getBaseParams("/admin-api/dv/asset-management/page", {
    pageSize: 100,
    ...data,
  });
  return jsonRequest.get({ ...params, url });
};
// 获得其它资产管理详情
export const getAssetManagementId = (id: number) => {
  const url = `/admin-api/dv/asset-management/get?id=${id}`;
  return jsonRequest.get({ url });
};
// 获取房屋资产管理分页 rentalIntention:出租意愿  assetUsage：资产用途 （当资产用途为闲置且出租意愿为想出租的时候为招商数据）
export const getBuildingManagement = (data: ManagementVO) => {
  const [params, url] = getBaseParams(
    "/admin-api/dv/building-management/page",
    { pageSize: 100, ...data }
  );
  return jsonRequest.get({ ...params, url });
};
// 获得房屋资产管理详情
export const getBuildingManagementId = (id: number) => {
  const url = `/admin-api/dv/building-management/get?id=${id}`;
  return jsonRequest.get({ url });
};

// 获得招商项目管理分页 fnum:关联对象
export const getInvestmentProjects = (data: InvestmentProjectVO) => {
  const [params, url] = getBaseParams(
    "/admin-api/dv/investment-projects/page",
    { pageSize: 100, ...data }
  );
  return jsonRequest.get({ ...params, url });
};
// 获得招商项目管理详情
export const getInvestmentProjectId = (id: number) => {
  const url = `/admin-api/dv/investment-projects/get?id=${id}`;
  return jsonRequest.get({ url });
};

// 获得全景点位数据管理分页
export const getPanoramicPointDataManagement = () => {
  const url = `/admin-api/dv/panoramic-point-data-management/page`;
  return jsonRequest.get({ url });
};

//获得村民管理
export const getVillagerId = (id: number) => {
  const url = `/admin-api/dv/villager/get?id=${id}`;
  return jsonRequest.get({ url, filterData: false });
};

//获取人房信息管理分页
export const getVillager = (data: VillagerVO) => {
  const url = constructUrl(`/admin-api/dv/villager/page`, data);
  return jsonRequest.get({ url, filterData: false });
};

//获取全景点位
export const getPanoramicPoint = (data: PointsVO) => {
  const url = constructUrl(
    `/admin-api/dv/panoramic-point-data-management/page`,
    { pageSize: 1, ...data }
  );
  return jsonRequest.get({ url });
};

// 获得建设项目分页
export const getBuiltProjects = (data: InvestmentProjectVO) => {
  const [params, url] = getBaseParams(
    "/admin-api/dv/built-projects/page",
    data
  );
  return jsonRequest.get({ ...params, url });
};
// 获得建设项目详情
export const getBuiltProjectsId = (id: number) => {
  const url = `/admin-api/dv/built-projects/get?id=${id}`;
  return jsonRequest.get({ url });
};

// 获得地图点位分页
export const getMapPoints = (data: PointsVO) => {
  const url = constructUrl(`/admin-api/dv/map-points/page`, {
    pageSize: 100,
    ...data,
  });
  return jsonRequest.get({ url });
};

// 获得场景视角
export const getSceneCameraId = (id: number) => {
  const url = `/admin-api/dv/scene-camera/get?id=${id}`;
  return jsonRequest.get({ url });
};

// 获取材质
export const getTexture = () => {
  const url = `/admin-api/dv/texture-management/page?pageNo=1&pageSize=100`;
  return jsonRequest.get({ url });
}
