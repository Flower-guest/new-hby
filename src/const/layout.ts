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
