<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-03-13 14:48:37
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-30 17:29:52
 * @FilePath: \hby\src\pages\home\components\FootTool\zone.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    v-if="toolList"
    class="absolute bottom-45px w-100% h-100px z-10 ml-590px flex"
  >
    <template v-for="i in toolList" :key="i.id">
      <div
        @click="handleListClick(i, 'fAct', i)"
        class="zone"
        :class="{ active: active.fAct === i.id }"
        v-if="i.label"
      >
        <span class="ml-120px">{{ i.label }}</span>
        <div v-show="active.fAct === i.id" class="zone-item">
          <template v-for="item in i.children" :key="item.id">
            <div
              :class="{ 'item-active': active.sAct === item.id }"
              @click.stop="handleListClick(item, 'sAct', i)"
            >
              {{ item.label }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToolStore } from "@/store";
// import { flyToPoint } from "@/utils";
import { getPlanningDataManagementOnly } from "@/service/api/admin-api";

const primitiveLoader = window.cesiumInit.primitiveLoader;

const toolList = ref<any>();
const store = useToolStore();
const active = reactive<any>({
  fAct: null,
  sAct: null,
});

const zones = {
  ghfq: [
    {
      id: 20,
      dataName: "规划分区",
    },
    {
      label: "花博区",
      id: 0,
      dataName: "花博区分区",
    },
    {
      label: "花游区",
      id: 1,
      children: [
        {
          label: "展时分区",
          id: 3,
          dataName: "花游区展时分区",
        },
        {
          label: "展后分区",
          id: 4,
          dataName: "花游区展后分区",
        },
      ],
    },
    {
      label: "花业区",
      id: 2,
      children: [
        {
          label: "展时分区",
          id: 5,
          dataName: "花业区展时分区",
        },
        {
          label: "展后分区",
          id: 6,
          dataName: "花业区展后分区",
        },
      ],
    },
  ],
  hxzyq: [
    {
      label: "湖湘展园区",
      id: 7,
      children: [
        {
          label: "展时分区",
          id: 8,
          dataName: "湖湘展园区展时分区",
        },
        {
          label: "展后分区",
          id: 9,
          dataName: "湖湘展园区展后分区",
        },
      ],
    },
  ],
  qyzyq: [
    {
      label: "企业展园区",
      id: 10,
      dataName: "企业展园区",
    },
  ],
};

const loadData = (type) => {
  resetActive();
  toolList.value = zones[type];
  const firstZone = zones[type][0];
  handleListClick(firstZone, "fAct", firstZone);
  if (type === "hxzyq") {
    const firstChildZone = firstZone.children[0];
    handleListClick(firstChildZone, "sAct", firstZone);
  }
};

const resetActive = () => {
  if (active.fAct) {
    active.fAct = null;
    active.sAct = null;
    store.setZone(null);
    toolList.value = null;
  }
};

const handleListClick = async (item: any, type: string, fItem = null) => {
  active[type] = item.id;
  if (item.id !== 20 && type == "fAct" && item?.children) {
    const firstChildZone = item.children[0];
    handleListClick(firstChildZone, "sAct", fItem);
    return;
  }
  const {
    // cameraId,
    fileUrl } = (await getPlanningDataManagementOnly({
    dateName: item.dataName,
  })) as any;
  // 飞入
  // if (cameraId) flyToPoint(cameraId);
  // 切换图层
  store.setZone(fItem);
  if (fileUrl) {
    primitiveLoader.deleteFn();
    primitiveLoader.addGeoJsonLayer({ url: fileUrl });
  }
};

defineExpose({
  loadData,
  resetActive,
});
</script>

<style lang="less" scoped>
.zone {
  color: #e6fcff;
  font-size: 28px;
  font-family: "FZCHSJT";
  background: url("@/assets/img/icon-zone-b.png") no-repeat;
  background-size: 100% 100%;
  width: 326px;
  height: 100%;
  line-height: 100px;

  position: relative;
  .zone-item {
    position: absolute;
    top: -86px;
    left: 0;
    div {
      background-color: #04212b;
      border: 1px solid #115662;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #8faeb3;
      font-size: 16px;
      padding: 0 18px;
      margin-bottom: 8px;
    }
    .item-active {
      color: #c8f3fa;
    }
  }
}

.active {
  background: url("@/assets/img/icon-zone-t.png") no-repeat !important;
  background-size: 100% 100% !important;
}
</style>
