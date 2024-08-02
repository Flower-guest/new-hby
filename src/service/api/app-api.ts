import jsonRequest from "..";
import axios from "axios";
import { GAODE_POI_KEY } from "@/const/util";

// 获取天气数据
export const getWeather = () => {
  return axios
    .get(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=430100&key=${GAODE_POI_KEY}`
    )
    .then((res) => {
      return res.data;
    });
};

// 查询字典数据（精简)列表
export const listSimpleDictData = () => {
  return jsonRequest.get({
    url: `/admin-api/system/dict-data/list-all-simple`,
  });
};
