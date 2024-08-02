## 目录结构

以下是系统的目录结构

```
├── viteConfig           //vite配置文件
├── src
│    ├── service         // api请求
│    ├── assets          // 静态文件
│    ├── components      // 业务通用组件
│    ├── pages           // 业务页面

│    ├── router          // 路由文件
│    ├── store           // 状态管理
│    ├── utils           // 工具类
│         ├──  cesium  //存放cesium封装类
│                 ├──  config  //cesium初始化配置文件
│    ├── App.vue
│    ├── main.ts
├── .d.ts                // 类型定义
├── tsconfig.json        // ts配置
└── vite.config.ts       // vite全局配置

pages
```

# 安装项目依赖
pnpm install

# 运行
pnpm run dev
```
