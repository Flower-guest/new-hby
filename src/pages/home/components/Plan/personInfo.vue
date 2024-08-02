<template>
  <div class="left flex">
    <div v-show="dialog">
      <InfoDialog :title="'rfxx'">
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
            <List :height="510" tab-title="列表信息" @change="change" />
          </div>
        </template>
      </InfoDialog>
    </div>
    <img
      loading="lazy"
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
import List from "./components/rfxxList.vue";
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
const change = () => {
  emit("change", { showTable: false });
};
</script>

<style lang="less" scoped></style>
