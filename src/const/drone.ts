// 右侧菜单显示内容
export const leftMenu = [
  {
    label: "首页",
    type: "home",
    inactiveIcon: "drone-icon-home.png",
    activeIcon: "drone-icon-home-a.png",
    id: 1,
  },
  {
    label: "飞行任务",
    type: "task",
    inactiveIcon: "drone-icon-task.png",
    activeIcon: "drone-icon-task-a.png",
    id: 2,
  },
  // {
  //   label: "历史影像",
  //   type: "history",
  //   inactiveIcon: "drone-icon-history.png",
  //   activeIcon: "drone-icon-history-a.png",
  //   id: 3,
  // },
  // {
  //   label: "事件列表",
  //   type: "event",
  //   inactiveIcon: "drone-icon-event.png",
  //   activeIcon: "drone-icon-event-a.png",
  //   id: 4,
  // },
  {
    label: "隔空喊话",
    type: "shout",
    inactiveIcon: "drone-icon-shout.png",
    activeIcon: "drone-icon-shout-a.png",
    id: 5,
  },
];
// 顶部菜单显示内容
export const topMenu: any = {
  menuL: [
    {
      label: "高度",
      props: "alt",
      margin: "60px",
      unit: "m",
      icon: "drone-icon-alt.png",
    },
    {
      label: "速度",
      props: "speed",
      margin: "80px",
      unit: "m",
      icon: "drone-icon-speed.png",
    },
    {
      label: "经度",
      margin: "80px",
      props: "lon",
      icon: "drone-icon-loglat.png",
    },
    {
      label: "纬度",
      margin: "0px",
      props: "lat",
    },
  ],
  menuR: [
    {
      label: "无人机状态",
      props: "connected",
      icon: "drone-icon-state.png",
    },
    {
      label: "当前无人机电量",
      props: "chargeRemainingInPercent",
      icon: "drone-icon-electricity.png",
      unit: "%",
    },
    {
      label: "GPS状态",
      props: "gps",
      icon: "drone-icon-gps.png",
    },
    {
      label: "指南针状态",
      props: "compass",
      icon: "drone-icon-compass.png",
    },
  ],
};
// 后端返回为布尔类型对应的中文值
export const booleanTranslations = {
  true: "正常",
  false: "异常",
};
// 航线列表功能按钮
export const taskListBtn:any = [
//   {
//   label: "编辑",
//   icon: "detail-guide-edit-icon.png",
//   type: "edit",
// },
{
  label: "删除",
  icon: "drone-icon-delete.png",
  type: "delete",
},
//  {
//   label: "导出",
//   icon: "drone-icon-export.png",
//   type: "export",
// }
]
// 无人机类型
const takeOffLineTypeOption = [
  {
    label: "御二",
    value: "0",
  },
  {
    label: "御三",
    value: "1",
  },
];
// 任务类型
const takeOffLineTaskTypeOption = [
  {
    label: "普通任务",
    value: "0",
  },
  {
    label: "红外任务",
    value: "3",
  },
];
// 表单弹窗内容
export const detailFormDialog = {
  show: false,
  type:"",
  content: {},
  taskName: {
    form: {airlineName: ""},
    formItem: [
      { label: "航线名称", type: "input", field: "airlineName" }
    ],
    label: "航线设置",
  },
  takeOffLine: {
    form: { type: "1", taskType: "0" },
    formItem: [
      {
        label: "无人机类型",
        type: "select",
        field: "type",
        selectOpt: takeOffLineTypeOption,
      },
      {
        label: "任务类型",
        type: "select",
        field: "taskType",
        selectOpt: takeOffLineTaskTypeOption,
      },
    ],
    label: "导览名称设置",
  },
}


