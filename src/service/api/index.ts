import http from "../";
import * as ResultType from './type';
import { getGid } from "@/utils/auth";

// 获取gis项基础信息
export const GetBasicinfo = (gid) => http.get<ResultType.BasicInfoResponse>({ data: { IDIP: 247, gid } });

// 登录
export const PostLogin = (data) => http.post<ResultType.LoginResponse>({ data: { ...data, IDIP: 134 } });

// 游客登录
export const PostGuestLogin = (gid) => http.post<ResultType.LoginResponse>({ data: { IDIP: 251, gid } })

// 获取gis前端menu菜单
export const GetMenuTreeList = (pid) => http.get<ResultType.WebMenuResponse[]>({ data: { IDIP: 242, gid: getGid(), pid } });

// 获取GIS项目列表
export const GetProjectList = () => http.get<ResultType.ProjectListItem[]>({ data: { IDIP: 244 } });

// 初始化GIS项目
export const GetUserInterface = (gid) => http.get<ResultType.UserInterface>({ data: { IDIP: 245, gid } });

// 登出
export const LoginOut = () => http.post({ data: { IDIP: 246 } });

// 获取点位数据
export const GetDataByTypeId = (data: { type: string, id: number }) => http.get<any>({ data: { IDIP: 248, ...data } });

// 获取菜单页面按钮列表
export const GetGisBtnByMeun = (id: number) => http.get<ResultType.BtnByMenu[]>({ data: { IDIP: 249, id } });

// 获得资讯分类栏目列表
export const GetArticleChannel = () => http.get<ResultType.ArticleChannel[]>({ data: { IDIP: 190 } });

// 获得资讯列表
export const GetArticleListByChannel = (category: number) => http.get<ResultType.ArticleChannelList[]>({ data: { IDIP: 189, category } });

// 获得资讯内容
export const GetArticleById = (id: number) => http.get<ResultType.ArticleById[]>({ data: { IDIP: 188, id } });

// 获取招商项目类型，状态
export const GetInvestmentType = () => http.get<ResultType.ProjectType>({ data: { IDIP: 195 } });

// 获得招商项目列表
export const GetInvestmentList = (data: ResultType.ProjectListQuery) => http.get<ResultType.ProjectListResponse>({ data: { IDIP: 194, ...data }, filterData: true });

// 获得招商项目详情
export const GetInvestmentById = (id: number) => http.get<ResultType.ProjectDetailsResponse>({ data: { IDIP: 193, id } });

//  获取建设项目类型，状态
export const GetBuiltProjectType = () => http.get<ResultType.ProjectType>({ data: { IDIP: 183 } });

// 获得建设项目列表
export const GetBuiltProjectList = (data: ResultType.ProjectListQuery) => http.get<ResultType.ProjectListResponse>({ data: { IDIP: 182, ...data }, filterData: true });

// 获得建设项目详情
export const GetBuiltProjectById = (id: number) => http.get<ResultType.ProjectDetailsResponse>({ data: { IDIP: 181, id } });
