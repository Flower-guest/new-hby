/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-03-22 09:57:27
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-05-08 11:57:03
 * @FilePath: \hby\src\service\api\ai-create-plan.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import qs from "qs";
import { AIRequest } from "..";

type AIRender = {
  env: string;
  model: string;
  frontEnv: string;
};

// 生成建筑的
export const postCreateShapes = (data: any) => {
  const params = { result: JSON.stringify(data) };
  return AIRequest(import.meta.env.VITE_BASE_AI_BUILD_URL + "").post({
    url: `/shapes`,
    data: qs.stringify(params),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// 修改单栋建筑后的 更新所在用地的 外层建筑 数据
export const postUpDateOuter = (data: any) => {
  return AIRequest(import.meta.env.VITE_BASE_AI_BUILD_URL + "").post({
    url: `/updateOuter`,
    data: qs.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 用于根据外层建筑数据生成内层建筑
export const postInner = (data: any) => {
  const params = { region: JSON.stringify(data) };
  return AIRequest(import.meta.env.VITE_BASE_AI_BUILD_URL + "").post({
    url: `/inner`,
    data: qs.stringify(params),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// AI渲染的
export const postAIRender = (data: AIRender) => {
  return AIRequest("/ai").post({
    url: `/run_program`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
