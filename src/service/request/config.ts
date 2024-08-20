export const resultCode = '0000';

export const errorCode = {
  "999": "系统繁忙",
  "500": "系统繁忙",
  "ERR_BAD_RESPONSE": "网络异常，请稍后再试",
};

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
export const ignoreMsgs = [
  "密码错误", //避免浏览器保存密码一键录入后显示这个错误
];

export const DEFAULT_LOADING = true; //loading默认状态
export const DEFAULT_FILTER = false; //是否过滤分页数据
