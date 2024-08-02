<template>
  <!-- 顶部搜索功能 -->
  <div v-show="visible" class="search">
    <el-input
      @input="handleSearch"
      v-model="search.iptVal"
      placeholder="请输入需要搜索的地址"
    >
      <template #suffix>
        <el-button color="#2192A6" type="primary" round>
          <img
            loading="lazy"
            class="w-16px h-16px mr-8px"
            :src="getAssets('icon_ss.png')"
            alt="搜索"
          />搜索</el-button
        >
      </template>
    </el-input>
    <div v-show="search.suggestions.length > 0" class="list">
      <template v-for="i in search.suggestions" :key="i.id">
        <div
          class="flex-between-center flex-wrap text-[#fff] py-15px px-5px cursor-pointer"
          @click="selectSearchSuggestion(i)"
        >
          <span class="text-14px mr-5px">{{ i.name }}</span>
          <span class="text-12px">{{ i.xzqh + i.name }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
import LocSearch from "./LocSearch";

const locSearch = new LocSearch();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const search = reactive<any>({
  iptVal: "",
  suggestions: [],
});
let oldMarker;

watch(
  () => props.visible,
  (newVal) => {
    if (!newVal && oldMarker) {
      locSearch.deleteSpecifyDiv(oldMarker.id);
    }
  }
);

// 搜索事件
const handleSearch = useDebounceFn(async (value: string | number) => {
  if (value) {
    window.cesiumInit.mapEvent.searchGaodePOI(
      value,
      (data) => (search.suggestions = data)
    );
  } else {
    search.suggestions = [];
  }
}, 500);
// 搜索值点击事件
const selectSearchSuggestion = (val) => {
  if (!oldMarker) {
    oldMarker = val;
  } else {
    locSearch.deleteSpecifyDiv(oldMarker.id);
  }
  search.suggestions = [];
  const option = {
    position: [val.lng, val.lat],
    text: val.name,
    attr: { ...val, markerType: "bq" },
  };
  locSearch.addDemoGraphics(option);
  search.iptVal = "";
};
</script>

<style lang="less" scoped>
.search {
  position: absolute;
  left: 50%;
  top: 112px;
  z-index: 1;
  height: 47px;
  width: 480px;
  transform: translate(-50%, 0px);
  :deep(.el-input) {
    width: 100%;
    height: 45px;
    .el-input__wrapper {
      background: var(--menu-search-ipt-wrapper-bg);
      box-shadow: inset 0px 0px 5px -1px #92efff;
      border-radius: 8px;
      padding-left: 20px;
      .el-input__inner {
        color: var(--menu-search-ipt-inner-color);
      }
      .el-input__inner::placeholder {
        color: var(--menu-search-ipt-inner-color);
      }
    }
  }
  .list {
    background: url("@/assets/img/sugges-list-bg.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
