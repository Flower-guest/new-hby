import { jfRequest } from "..";
// 月积分
export type JFMonthVO = {
  orgId: string; //	组织Id
  rankId: string; //排行榜Id
  groupId?: string; //排行榜分组Id，为空则查询所有分组进行聚合排名
  month: string; //排行榜查询月份
  type: string; //排行榜查询类型（0月排名，2日排名）
  rankWayType: string; //排行方式（standard-积分榜，progress-进步榜，average-平均分榜）
  curpage: number; //页面码
  pagesize: number; //每页显示数
};

// 总积分
export type JFTotalVO = {
  orgId: string; //	组织Id
  rankId: string; //排行榜Id
  groupId?: string; //排行榜分组Id，为空则查询所有分组进行聚合排名
  curpage: number; //页面码
  pagesize: number; //每页显示数
};

// 阶段积分
export type JFStageVO = {
  orgId: string; //	组织Id
  rankId: string; //排行榜Id
  groupId?: string; //排行榜分组Id，为空则查询所有分组进行聚合排名
  rankWayType: string; //排行方式（standard-积分榜，progress-进步榜，average-平均分榜）
  monthStart: string; //排行榜查询起始月份（查询间隔不能超过三个月，如 2023-10）
  monthEnd: string; //排行榜查询截止月份（查询间隔不能超过三个月，如 2023-12）
  curpage: number; //页面码
  pagesize: number; //每页显示数
};

// 查询个人积分明细
export type JFDetailListVO = {
  orgId: string; //	组织Id
  memberId: string; //成员Id
  meritPointDate: string; //积分流水日期（例如查询 2023-12 的积分流水明细）
  curpage: number; //页面码
  pagesize: number; //每页显示数
};


// 积分获取token
export const postJFToken = (data) => {
  return jfRequest.post({
    url: `/login`,
    params: data,
  });
};

// 积分获取token
export const postJFOrgList = () => {
  return jfRequest.post({
    url: `/api/orgList`,
    showLoading: false,
  });
};

// 查询组织所有排行榜接口
export const postJFRankList = (data) => {
  return jfRequest.post({
    url: `/api/open/rank/list`,
    data,
    showLoading: false,
  });
};

// 积分排行榜人员月排名信息查询接口
export const postPointsRanking = (data: JFMonthVO) => {
  return jfRequest.post({
    url: `/api/open/rank/pointsRanking`,
    data,
  });
};

// 积分排行榜人员总分排名信息接口
export const postTotalPointsRanking = (data: JFTotalVO) => {
  return jfRequest.post({
    url: `/api/open/rank/totalPointsRanking`,
    data,
  });
};

// 积分排行榜人员阶段排名信息接口
export const postStagePointsRanking = (data: JFStageVO) => {
  return jfRequest.post({
    url: `/api/open/rank/stagePointsRanking`,
    data,
  });
};

// 查询个人积分明细接口
export const postDetailList = (data: JFDetailListVO) => {
  return jfRequest.post({
    url: `/api/open/meritpoint/detailList`,
    data,
  });
};
