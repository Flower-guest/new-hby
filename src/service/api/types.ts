export type InformationPage = {
  list: any;
  total: number;
};

export type InformationId = {
  title: string;
  content: string;
  type: number;
  status: number;
  id: number;
};

// 获得指定空间数据
export type PlanningDataManagementOnlyVO = {
  dateName: string; //	数据名称
  fnum?: number; //关联对象
  type?: string; //自己的类型名
  type1?: string; //父级的类型名
};

// 资产管理分页
export type ManagementVO = {
  pageNo?: number; //	页码
  pageSize?: number; //每页条数
  rentalIntention?: number; //出租意愿
  assetUsage?: string; //资产用途 （当资产用途为闲置且出租意愿为想出租的时候为招商数据）
  fnum?: number; //关联对象
  name?: string; //资产名称
  status?: number; //招商状态
  filter?: boolean; //是否将接口返回数据过滤
};

// 招商|项目管理分页
export type InvestmentProjectVO = {
  pageNo?: number; //	页码
  pageSize?: number; //每页条数
  fnum?: number; //关联对象
  name?: string; //资产名称
  status?: number; //招商状态
  filter?: boolean; //是否将接口返回数据过滤
};

// 人房信息管理分页
export type VillagerVO = {
  pageNo: number; //	页码
  pageSize: number; //每页条数
  fnum?: number; //关联对象
  gridName?: string; //所在网格
  groupName?: string; //所在组别
  gender?: number; //性别
  relationshipHuzhu?: string; //与户主关系
  name?: string; //姓名
  filter?: boolean; //是否将接口返回数据过滤
};

// 获得点位分页
export type PointsVO = {
  fnum?: number; //关联对象
};
