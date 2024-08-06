<template>
  <div>
    <!-- 表单 -->
    <div class="w-100%">
      <el-table
        class="table"
        :row-class-name="tableRowClassName"
        :header-cell-class-name="'table-head'"
        v-attr="attrs"
      >
        <!-- <el-table-column :align="'center'" width="60" type="index" label="序号">
          <template #default="scope">
            <span>{{
              (attrs.pageNo - 1) * attrs.pageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column> -->
        <template v-for="i in attrs.tableList" :key="i.prop">
          <el-table-column :align="'center'" :label="i.label">
            <!-- <template #default="{ row }">
              {{ i?.type ? getDictLabel(i.type, row[i.prop]) : row[i.prop] }}
            </template> -->
          </el-table-column>
        </template>
      </el-table>
    </div>
    <!--分页按钮  -->
    <div class="flex-between-center mt-40px">
      <span class="text-[#fff] text-16px font-extrabold"
        >统计人数：{{ attrs.total }}人</span
      >
      <el-pagination
        background
        layout="slot"
        :hide-on-single-page="totalPage < 2"
        v-attr="attrs"
      >
        <div key="1" class="flex">
          <div class="pagination-btn" @click="attrs.changePage('prev')">上一页</div>
          <div class="pagination-btn mx-15px">
            <span class="text-[#C8F1F9]">{{ attrs.pageNo }}/</span
            ><span class="text-[#3E8999]">{{ totalPage }}</span>
          </div>
          <div class="pagination-btn" @click="attrs.changePage('next',totalPage)">下一页</div>
        </div>
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
// interface detailProps {
//   tableList: any; //循环表格列表
//   height?: number; //列表高度
//   tabTitle: string; //tab栏标题
//   total: number; // 总条数
//   pageNo: number; // 当前页
//   pageSize: number; // 分页大小
// }

// const props = withDefaults(defineProps<detailProps>(), {
//   height: 300,
//   total: 0, // 总条数
//   pageNo: 1, // 当前页
//   pageSize: 10, // 分页大小
// });

const attrs: any = useAttrs();

// 斑马条纹样式
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 == 1) {
    return "row1";
  } else {
    return "row2";
  }
};

// 总页数
const totalPage = computed(() => Math.ceil(attrs.total / attrs.pageSize));

// const emit = defineEmits(["changePage"]);
// 分页按钮点击事件
// const changePage = (val) => {
//   let pageNo = attrs.pageNo;
//   if (val === "prev") {
//     if (pageNo < 2) return emit("changePage", 1);
//     emit("changePage", pageNo++);
//   } else if (val === "next") {
//     if (pageNo > totalPage.value - 1) return;
//     emit("changePage", pageNo--);
//   }
// };
</script>

<style lang="less" scoped>
.pagination-btn {
  padding: 6px 18px;
  background: #143944;
  border: 1px solid #2195a8;
  color: #fff;
  cursor: pointer;
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
</style>
