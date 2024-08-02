export interface createPlan {
  points: Array<[number, number]>; //面的点位信息
}

export interface DetailFormDialog {
  show: boolean; //表单显示
  type: string; //表单类型
  build: Build; // 生成建筑表单内容
  updateBuild: UpdateBuild; //更新建筑便当内容
}

interface Build {
  form: BuildForm;
  formItem: FormItem[];
  label: string;
}

interface BuildForm {
  newFAR: number; //容积率
  newDensity: number; //建筑密度： 0-1之间的浮点值 ，其他值|空值 记为 -1
  landuse: string; //选择用地性质
  lotMode: number; //地块模式选择
  id: string;
  parent: string;
  area: number;
}

interface FormItem {
  label: string;
  type: string;
  field: string;
  selectOpt?: any[];
}

interface UpdateBuild {
  form: UpdateBuildForm;
  formItem: FormItem[];
  label: string;
}

interface UpdateBuildForm {
  materialImage?: string;//材质贴图地址
  newFloors?: number | null;//新楼层数
}

// 方案生成功能列表
export const AIToolList = [
  {
    label: "上传文件",
    icon: "ai-upload-icon.png",
    type: "upload",
  },
  // {
  //   label: "选择地块",
  //   icon: "ai-check-icon.png",
  //   type: "check",
  // },
  {
    label: "绘制地块",
    icon: "ai-draw-icon.png",
    type: "draw",
  },
  // {
  //   label: "AI渲染",
  //   icon: "ai-render-icon.png",
  //   type: "render",
  // },
  {
    label: "清 除",
    icon: "ai-clear-icon.png",
    type: "clear",
  },
];
//方案生成 生成图后的按钮
export const AICreateSuccessBtn = [
  {
    label: "取消",
    type: "cancel",
  },
  {
    label: "重新渲染",
    type: "render",
  },
  {
    label: "下载",
    type: "down",
  },
];
// 方案生成 选择用地性质
export const landuseOption = [
  // {
  //   label: "住宅",
  //   value: "resident",
  // },
  {
    label: "商业",
    value: "commercial",
  },
  // {
  //   label: "服务设施",
  //   value: "service",
  // },
  // {
  //   label: "办公",
  //   value: "office",
  // },
  // {
  //   label: "乡村背景",
  //   value: "ruralbackground",
  // },
  // {
  //   label: "城市背景",
  //   value: "citybackground",
  // },
];
// 方案生成 地块模式选择
export const lotModeOption = [
  {
    label: "单地块值",
    value: 0,
  },
  {
    label: "多地块值",
    value: 1,
  },
];

export const detailFormDialog: DetailFormDialog = {
  show: false,
  type: "",
  build: {
    form: {
      newFAR: 2,
      newDensity: 0.1,
      landuse: "commercial",
      lotMode: 0,
      id: "0",
      parent: "0",
      area: 0,
    },
    formItem: [
      { label: "容积率", type: "input", field: "newFAR" },
      { label: "建筑密度", type: "input", field: "newDensity" },
      {
        label: "选择用地性质",
        type: "select",
        field: "landuse",
        selectOpt: landuseOption,
      },
      {
        label: "地块模式选择",
        type: "select",
        field: "lotMode",
        selectOpt: lotModeOption,
      },
    ],
    label: "参数设置",
  },
  updateBuild: {
    form: {},
    formItem: [
      {
        label: "修改最高层数",
        type: "input",
        field: "newFloors",
      },
      {
        label: "材质",
        type: "materialLibrary",
        field: "materialImage",
        selectOpt: [],
      },
    ],
    label: "更新建筑",
  },
}
