<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane
        v-for="i in tabPanes"
        :key="i.name"
        :label="i.label"
        :name="i.name"
      >
        <el-row :gutter="20" class="row">
          <template v-for="j in rowList[activeName]" :key="j.value">
            <template v-if="j.type !== 'html'">
              <el-col :span="j?.span ?? 12">
                <div class="text-[#E6E6E6] text-16px">
                  {{ j.label }} ： {{ dataInfo[j.prop] }}
                </div>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="24">
                <span class="com" v-html="dataInfo[j.prop]"></span>
              </el-col>
            </template>
          </template>
        </el-row> </el-tab-pane
    ></el-tabs>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { getDictLabel } from "@/utils/dict";
import { extractTypes } from "@/utils";
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
const dataInfo = ref<any>({}); //当前点击的tab内容

// 传参实时监听变化与赋值
watch(
  () => props.data,
  (newValue) => {
    activeName.value = props.tabPanes[0].name;
    if (newValue) init(newValue);
  }
);

const init = (newValue) => {
    const types: any = extractTypes(props.rowList[activeName.value], "type"); //将数组里面所有type类型的数据取出来
    // 获取字典数据
    types.forEach(async (i) => {
      if (i.type == "time") {
        const time = dayjs.unix(newValue[i.prop]).format("YYYY-MM-DD HH:mm:ss");
        newValue[i.prop] = time;
      } else if (i.type == "dict") {
        const label = getDictLabel(newValue[i.prop]);
        newValue[i.prop] = label;
      }
    });
  dataInfo.value = newValue;
};
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

  .row {
    height: 400px;
    overflow: hidden;
    overflow-y: auto;
    margin-left: 0;
    margin-right: 0;
    &&::-webkit-scrollbar {
      width: 5px;
    }

    &&::-webkit-scrollbar-track {
      background: rgb(179, 177, 177);
      border-radius: 10px;
    }

    &&::-webkit-scrollbar-thumb {
      background: #5c9099;
      border-radius: 10px;
    }
    .com {
      box-sizing: border-box;
      padding: 14px 15px 28px;
      color: #e6e6e6;
      font-size: 16px;
      line-height: 26px;
      height: 410px;
      overflow: hidden;
      overflow-y: auto;
      &&::-webkit-scrollbar {
        width: 5px;
      }
      &&::-webkit-scrollbar-track {
        background: rgb(179, 177, 177);
        border-radius: 10px;
      }
    }
  }
}
</style>
