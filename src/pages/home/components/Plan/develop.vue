<template>
  <div class="left flex">
    <div v-show="dialog">
      <template v-if="!zone">
        <InfoDialog :title="'xcfz'">
          <template #infoMain>
            <div class="info_main">
              <div v-hasPermi="['panel:dev:sum']">
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
              </div>
              <!-- 列表 -->
              <List
                :height="550"
                tab-title="列表信息"
                :tab-value="props.tabValue"
                @change="change"
                :dict-type="'investment_status'"
              />
            </div>
          </template>
        </InfoDialog>
      </template>
      <template v-else>
        <InfoDialog
          :title="zone?.title"
          :img-width="zone?.w"
          :img-height="zone?.h"
          width="500px"
        >
          <template #infoMain>
            <div class="px-25px py-20px h-820px overflow-y-auto">
              <img
                loading="lazy"
                class="max-w-100%"
                :src="zone?.img"
                alt="img"
              />
            </div>
          </template>
        </InfoDialog>
      </template>
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
import List from "./components/list.vue";
import DataCount from "./components/dataCount.vue";
import { zoneList } from "@/const/layout";
import { useToolStore } from "@/store";
import { getAssets } from "@/utils";

interface detailProps {
  ruralInfo?: any;
  dataCount: any;
  tabValue: any;
}
const props = defineProps<detailProps>();

const dialog = ref<boolean>(true);
const store = useToolStore();
const zone = ref<any>();

watch(
  () => store.zone,
  (newValue: any) => {
    zone.value = newValue ? zoneList[newValue.id] : null;
  }
);

const emit = defineEmits(["change"]);
const change = (i) => {
  emit("change", i);
};
</script>

<style lang="less" scoped>
.lists {
  position: absolute;
  z-index: 1;
  div {
    width: 88px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: url("@/assets/img/info-bg.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    cursor: pointer;
  }
  div:hover::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 28px;
    z-index: 1;
    background: url(@/assets/img/table-bg.png) no-repeat left center/100% auto;
  }
}
</style>
