// 页面左侧tab切换栏标签  label:tab标签栏名称  dateName：指定查找数据的json文件名  val：唯一值
export const tab = {
  invesList: {
    height: 550,
    option:[{value:0,label:"已招商"},{value:1,label:"未招商"}],
    list: [
      {
        val: "zsxm",
        label: "招商项目",
        dateName: "招商项目",
      },
      {
        val: "fwzs",
        label: "房屋招商",
        dateName: "房屋资产",
      },
      {
        val: "qtzs",
        label: "其他招商",
        dateName: "其他资产",
      },
    ]
  },
  assetsList: {
    height: 550,
    option:[{value:0,label:"已招商"},{value:1,label:"未招商"}],
    list: [
      {
        val: "fwzc",
        label: "房屋资产",
        dateName: "房屋资产",
      },
      {
        val: "qtzc",
        label: "其他资产",
        dateName: "其他资产",
      },
    ]
  },
  buildList: {
    height: 480,
    option:[{value:0,label:"前期策划"},{value:1,label:"方案设计"},{value:2,label:"项目实施"},{value:3,label:"运营维护"}],
    list: [
      {
        val: "jsxm",
        label: "项目管理",
        dateName: "建设项目",
      },
    ]
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
