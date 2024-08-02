/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-22 09:50:56
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-06-19 10:26:38
 * @FilePath: \hby\src\service\api\drone-patrol.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { DroneRequest } from "..";

type CreateAirline = {
  airlineName: string;//航线名称
  waypoints: Waypoints[];//航点
  taskId: string,
}
type Waypoints = {
  seq: string;//序号
  marsLat: string;//纬度
  marsLon: string;//经度
  speed?: number;//航点速度
  heightFlight?: number;//飞行高度
  angle: number;//云台角度
}

type TakeOffLine = {
  droneId?: string;//无人机 ID
  taskId: string;//任务 ID
  tarmacId?: string;//停机坪 ID
  type: number;//无人机类型0御二 1 御三 默认传 1
  defaultAddress?: number;//true 固定播流地址 false 不固定播流地址 不传为不固定播流地址
  formatType?: number;//播放格式 0 rtmp 1 flv 2 m3u8不传为 rtmp 格式
  taskType?: number;//任务类型 0 普通任务 3 红外任务 不传为普通任务
}

enum ApiQuery {
  droneId = "drone-b61731cdb891c03a",
  tarmacId = 10039,
}

// 获取航线任务列表
export const getTaskList = (name = '') => {
  return DroneRequest.post({
    url: `/lines/list`,
    data: { pageNum: 1, pageSize: 100, name }
  });
}

// 删除航线任务
export const deleteTask = (id) => {
  return DroneRequest.get({
    url: `/lines/remove/${id}`,
  });
}

// 获取航线任务预计信息
export const getFlightEstimation = (airlineId = '') => {
  return DroneRequest.get({
    url: `/drone/flightEstimation?tarmacId=${ApiQuery.tarmacId}&airlineId=${airlineId}`,
  });
}

// 创建航线
export const postCreateAirline = (data: CreateAirline) => {
  return DroneRequest.post({
    url: `/lines/createAirline?droneId=${ApiQuery.droneId}&taskId=${data.taskId}`,
    data,
  });
};

// 查询航点
export const getQueryAirline = (airlineId) => {
  return DroneRequest.get({
    url: `/waypoint/queryWaypointByAirLineId/${airlineId}`,
  });
}

// 查询无人机飞行状态信息
export const getQueryTaskInfo = (taskId) => {
  return DroneRequest.get({
    url: `/task/queryTaskInfo?droneId=${ApiQuery.droneId}&taskId=${taskId}`,
    showLoading:false,
  });
};

// 执行航线任务
export const postTakeOffLine = (data: TakeOffLine) => {
  return DroneRequest.post({
    url: `/drone/takeOffLine`,
    data: { ...data, droneId: ApiQuery.droneId, tarmacId: ApiQuery.tarmacId, formatType: 1, defaultAddress: true },
  });
};

// 查询无人机实况信息
export const getDroneInfo = () => {
  return DroneRequest.get({
    url: `/drone/getDroneInfo/${ApiQuery.droneId}`,
    showLoading:false,
  });
};

// 查询机巢直播地址
export const getTarmacStream = () => {
  return DroneRequest.get({
    url: `/live/getTarmacStream/${ApiQuery.tarmacId}`,
  });
};

// 查询无人机播流地址
export const getDroneStream = () => {
  return DroneRequest.get({
    url: `/live/getDroneStream/${ApiQuery.droneId}`,
  });
};

// 喊话接口
export const postShout = (data) => {
  return DroneRequest.post({
    url: `/drone/shout?droneId=${ApiQuery.droneId}&volume=1`,
    data,
  });
};

// 获取红外最新接口
export const getNewInfo = () => {
  return DroneRequest.get({
    url: `/infrared/getNewInfo`,
  });
}

// 查询无人机任务信息
export const getTaskRunTime = ()=>{
  return DroneRequest.get({
    url: `/task/taskRuntime/${ApiQuery.droneId}`,
  });
}
