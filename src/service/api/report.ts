/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-10 09:38:25
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-12 09:23:04
 * @FilePath: \hby\src\service\api\report.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 招商导览接口
import jsonRequest from "..";

// 获得汇报管理分页
export const getPageReportManagement = () => {
  const url = `/admin-api/dv/report-management/page?pageNo=1&pageSize=100`;
  return jsonRequest.get({ url });
}

// 创建汇报动画管理
export const postCreateReportAnimation = (data) => {
  const url = `/admin-api/dv/report-animation/create`;
  return jsonRequest.post({ url, data, });
};

// 更新汇报动画管理
export const putUpdateReportAnimation = (data) => {
  const url = `/admin-api/dv/report-animation/update`;
  return jsonRequest.put({ url, data, });
};

// 获得汇报动画管理分页
export const getPageReportAnimation = (id) => {
  const url = `/admin-api/dv/report-animation/page?pageNo=1&pageSize=100&reportId=${id}`;
  return jsonRequest.get({ url });
};

// 删除汇报动画管理
export const deleteReportAnimation = (id) => {
  const url = `/admin-api/dv/report-animation/delete?id=${id}`;
  return jsonRequest.delete({ url, });
};

// 创建汇报帧管理
export const postCreateReportFrame = (data) => {
  const url = `/admin-api/dv/report-frame/create`;
  return jsonRequest.post({ url, data, });
};


// 更新汇报帧管理
export const putUpdateReportFrame = (data) => {
  const url = `/admin-api/dv/report-frame/update`;
  return jsonRequest.put({ url, data, });
};

// 获得汇报帧管理分页
export const getPageReportFrame = (id) => {
  const url = `/admin-api/dv/report-frame/page?pageNo=1&pageSize=100&animationId=${id}`;
  return jsonRequest.get({ url });
};

// 删除汇报帧管理
export const deleteReportFrame = (id) => {
  const url = `/admin-api/dv/report-frame/delete?id=${id}`;
  return jsonRequest.delete({ url, });
};

