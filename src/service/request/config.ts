/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-15 16:36:02
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-31 12:18:07
 * @FilePath: \new-hby\src\service\request\config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const resultCode = '0000';

export const errorCode = {
  "999": "系统繁忙",
  "500": "系统繁忙",
  "ERR_BAD_RESPONSE":"网络异常，请稍后再试",
};

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
export const ignoreMsgs = [
  "密码错误", //避免浏览器保存密码一键录入后显示这个错误
];

export const DEFAULT_LOADING = true; //loading默认状态

