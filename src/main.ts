import { createApp } from "vue";
import App from "./App.vue";
import route from "./router";
import "@/router/permission";
import pinia from "./store";
import pluginMain from "./plugins";

import "@/assets/css/index.css";
import "virtual:uno.css";

import * as mars3d from "mars3d";
import * as Cesium from "mars3d-cesium";
window.mars3d = mars3d;
window.Cesium = Cesium;

//引入cesium基础库
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";

//导入mars3d主库
import "mars3d/dist/mars3d.css";

import "amfe-flexible/index.js";

// 权限
// import { setupAuth } from "@/directives";

const app = createApp(App);

pluginMain(app);
// setupAuth(app);

app.use(route).use(pinia).mount("#app");
