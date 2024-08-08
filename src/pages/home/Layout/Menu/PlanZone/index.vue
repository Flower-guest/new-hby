<template>
  <div
    v-if="btnList"
    class="absolute bottom-45px w-100% h-100px z-10 ml-590px flex"
  >
    <template v-for="i in btnList" :key="i.id">
      <div
        @click="handleListClick(i, 'fAct', i)"
        class="zone"
        :class="{ active: active.fAct === i.id }"
      >
        <span class="ml-120px">{{ i.name }}</span>
        <div v-show="active.fAct === i.id" class="zone-item">
          <template v-for="item in i.childlist" :key="item.id">
            <div
              :class="{ 'item-active': active.sAct === item.id }"
              @click.stop="handleListClick(item, 'sAct', i)"
            >
              {{ item.name }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToolStore } from "@/store";
import { GetMenuTreeList } from "@/service/api";
// import { flyToPoint } from "@/utils";

// const primitiveLoader = window.cesiumInit.primitiveLoader;

const btnList = ref<any>();
const store = useToolStore();
const active = reactive<any>({
  fAct: null,
  sAct: null,
});
let cities: any = []; //所有id

const loadData = async (pid) => {
  try {
    btnList.value = await GetMenuTreeList(pid);
    btnList.value.forEach((i) => {
      if (i.childlist.length > 0) {
        i.childlist.forEach((child) => {
          cities.push(child.id);
        });
      }
      cities.push(i.id);
    });
    cities.push(pid);
  } catch (err) {
    console.log(err);
  }
};

const resetActive = () => {
  deleteGraphic([]);
  active.fAct = null;
  active.sAct = null;
  store.setPlanZoneImg("");
  btnList.value = null;
  cities = [];
};

const handleListClick = async (item: any, type: string, fItem = null) => {
  console.log(fItem);
  active[type] = item.id;
  // 默认选中第一个子项
  if (type === "fAct" && item.childlist.length > 0) {
    handleListClick(item.childlist[0], "sAct");
    return;
  }
  deleteGraphic([item.id], () => {
    useLoadData([item.id], [{ url: item.jsonurl, id: item.id }]);
    window.cesiumInit.mapEvent.flyToPoint(item.scene_camera);
  });

  // 切换图层
  store.setPlanZoneImg(item.image);
};

/**
 * 删除指定图层数据
 * @param checkArray :选中的菜单id数组
 * @param ck :回调函数
 * @param fArray: 所选菜单下的所有可选子集id
 */
const deleteGraphic = (checkArray, ck: any = null) => {
  // 使用filter方法过滤出不在checkArray中的元素
  const excludeResult = cities.filter((item) => !checkArray.includes(item));
  excludeResult.forEach((item) => {
    window.cesiumInit.mapEvent.removeLayer(item, "id");
    window.cesiumInit.divGraphic.removeLayer(item);
  });
  ck && ck();
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
