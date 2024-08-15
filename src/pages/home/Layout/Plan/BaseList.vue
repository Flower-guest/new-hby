<template>
  <!-- tab栏与标题 -->
  <div class="mt-20px">
    <div class="main-title flex-between">
      <span>{{ data.title }}</span>
      <div class="flex justify-end">
        <template v-for="i in state.tabList" :key="i.val">
          <!-- <div @click="infoClick(i)"> -->
          <div class="cursor-pointer mt-6px ml-23px text-14px">
            <div :class="{ activeItem: state.activeTab == i.val }">
              {{ i.label }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <!-- 列表 -->
  <div class="list" :style="{ height: state.height + 'px' }">
    <!-- 搜索 -->
    <div class="my-18px text-[#DAE3E6] text-16px flex-between-center search">
      <el-select
        v-model="state.status"
        placeholder="全部"
        popper-class="poppers"
        :suffix-icon="IconDropDown"
        @change="screen"
        :clearable="true"
      >
        <el-option
          v-for="item in state.searchOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <div class="flex-center w-full">
        <img
          loading="lazy"
          class="w-24px h-24px mx-8px"
          :src="getAssets('icon_search.png')"
          alt="搜索"
        />
        <el-input
          v-model="state.name"
          @change="search"
          placeholder="请输入搜索关键字"
        >
          <template #suffix>
            <div class="w-1px h-16px bg-[#5C9099]"></div>
            <img
              loading="lazy"
              class="w-10px h-10px mx-8px"
              :src="getAssets('icon_ss.png')"
              alt="icon"
            />
            <span class="text-[#EDF4FF] text-12px cursor-pointer">搜索</span>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 列表item -->
    <div
      class="item"
      :style="{
        backgroundColor: clickItem == i.id ? 'rgba(51,116,128,0.8)' : '',
      }"
      v-for="i in state.infoList"
      :key="i.id"
      @click="changeTableInfo(i)"
    >
      <img
        loading="lazy"
        class="w-80px h-80px mr-8px"
        alt="缩略图"
        :src="
          i?.thumbnail?.[0] ??
          i?.assetImage?.[0] ??
          'https://console.launchst.cn/upload/2/file/6a7dc472aa9b53b793f784c22d70f7cd.jpg'
        "
      />
      <div class="flex flex-col text-12px">
        <span class="text-18px text-[#fff] mb-6px">{{
          i?.projectName ?? i?.assetName ?? i?.titleInvestment
        }}</span>
        <span class="color85">登记时间：{{ i.projectRegistrationDate }}</span>
        <span class="color85 my-5px"
          >占地面积：{{ i?.planArea ?? i.occupyingArea }}㎡</span
        >
        <div class="color85">
          价格：<span class="text-[#BFC52E]"
            >{{ i?.projectBudget ?? i?.listingPrice ?? "面议"
            }}{{ i?.projectBudget || i?.listingPrice ? "元" : "" }}</span
          >
        </div>
      </div>
      <!-- <div
        v-if="i.projectStatus"
        class="state"
        :style="{
          background:
            getDictLabel(props.dictType, i.projectStatus) == '招商中'
              ? '#BFC52E'
              : '#2EAEC5',
        }"
      >
        <span class="text-12px">{{
          getDictLabel(props.dictType, i.projectStatus)
        }}</span>
      </div> -->
    </div>
  </div>
  <!--分页按钮  -->
  <div class="flex-between-center mt-20px">
    <!-- <span class="text-[#fff] text-16px font-extrabold">{{
      props.pagination.label + "：" + state.total + props.pagination.unit
    }}</span> -->
    <el-pagination
      background
      layout="slot"
      :hide-on-single-page="totalPage < 2"
      :total="state.total"
      :page-size="state.pageSize"
      :current-page="state.pageNo"
      @current-change="changePage"
    >
      <div key="1" class="flex">
        <div class="pagination-btn" @click="changePage('prev', totalPage)">
          上一页
        </div>
        <div class="pagination-btn mx-15px">
          <span class="text-[#C8F1F9]">{{ state.pageNo }}/</span
          ><span class="text-[#3E8999]">{{ totalPage }}</span>
        </div>
        <div class="pagination-btn" @click="changePage('next', totalPage)">
          下一页
        </div>
      </div>
    </el-pagination>
  </div>
</template>

<script lang="ts" setup>
import IconDropDown from "@/components/IconDropDown/index.vue";
import useGetListInfo from "@/hooks/useGetListInfo";
import { tab } from "@/const/layout";
// import useListClick from "@/hooks/useListClick";
import { getAssets } from "@/utils";
// import { getUser } from "@/utils/auth";
// import { getDictOptions, getDictLabel } from "@/utils/dict";

const props = defineProps<{ data: any }>();
const state = reactive<any>({
  tabList: [],
  activeTab: "",
  height: 0,
  status: null,
  searchOpt: [],
  name:"",
});

onMounted(() => {
  state.tabList = tab[props.data.data_model].list;
  state.height = tab[props.data.data_model].height;
  state.searchOpt = tab[props.data.data_model].option;
  state.activeTab = state.tabList[0].val;
  console.log(props.data, state.tabList);
});

// 获取数据与当前点击tab栏
const {
  // tabActive,
  // state,
  // infoClick,
  changePage,
  search,
  screen,
} = useGetListInfo();
// const { listClick } = useListClick();

const clickItem = ref<number>();
// 总页数
const totalPage = computed(() => Math.ceil(state.total / state.pageSize));

const emit = defineEmits(["change"]);

// 列表点击事件展示弹窗信息
const changeTableInfo = async (i) => {
  // 地图展示点位删除
  window.cesiumInit.divGraphic.deleteDivGraphic();
  // 地图展示线面删除
  window.cesiumInit.primitiveLoader.deleteFn();
  // 如果重复点击 取消点击状态 并关闭弹窗
  if (i.id == clickItem.value) {
    clickItem.value = -1;
    emit("change", { showTable: false });
    return;
  }

  // const res = await listClick(tabActive.value, i);

  clickItem.value = i.id;
  // emit("change", res);
};
</script>

<style lang="less" scoped>
@import "./com.less";
.list {
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 4px;
  padding-bottom: 6px;

  .item {
    position: relative;
    margin-top: 8px;
    width: 100%;
    height: 96px;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #5c9099;
    padding: 8px;
    box-sizing: border-box;
    display: flex;

    .state {
      position: absolute;
      top: -1px;
      right: -1px;
      width: 64px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0px 8px 0px 8px;
    }
  }
}

.list::-webkit-scrollbar {
  width: 5px;
}

.list::-webkit-scrollbar-track {
  background: rgb(179, 177, 177);
  border-radius: 10px;
}

.list::-webkit-scrollbar-thumb {
  background: #5c9099;
  border-radius: 10px;
}

.color85 {
  color: rgba(218, 229, 230, 0.85);
}

.pagination-btn {
  padding: 6px 18px;
  background: #143944;
  border: 1px solid #2195a8;
  color: #fff;
  cursor: pointer;
}

:deep(.el-input) {
  width: 100%;
  height: 28px;

  .el-input__wrapper {
    background: #0d2124;
    box-shadow: inset 0px 0px 5px -1px #92efff;
    border-radius: 0;

    .el-input__inner {
      color: #7ac0cc;
    }

    .el-input__inner::placeholder {
      color: #7ac0cc;
    }
  }
}

:deep(.el-select) {
  width: 150px;

  .el-select__wrapper {
    background: #0d2124;
    box-shadow: inset 0px 0px 5px -1px #92efff;
    border-radius: 0;
  }
}
</style>
