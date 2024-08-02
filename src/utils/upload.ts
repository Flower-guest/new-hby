/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-11 15:09:16
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-18 11:30:47
 * @FilePath: \hby\src\utils\upload.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { uploadImg } from "@/service/api/upload"
// base64 转为Blob
export const base64ToBlob = (base64Data) => {

  const dataArr = base64Data.split(','); // 根据,来分隔

  const imageType = dataArr[0].match(/:(.*?);/)[1]; // 获取文件类型。使用正则捕获 image/jpeg

  const textData = window.atob(dataArr[1]); // 使用atob() 将base64 转为文本文件
  const arrayBuffer = new ArrayBuffer(textData.length); // 创建一个二进制数据缓冲区，可以理解为一个数组
  const uint8Array = new Uint8Array(arrayBuffer); // 创建一个类型化数组对象，可以理解为上面的数组的成员，给这个对象赋值就会放到上面的数组中。
  for (let i = 0; i < textData.length; i++) {
    uint8Array[i] = textData.charCodeAt(i); // 将文本文件转为UTF-16的ASCII, 放到类型化数组对象中
  }

  return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)]; // 返回两个值，一个Blob对象，一个图片格式（如jpeg）
}

// 转为formData
export const toFormData = async (data, type = 'file') => {
  let imageBlob, imageType;
  if (type === 'file') {
    [imageBlob, imageType] = [new Blob([data], { type: data.type }), data.type.slice(6)];
  } else {
    [imageBlob, imageType] = base64ToBlob(data);
  }
  const formData = new FormData();
  formData.append('file', imageBlob, `${Date.now()}.${imageType}`); // 添加到表单，传入文件名
  const url = await uploadImg(formData);
  return url;
}
