<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-12-13 19:19:20
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-23 10:09:05
 * @FilePath: \hby\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: Microsoft Yahei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: var(--color-bg-1);
  overflow: hidden;
  height: 100%;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
