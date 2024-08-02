// 页面左侧tab切换栏标签  label:tab标签栏名称  dateName：指定查找数据的json文件名  val：唯一值
export const tab = {
  introduce: [],
  develop: [
    {
      val: "zsxm",
      label: "招商项目",
      dateName: "招商项目",
      permissions: "panel:dev:inv",
    },
    {
      val: "fwzs",
      label: "房屋招商",
      dateName: "房屋资产",
      permissions: "panel:dev:house",
    },
    {
      val: "qtzs",
      label: "其他招商",
      dateName: "其他资产",
      permissions: "panel:dev:other",
    },
  ],
  personInfo: [],
  projectHub: [
    {
      val: "jsxm",
      label: "项目管理",
      dateName: "建设项目",
      permissions: "panel:project:list",
    },
  ],
};
// 乡村统计
export const statistics = {
  introduce: [
    {
      imgUrl: "icon_zrs.png",
      val: "totalPopulation",
      label: "总人口",
      unit: "人",
      h: 54,
    },
    {
      imgUrl: "icon_sr.png",
      val: "totalIncome",
      label: "总收入",
      unit: "万元",
      h: 53,
    },
    {
      imgUrl: "icon_ykl.png",
      val: "touristsNum",
      label: "游客量",
      unit: "万人次",
      h: 57,
    },
    {
      imgUrl: "icon_hs.png",
      val: "homestay",
      label: "民宿",
      unit: "家",
      h: 55,
    },
  ],
  develop: [
    {
      imgUrl: "icon_ghxm.png",
      val: "plannedProjectsNum",
      label: "招商项目",
      unit: "个",
      h: 53,
    },
    {
      imgUrl: "icon_tscy.png",
      val: "characteristicIndustriesNum",
      label: "特色产业",
      unit: "个",
      h: 54,
    },
    {
      imgUrl: "icon_djzc.png",
      val: "registerAssetsNum",
      label: "登记资产",
      unit: "个",
      h: 54,
    },
    {
      imgUrl: "icon_zszc.png",
      val: "investmentAssetsNum",
      label: "招商资产",
      unit: "个",
      h: 57,
    },
  ],
  personInfo: [
    {
      imgUrl: "icon_xmhs.png",
      val: "villageHouseNum",
      label: "户数",
      unit: "户",
      h: 55,
    },
    {
      imgUrl: "icon_zrs.png",
      val: "totalPopulation",
      label: "总人数",
      unit: "人",
      h: 54,
    },
    {
      imgUrl: "icon_dszns.png",
      val: "villageHouseOnechildNum",
      label: "独生子女户",
      unit: "户",
      h: 61,
    },
  ],
  projectHub: [
    {
      imgUrl: "icon_xmzs.png",
      val: "prjManageNum",
      label: "项目总数",
      unit: "个",
      h: 51,
    },
    {
      imgUrl: "icon_ztze.png",
      val: "prjMoneyNum",
      label: "总投资额",
      unit: "亿元",
      h: 54,
    },
    {
      imgUrl: "icon_zghmj.png",
      val: "prjPlanAreaNum",
      label: "总规划面积",
      unit: "公顷",
      h: 52,
    },
    {
      imgUrl: "icon_xmydmj.png",
      val: "prjLandAreaNum",
      label: "项目用地面积",
      unit: "公顷",
      h: 53,
    },
  ],
};
// 分区按钮点击功能加载对应面板图片
export const zoneList = {
  20: {
    title: "hby",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/plan-hby.png",
    w: 140,
    h: 29,
  },
  0: {
    title: "hbq",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/plan-hbq.png",
    w: 140,
    h: 29,
  },
  1: {
    title: "hyq",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/plan-hyq.png",
    w: 140,
    h: 29,
  },
  2: {
    title: "hyeq",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/plan-hyeq.png",
    w: 140,
    h: 29,
  },
  7: {
    title: "skq",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/plan-skq.png",
    w: 165,
    h: 40,
  },
  10: {
    title: "qyzyq",
    img: import.meta.env.VITE_BASE_URL + "/hby/img/plan-qyzyq.png",
    w: 165,
    h: 40,
  },
};
// 人房信息列表
export const rfxxTableList = [
  {
    label: "姓名",
    prop: "name",
  },
  {
    label: "与户主关系",
    prop: "relationshipHuzhu",
    type: "head_of_household_relationship",
  },
  {
    label: "性别",
    prop: "gender",
    type: "system_user_sex",
  },
  {
    label: "家庭住址",
    prop: "groupName",
  },
];
// 人房信息筛选列表
export const rfxxFilterList = [
  {
    label: "村",
    prop: "gridName",
    type: "list_country_hby",
    active: "",
  },
  {
    label: "村组",
    prop: "groupName",
    type: "",
    active: "",
  },
];
// 人房信息筛选下拉列表
export const filterSelect = [
  {
    label: "与户主关系",
    prop: "relationshipHuzhu",
    type: "head_of_household_relationship",
    active: "",
  },
  {
    label: "性别",
    prop: "gender",
    type: "system_user_sex",
    active: "",
  },
];
