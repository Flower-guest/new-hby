<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-12-13 19:19:20
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-06-07 11:54:53
 * @FilePath: \hby\src\components\VideoPlayer\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :id="props.options.id"></div>
</template>

<script setup lang="ts">
interface detailProps {
  options: {
    source: string;
    isLive: boolean;
    id: string;
  };
}
const props = defineProps<detailProps>();

let player;

onMounted(() => {
  player = new Aliplayer(
    {
      id: props.options.id,
      width: "100%", //容器的大小
      height: "100%", //容器的大小
      autoplay: true,
      playsinline: true,
      controlBarVisibility: "hover",
      skinLayoutIgnore: ["errorDisplay"],
      skinLayout: [
        {
          name: "H5Loading",
          align: "cc",
        },
        { name: "tooltip", align: "blabs", x: 0, y: 56 },
        {
          name: "controlBar",
          align: "blabs",
          x: 0,
          y: 0,
          children: [
            { name: "fullScreenButton", align: "tr", x: 10, y: 12 },
            { name: "setting", align: "tr", x: 15, y: 12 },
            { name: "volume", align: "tr", x: 5, y: 10 },
          ],
        },
      ],
      source: props.options.source, // 播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
      isLive: props.options.isLive, // 是否为直播播放。
    },
    (player) => {
      player.play();
    }
  );
});

onUnmounted(() => {
  if (player) {
    player.dispose();
  }
});
</script>
