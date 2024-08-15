export const tabList = [
  {
    label: "姓名",
    prop: "memberName",
  },
  {
    label: "积分",
    prop: "bscore",
  },
];

export const rankMethod = [
  {
    label: "排行方式",
    val: "0",
    sortVal: "",
    options: [
      {
        value: "0",
        label: "总积分",
      },
      {
        value: "1",
        label: "区间排行",
      },
      {
        value: "2",
        label: "月份",
      },
    ],
  },
];

export const detailList = [
  {
    label: "时间",
    prop: "recordDate",
  },
  {
    label: "奖扣事件",
    prop: "eventRemark",
    width:460,
  },
  {
    label: "事件类型",
    prop: "eventName",
  },
  {
    label: "奖扣分值",
    prop: "meritPointValue",
  },
];
