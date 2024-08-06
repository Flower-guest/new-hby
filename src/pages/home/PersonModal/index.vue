<template>
  <component :is="tabs[attrs.info?.markerType]" v-bind="attrs" />
</template>

<script setup lang="ts">
const houseInfoBuild = defineAsyncComponent(() => import("./build.vue"));
const houseInfoHold = defineAsyncComponent(() => import("./hold.vue"));
const tabs = { houseInfoBuild, houseInfoHold };

const attrs: any = useAttrs();
</script>

<style scoped></style>
