import { DetailToolItem, DetailFormDialog } from "./types";

export const guideFormDialog = {
  show: false,
  form: { animationName: '' },
  formItem: [
    { label: "动画名称", type: "input", field: "animationName" },
  ],
  label: "新增导览",
}

export const detailTool: {
  topLeft: DetailToolItem[];
  topRight: DetailToolItem[];
  tip: DetailToolItem[];
} = {
  topLeft: [
    {
      icon: "detail-guide-dl-icon.png",
      type: "back",
      label: "导览",
      dialog: {
        icon: "icon-reset-login.png",
        label: "要保存对动画帧的修改吗？",
        hint: "如果不保存，这些更改将会丢失",
        btn: [
          { label: "保存", type: "save" },
          { label: "不保存", type: "noSave" },
          { label: "取消", type: "cancel" },
        ],
      },
    },
    {
      icon: "detail-guide-edit-icon.png",
      type: "editName",
      label: "",
    },
  ],
  topRight: [
    {
      icon: "detail-guide-delete-icon.png",
      type: "delete",
      label: "删除",
      dialog: {
        icon: "icon-reset-login.png",
        label: "确定删除全部动画帧吗?",
        btn: [
          { label: "确定", type: "confirm" },
          { label: "取消", type: "cancel" },
        ],
      },
    },
    {
      icon: "detail-guide-save-icon.png",
      type: "save",
      label: "保存",
      dialog: {
        icon: "icon-box-save.png",
        label: "保存成功",
        btn: [{ label: "确定", type: "cancel" }],
      },
    },
  ],
  tip: [
    {
      icon: "detail-guide-delete-icon.png",
      type: "deleteScene",
    },
    {
      icon: "detail-guide-update-icon.png",
      type: "update",
    },
    {
      icon: "detail-guide-time-icon.png",
      type: "time",
    },
  ],
};

export const detailFormDialog: DetailFormDialog = {
  show: false,
  type: "",
  content: {},
  time: {
    form: {
      timeFly: '1',
      timeWait: '3'
    },
    formItem: [
      { label: "飞行时间", type: "input", field: "timeFly" },
      {
        label: "停留时间",
        type: "input",
        field: "timeWait"
      },
    ],
    label: "时间设置",
  },
  name: {
    form: {},
    formItem: [
      {
        label: "导览名称",
        type: "input",
        field: "guideName",
      },
    ],
    label: "导览名称设置",
  },
}
