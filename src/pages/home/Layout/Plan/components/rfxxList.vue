<template>
  <div>
    <!-- tab栏与标题 -->
    <div class="mt-32px">
      <div class="main-title flex justify-between">
        <span>{{ props.tabTitle }}</span>
      </div>
    </div>
    <div class="list" :style="{ height: props.height + 'px' }">
      <!-- 顶部搜索处 -->
      <div class="my-16px text-[#DAE3E6] text-16px flex-between-center search">
        <img loading="lazy" class="w-24px h-24px mr-9px" :src="getAssets('icon_search.png')" alt="搜索"/>
        <el-input v-model="state.name" placeholder="请输入姓名">
          <template #suffix>
            <div class="flex-center" @click="filterSubmit">
              <div class="w-1px h-16px bg-[#5C9099]"></div>
              <img loading="lazy"
                class="w-10px h-10px mx-8px"
                :src="getAssets('icon_ss.png')"
                alt="icon"
              />
              <span class="text-[#EDF4FF] text-12px cursor-pointer">搜索</span>
            </div>
          </template>
        </el-input>
        <!-- 筛选 -->
        <div class="ml-11px relative">
          <span class="filter-btn" @click="sortModal = !sortModal">筛查</span>
          <div class="filter-modal" v-show="sortModal">
            <div class="filter-main">
              <!-- 筛选点击 -->
              <!-- <div v-for="j in filterList" :key="j.label">
                <span v-show="j.type" class="filter-title">{{ j.label }}</span>
                <div class="flex flex-wrap mt-7px">
                  <span
                    v-for="i in getDictOptions(j.type)"
                    @click="filterItemClick(j, i)"
                    :key="i"
                    class="filter-item"
                    :class="{ 'filter-item-active': j.active == i.label }"
                    >{{ i.label }}</span
                  >
                </div>
              </div> -->
              <!-- 筛选下拉 -->
              <div class="flex justify-between">
                <!-- <div
                  class="flex flex-col"
                  v-for="x in filterSelect"
                  :key="x.label"
                >
                  <div class="filter-title">
                    {{ x.label }}
                  </div> -->
                  <!-- <el-select-v2
                    class="w-190px"
                    popper-class="poppers"
                    v-model="state[x.prop]"
                    placeholder="全部"
                    :suffix-icon="IconDropDown"
                    collapse-tags
                    collapse-tags-tooltip
                    :options="getDictOptions(x.type)"
                    multiple
                    clearable
                  /> -->
                <!-- </div> -->
              </div>
            </div>
            <div class="line"></div>
            <div class="filter-footer">
              <div class="btn bor-col" @click="filterReset">重置</div>
              <div class="btn bg-[#1887AA]" @click="filterSubmit">确认</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 表单 -->
      <div class="w-100%">
        <!-- <el-table
          class="table"
          :data="state.tableData"
          :lazy="state.loading"
          :row-class-name="tableRowClassName"
          @row-click="showInfo"
          :header-cell-class-name="'table-head'"
        > -->
        <el-table
          class="table"
          :data="state.tableData"
          :lazy="state.loading"
          :row-class-name="tableRowClassName"
          :header-cell-class-name="'table-head'"
        >
          <el-table-column
            :align="'center'"
            width="60"
            type="index"
            label="序号"
          >
            <template #default="scope">
              <span>{{
                (state.pageNo - 1) * state.pageSize + scope.$index + 1
              }}</span>
            </template>
          </el-table-column>
          <!-- <template v-for="i in rfxxTableList" :key="i.prop"> -->
            <!-- <el-table-column :align="'center'" :label="i.label">
              <template #default="{ row }">
                {{ i?.type ? getDictLabel(i.type, row[i.prop]) : row[i.prop] }}
              </template>
            </el-table-column> -->
          <!-- </template> -->
        </el-table>
      </div>
    </div>
    <!--分页按钮  -->
    <div class="flex-between-center mt-40px">
      <span class="text-[#fff] text-16px font-extrabold"
        >统计人数：{{ state.total }}人</span
      >
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
          <div class="pagination-btn" @click="changePage('prev')">上一页</div>
          <div class="pagination-btn mx-15px">
            <span class="text-[#C8F1F9]">{{ state.pageNo }}/</span
            ><span class="text-[#3E8999]">{{ totalPage }}</span>
          </div>
          <div class="pagination-btn" @click="changePage('next')">下一页</div>
        </div>
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import IconDropDown from "@/components/IconDropDown/index.vue";
// import useListClick from "@/hooks/useListClick";
// import { getVillager } from "@/service/api/admin-api";
import { getAssets } from "@/utils";
// import { getDictOptions, getDictLabel } from "@/utils/dict";
// import { rfxxTableList, rfxxFilterList, filterSelect } from "@/const/layout";

interface detailProps {
  height?: number; //列表高度
  tabTitle: string; //tab栏标题
}
const props = withDefaults(defineProps<detailProps>(), {
  height: 300,
});

// const { listClick } = useListClick();
const sortModal = ref<any>(false); //是否显示筛选弹窗
// const filterList = ref<any>(rfxxFilterList);

const state = reactive<any>({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  pageNo: 1, // 当前页
  pageSize: 10, // 分页大小
  name: "", //村民姓名
  gridName: "", //村
  groupName: "", //村组
  gender: "", //性别
  relationshipHuzhu: "", //与户主关系
});

// 斑马条纹样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 == 1) {
    return "row1";
  } else {
    return "row2";
  }
};

// 总页数
const totalPage = computed(() => Math.ceil(state.total / state.pageSize));

// 获取表单信息
const getVillagers = async () => {
  if (sortModal.value) sortModal.value = false;
  // const res: any = await getVillager(state);
  // state.tableData = res.list.reverse();
  // state.total = res.total;
};

// 分页按钮点击事件
const changePage = (val) => {
  if (val == "prev") {
    if (state.pageNo < 2) return (state.pageNo = 1);
    state.pageNo--;
  } else {
    if (state.pageNo > totalPage.value - 1) return;
    state.pageNo++;
  }
  getVillagers();
};

// 筛选弹窗的item点击事件
// const filterItemClick = (list, item) => {
//   state[list.prop] = item.label;
//   list.active = item.label;
  // if (list.prop == "gridName") {
  //   filterList.value[1].type = item.value;
  // }
// };

// 筛选条件确认
const filterSubmit = () => {
  state.pageNo = 1;
  getVillagers();
};

// 筛选点击重置按钮
const filterReset = () => {
  sortModal.value = false;
  // filterList.value[1].type = ""; //村组数据清空
  // filterList.value.filter((i) => {
  //   i.active = "";
  // }); //点击状态清空
  // 数据重置
  Object.assign(state, {
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    pageNo: 1, // 当前页
    pageSize: 10, // 分页大小
    name: "", //村民姓名
    gridName: "", //村
    groupName: "", //村组
    gender: "", //性别
    relationshipHuzhu: "", //与户主关系
  });
  getVillagers();
};

// 列表点击事件展示弹窗信息
// const showInfo = async (row) => {
//   // 地图展示点位删除
//   window.cesiumInit.divGraphic.deleteDivGraphic();
//   // 地图展示线面删除
//   window.cesiumInit.primitiveLoader.deleteFn();

  // await listClick(
  //   {
  //     val: "rfxx",
  //     label: "人房信息",
  //     dateName: "人房信息",
  //   },
  //   row
  // );
// };

getVillagers();
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  overflow: hidden;
  padding-right: 4px;
  padding-bottom: 6px;
  .filter-btn {
    padding: 6px 30px;
    font-size: 14px;
    background: #0d2124;
    box-shadow: inset 0px 0px 4px 1px #75bfcc;
    cursor: pointer;
  }
  .filter-modal {
    position: absolute;
    width: 450px;
    height: 360px;
    background: url("@/assets/img/bg-person-sort.png") no-repeat;
    background-size: 100% 100%;
    right: -4%;
    top: 140%;
    z-index: 4;
    padding: 31px 24px;
    box-sizing: border-box;
    .filter-main {
      height: 278px;
      overflow: hidden;
      overflow-y: auto;
      .filter-title {
        font-family: "USTitleBlack";
        font-size: 16px;
        margin-bottom: 7px;
      }
      .filter-item {
        font-size: 14px;
        color: #ffffff;
        padding: 5px 21px;
        margin-bottom: 16px;
        border: 1px solid #2195a8;
        cursor: pointer;
        margin-right: 4px;
      }
      .filter-item-active {
        background: url("@/assets/img/bg-person-filter-item.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .filter-main::-webkit-scrollbar {
      width: 4px;
    }

    .filter-main::-webkit-scrollbar-track {
      background: rgb(179, 177, 177);
      border-radius: 4px;
    }

    .filter-main::-webkit-scrollbar-thumb {
      background: #5c9099;
      border-radius: 4px;
    }
    .line {
      width: 100%;
      height: 1px;
      background: #2b7cb5;
    }
    .filter-footer {
      display: flex;
      justify-content: space-between;
      padding: 11px 38px;
      .bor-col {
        border: 1px solid #1887aa;
      }
      .btn {
        font-size: 14px;
        color: #ffffff;
        padding: 5px 61px;
        cursor: pointer;
      }
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
.pagination-btn {
  padding: 6px 18px;
  background: #143944;
  border: 1px solid #2195a8;
  color: #fff;
  cursor: pointer;
}

:deep(.el-input) {
  flex: 1;
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
:deep(.table) {
  height: 460px;
  overflow: hidden;
  background-color: transparent;

  --el-table-row-hover-bg-color: var(--el-transfer-border-color);
  td.el-table__cell,
  th.el-table__cell.is-leaf {
    border-bottom: #2b7cb5;
  }

  .el-table__empty-block {
    background: transparent;
    .el-table__empty-text {
      color: transparent;
    }
  }

  tr {
    background-color: transparent;
  }

  .row1 {
    background-color: rgba(12, 183, 189, 0.1);
    font-size: 16px;
    color: #ffffff;
  }

  .row2 {
    background-color: transparent;
    font-size: 16px;
    color: #ffffff;
  }

  .row1:hover,
  .row2:hover {
    background: #1f8d99 !important;
    box-shadow: inset 0px 0px 12px 1px #33f7ff;
  }

  .table-head {
    background-color: rgba(12, 183, 189, 0.3);
    font-size: 14px;
    color: #ffffff;
  }
  .el-table__cell {
    padding: 9px 0;
  }

  .cell {
    padding: 0;
  }
}
:deep(.el-select-v2) {
  .el-select-v2__placeholder {
    color: #fff;
    font-size: 12px;
  }
  .el-select-v2__wrapper {
    background: transparent;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #2195a8;

    .el-select-v2__inner {
      font-size: 14px;
      color: #c8f1f9;
    }
  }
  .el-select-v2__selection .el-tag {
    background-color: #21b3b8;
    color: #fff;
    .el-tag__close {
      color: #000;
    }
  }
}
</style>
