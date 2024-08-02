import http from "../..";
import * as ResultType from './type';

// 获取gis项基础信息
export const GetBasicinfo = (gid) => http.get<ResultType.BasicinfoResponse>({ data: { IDIP: 247, gid } });

// 登录
export const PostLogin = (data) => http.post<ResultType.LoginResponse>({ data: { ...data, IDIP: 134 } });

// 获取GIS项目列表
export const GetProjectList = () => http.get<ResultType.ProjectList>({ data: { IDIP: 244 } });

// 初始化GIS项目
export const GetUserInterface = (gid) => http.get<ResultType.UserInterface>({ data: { IDIP: 245, gid } });

// 获取前端菜单
export const GetWebMenu = (pid = 0) =>
  http.get<ResultType.WebMenuResponse>({
    url: `?IDIP=${242}&pid=${pid}`
  });

// 登出
export const LoginOut = () => http.post({ data: { IDIP: 246 } });

