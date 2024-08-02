// 公共无人机航线样式配置
export const comDroneLineStyle = {
  color: "#fff",
  width: 8,
  clampToGround: false,
  materialType: "LineFlow",
  materialOptions: {
    image: import.meta.env.VITE_BASE_URL + "/img/line-arrow-blue.png",
    color: "#fff",
    speed: 20,
    repeat_x: 10,
    repeat_y: 1,
    axisY: false,
    materialType: "LineFlow",
  },
}

// 高德key
export const GAODE_POI_KEY = "68ebee603e40b6448eebff20ad735e9b";
