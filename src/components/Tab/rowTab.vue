<template>
  <el-row :gutter="20" class="row">
    <template v-for="j in props.rowList" :key="j.value">
      <template v-if="j.type !== 'html'">
        <el-col :span="j?.span ?? 12">
          <div class="text-[#E6E6E6] text-16px">
            {{ j.label }} ： {{ dataInfo?.fnum ? dataInfo[j.prop] : "" }}
          </div>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="24">
          <div class="jj com" v-html="dataInfo[j.prop]"></div>
        </el-col>
      </template>
    </template>
  </el-row>
</template>

<script setup lang="ts">
import { getDictLabel } from "@/utils/dict";
import { formatDateFromTimestamp, extractTypes } from "@/utils";
interface detailProps {
  rowList: any;
  data: any;
}

const props = defineProps<detailProps>();

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
  if (newValue) {
    const types: any = extractTypes(props.rowList, "type"); //将数组里面所有type类型的数据取出来
    // // 获取字典数据
    types.forEach(async (i) => {
      if (i.type == "time") {
        const time = formatDateFromTimestamp(newValue[i.prop]);
        dataInfo.value[i.prop] = time;
      } else if (i.type == "html") {
        dataInfo.value[i.prop] = newValue[i.prop];
      } else {
        const label = getDictLabel(newValue[i.prop]);
        dataInfo.value[i.prop] = label;
      }
    });
  }
};
init(props.data);
</script>

<style lang="less" scoped>
.row {
  height: 400px;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 0;
  margin-right: 0;
}

.row::-webkit-scrollbar {
  width: 5px;
}

.row::-webkit-scrollbar-track {
  background: rgb(179, 177, 177);
  border-radius: 10px;
}

.row::-webkit-scrollbar-thumb {
  background: #5c9099;
  border-radius: 10px;
}
.com {
  box-sizing: border-box;
  padding: 14px 15px 28px;
  background: rgba(107, 142, 153, 0.2);
  border: 1px solid #0c454c;
  color: #e6e6e6;
  font-size: 16px;
}
.jj {
  line-height: 26px;
  height: 410px;
  overflow: hidden;
  overflow-y: auto;
}
.jj::-webkit-scrollbar {
  width: 5px;
}

.jj::-webkit-scrollbar-track {
  background: rgb(179, 177, 177);
  border-radius: 10px;
}
</style>
