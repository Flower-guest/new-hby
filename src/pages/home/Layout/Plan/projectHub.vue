<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-25 14:21:23
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-03 16:09:11
 * @FilePath: \hby\src\pages\home\components\Plan\projectHub.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="left flex">
    <div v-show="dialog">
      <InfoDialog :title="'xmgl'">
        <template #infoMain>
          <div class="info_main">
            <div class="main-title">
              <span>数据统计</span>
            </div>
            <div class="pl-24px grid grid-cols-2">
              <template v-for="i in props.dataCount" :key="i.val">
                <DataCount
                  :data-count="{ ...i, val: props.ruralInfo[i.val] }"
                />
              </template>
            </div>
            <!-- 列表 -->
            <List
              :height="480"
              tab-title="列表信息"
              :tab-value="props.tabValue"
              @change="change"
              :dict-type="'built_project_status'"
            />
          </div>
        </template>
      </InfoDialog>
    </div>
    <img loading="lazy"
      class="w-51px h-101px"
      :class="{ 'jump rotate-180': !dialog }"
      @click="dialog = !dialog"
      :src="getAssets('sq.png')"
      alt="icon"
    />
  </div>
</template>

<script lang="ts" setup>
import "./com.less";
import List from "./components/list.vue";
import DataCount from "./components/dataCount.vue";
import { getAssets } from "@/utils";

interface detailProps {
  ruralInfo?: any;
  dataCount: any;
  tabValue: any;
}
const props = defineProps<detailProps>();

const dialog = ref<boolean>(true);

const emit = defineEmits(["change"]);
const change = (i) => {
  emit("change", i);
};
</script>

<style lang="less" scoped></style>
