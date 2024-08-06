/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-09 15:44:26
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-18 15:00:37
 * @FilePath: \hby\src\pages\home\components\Menu\menuToolPage\invGuide\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export interface Report {
  show: boolean; //是否显示
  detailShow: boolean; //详情是否显示
  label: string; //标题
  icon: string; //图标
  isSave: boolean; //是否保存状态
  disabled: boolean; //是否禁用拖拽
  active: number | null; //当前激活视角
  reportId: number; // 所属汇报编号
  list: ReportList[]; //视角列表
  detail: ReportList | null; //详情组件所需参数
  pageNo: number; //当前页码
  total: number; //总条数
  pageSize: number; //每页条数
}

export interface ReportList {
  reportId: number, //所属汇报编号
  reportName: string, //所属汇报名称
  animationOrder: number, //动画排序
  animationName: string, //动画名称
  animationThumbnail: string, //动画缩略图
  remark: string, //备注
  id: number, //序号
}

export interface DetailScene {
  animation: ReportList | null, //点击的汇报动画数据
  deleteId: number[], //删除的动画帧的id
  list: DetailSceneList[], //动画帧内容
  idx: number, //点击的动画帧索引
  pageNo: number,
  pageSize: number,
  saveStatus: boolean;//是否进行数据保存
}

export interface DetailSceneList {
  animationId?: number | null, //所属动画编号
  frameOrder?: number, //帧排序
  frameThumbnail?: string, //帧缩略图
  sceneX?: number, // lng
  sceneY?: number, // lat
  sceneZ?: number, //高度 alt
  scenePitch?: number, //pitch
  sceneYaw?: number, //heading
  timeFly?: number, //飞行时间
  timeWait?: number, //等待时间
  totalTime?: number, //时间总和
  id?: number,//动画帧id
  type?: string,//动画帧类型
  layersConfig?: any;
}
export interface DetailToolItem {
  icon: string;
  type: string;
  label?: string;
  dialog?: DialogContent;
}

export interface DialogContent {
  icon: string;
  label: string;
  hint?: string;
  btn: DialogButtonType[];
}

export interface DialogButtonType {
  label: string;
  type: string;
}

export interface DetailFormDialog {
  show: boolean; //表单显示
  type: string; //表单类型
  content: any; //表单展示内容
  time: any; //时间表单
  name: any; //名字表单
}
