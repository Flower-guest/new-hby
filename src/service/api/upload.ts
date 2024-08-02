/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-11 15:05:45
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-15 14:27:54
 * @FilePath: \hby\src\service\api\upload.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import jsonRequest from "..";

// 上传图片
export const uploadImg = (data) => {
  return jsonRequest.post({
    url: `/admin-api/infra/file/upload`,
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
