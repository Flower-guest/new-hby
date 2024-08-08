<template>
  <div class="modal" v-if="attrs.show">
    <div class="box">
      <div class="title">
        人房信息查看
        <img
          loading="lazy"
          @click="updateShow"
          class="w-24px h-24px"
          :src="getAssets('gb3.png')"
        />
      </div>
      <div class="main">
        <!-- 房屋信息 -->
        <div class="flex-between-center mb-44px">
          <div class="flex-center" v-for="i in houseInfo" :key="i.prop">
            <div class="text-[#fff] text-20px font-extrabold">
              {{ i.label }}：
            </div>
            <div class="house-val">
              {{ state[i.prop] }}
            </div>
          </div>
          <div
            class="flex-center mr-18px"
            v-for="i in houseSort"
            :key="i.label"
          >
            <div class="text-[#fff] text-20px font-extrabold">
              {{ i.label }}：
            </div>
            <el-select
              v-model="state[i.prop]"
              placeholder="全部"
              :suffix-icon="IconDropDown"
              @change="
                () => {
                  state.pageNo = 1;
                  getVillagers();
                }
              "
              :clearable="true"
            >
              <!-- <el-option
                v-for="item in getDictOptions(i.type)"
                :key="item.value"
                :label="item.label"
                :value="parseInt(item.value)"
              /> -->
            </el-select>
          </div>
        </div>
        <!-- 表单 -->
        <div class="w-100%">
          <el-table
            border
            class="table"
            :data="state.tableData"
            :lazy="state.loading"
            :row-class-name="tableRowClassName"
            :header-cell-class-name="'table-head'"
          >
            <el-table-column :align="'center'" type="index" label="编号">
              <template #default="scope">
                <span>{{
                  (state.pageNo - 1) * state.pageSize + scope.$index + 1
                }}</span>
              </template>
            </el-table-column>
            <template v-for="i in tabList1" :key="i.prop">
              <el-table-column :align="'center'" :label="i.label">
                <template #default="{ row }">
                  {{
                    i?.type
                      ? getDictLabel(row.id)
                      : i?.maskType
                      ? maskNumber(i?.maskType, row[i.prop])
                      : row[i.prop]
                  }}
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <!-- 底部分页按钮 -->
        <div class="flex-between mt-48px">
          <span class="text-[#fff] text-24px font-extrabold"
            >统计人数：{{ state.total }}人</span
          >
          <el-pagination
            background
            layout="slot"
            :total="state.total"
            :page-size="state.pageSize"
            :current-page="state.pageNo"
            :hide-on-single-page="totalPage < 2"
            @current-change="changePage"
          >
            <div key="1" class="flex">
              <div class="pagination-btn" @click="changePage('prev')">
                上一页
              </div>
              <div class="pagination-btn mx-20px">
                <span class="text-[#C8F1F9]">{{ state.pageNo }}/</span
                ><span class="text-[#3E8999]">{{ totalPage }}</span>
              </div>
              <div class="pagination-btn" @click="changePage('next')">
                下一页
              </div>
            </div>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { maskNumber, getAssets } from "@/utils";
import { getDictLabel } from "@/utils/dict";
import IconDropDown from "@/components/IconDropDown/index.vue";
import { tabList1, houseInfo, houseSort } from "@/const/personModal";
import { GetDataByTypeId } from "@/service/api";

const attrs: any = useAttrs();

const state = reactive<any>({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  pageNo: 1, // 当前页
  pageSize: 8, // 分页大小
  fnum: 0, //关联对象
  building: "",
  gridName: "",
  groupName: "",
  politicalOrientation: "", //政治面貌
  familyProperty: "", //户属性
  labor: "", //劳动力情况
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

// 传参实时监听变化与赋值
watch(
  () => attrs.show,
  (newValue) => {
    console.log(newValue);
    // state.fnum = newValue.fnum;
    // if (newValue.dataName == "党员分布") {
    //   state.politicalOrientation = 1;
    // } else if (newValue.dataName == "低保户") {
    //   state.familyProperty = 3;
    // } else if (newValue.dataName == "无劳动力人士") {
    //   state.labor = 4;
    // }
    getVillagers();
  }
);

const getVillagers = async () => {
  if (state.fnum) {
    const res: any = await GetDataByTypeId(state);
    console.log(res);
    // state.tableData = res.list.reverse();
    // state.total = res.total;
    // if (!state.wg && state.tableData.length > 0) {
    //   state.gridName = state.tableData[0].gridName;
    //   state.building = state.tableData[0].building;
    //   state.groupName = state.tableData[0].groupName;
    // }
  }
};

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
const emit = defineEmits(["update:show"]);
const updateShow = () => {
  // 数据重置
  Object.assign(state, {
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    pageNo: 1, // 当前页
    pageSize: 8, // 分页大小
    fnum: 0, //关联对象
    gridName: "",
    groupName: "",
    politicalOrientation: "", //政治面貌
    familyProperty: "", //户属性
    labor: "", //劳动力情况
  });
  emit("update:show", false);
};
</script>

<style lang="less" scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: url("@/assets/img/bg-person-modal-build.png") no-repeat;
    background-size: 100% 100%;
    width: 1575px;
    height: 800px;

    .title {
      font-family: "USTitleBlack";
      font-size: 32px;
      color: #ffffff;
      margin: 15px 32px 0 63px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .main {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      padding: 39px 32px 51px;

      .house-val {
        width: 120px;
        padding: 4px 0 3px 8px;
        background-color: #052a32;
        font-size: 20px;
        color: #c8f1f9;
      }

      .house-sort {
        margin-top: 15px;
        margin-bottom: 22px;
        display: flex;
        align-items: center;
      }

      .pagination-btn {
        padding: 8px 24px;
        background: #051932;
        border: 1px solid #2179b8;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}

:deep(.datetimerange) {
  background: #052a32;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #21b3b8;
  .el-range-input {
    color: #c8f1f9;
  }
}
:deep(.el-select),
:deep(.el-date-editor) {
  min-width: 60px;

  .el-input__wrapper {
    background: #052a32;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #21b3b8;

    .el-input__inner {
      font-size: 14px;
      color: #c8f1f9;
    }
  }
}
:deep(.table) {
  width: 100%;
  height: 440px;
  background-color: transparent;

  --el-table-row-hover-bg-color: var(--el-transfer-border-color);

  .el-table__empty-block,
  .el-scrollbar {
    background-color: transparent;
    .el-table__empty-text {
      color: #fff;
    }
  }

  td.el-table__cell,
  th.el-table__cell.is-leaf {
    border-bottom: #2b7cb5;
  }

  .el-table__inner-wrapper::before {
    background-color: #2b7cb5;
  }

  .row1 {
    background-color: var(--modal-row1-bg);
    font-size: var(--modal-row-font-size);
    color: var(--modal-row-color);
  }

  .row2 {
    background-color: var(--modal-row2-bg);
    font-size: var(--modal-row-font-size);
    color: var(--modal-row-color);
  }

  .table-head {
    background-color: rgba(6, 66, 81);
    font-size: 22px;
    color: #ffffff;
  }
  .el-table__cell {
    padding: 9px;
  }
}
</style>
