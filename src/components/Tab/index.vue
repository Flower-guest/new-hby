<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane
        v-for="i in tabPanes"
        :key="i.name"
        :label="i.label"
        :name="i.name"
      >
        <RowTab :row-list="rowList[i.name]" :data="dataInfo" /> </el-tab-pane
    ></el-tabs>
  </div>
</template>

<script setup lang="ts">
interface detailProps {
  tabPanes: any;
  rowList: any;
  data: any;
  contentColor?: string;
  activeColor?: string;
  activeLineColor?: string;
}

const props = withDefaults(defineProps<detailProps>(), {
  contentColor: "#DAE5E6",
  activeColor: "#78D0E0",
  activeLineColor: "#78D0E0",
});

const activeName = ref<any>(); //当前点击的tab内容
const dataInfo = ref<any>();

// 传参实时监听变化与赋值
watch(
  () => props.data,
  (newValue) => {
    init(newValue);
  }
);

const init = (newValue) => {
  dataInfo.value = newValue;
  activeName.value = props.tabPanes[0].name;
};
init(props.data);
</script>

<style lang="less" scoped>
:deep(.demo-tabs) {
  .el-tabs__item {
    padding: 32px;
    color: v-bind(contentColor);
    font-size: 18px;
    font-weight: 600;
  }
  .is-active {
    color: v-bind(activeColor);
  }
  .el-tabs__active-bar {
    bottom: 6px;
    background-color: v-bind(activeLineColor);
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__content{
    margin-top: 22px;
  }
}
</style>
