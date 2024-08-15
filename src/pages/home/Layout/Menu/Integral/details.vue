<template>
  <div class="modal z-100" v-if="show">
    <div class="box">
      <div class="title">
        {{ props.jfInfo.memberName }}
        <img
          loading="lazy"
          @click="updateShowDetail"
          class="w-22px h-22px"
          :src="getAssets('gb3.png')"
        />
      </div>
      <div class="main" style="padding-bottom: 22px">
        <!-- 排行方式 -->
        <div class="house-sort">
          <!-- 月份 -->
          <div class="flex-center ml-18px">
            <div class="text-[#fff] text-24px font-extrabold">月份：</div>
            <el-config-provider :locale="zhCn">
              <el-date-picker
                @change="changeRank"
                v-model="state.meritPointDate"
                :disabled-date="disabledMonthDate"
                type="month"
                placeholder="选择月份"
                value-format="YYYY-MM"
              />
            </el-config-provider>
          </div>
        </div>
        <!-- 表单 -->
        <el-table
          class="table"
          :data="state.tableData"
          :row-class-name="tableRowClassName"
          :header-cell-class-name="'table-head'"
        >
          <template v-for="i in detailList" :key="i.prop">
            <el-table-column
              :align="'center'"
              :prop="i.prop"
              :label="i.label"
              :width="i?.width ?? null"
            >
              <template #default="{ row }">
                {{
                  i?.prop !== "meritPointValue"
                    ? row[i.prop]
                    : parseInt(row[i.prop]) > 0
                    ? "+" + row[i.prop]
                    : "-" + row[i.prop]
                }}
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { getAssets } from "@/utils";
import { detailList } from "@/const/integrakModal";
import { postDetailList } from "@/service/api/jifenzhi-api";
import { getJFInfoKey } from "@/utils/auth";
import { ElConfigProvider } from "element-plus";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
interface detailProps {
  show: boolean;
  jfInfo: any;
}
const props = defineProps<detailProps>();
const currentYearAndMonth = dayjs().format("YYYY-MM");
const state = reactive<any>({
  tableData: [], // 数据列表
  orgId: getJFInfoKey()?.orgId, //组织Id
  curpage: 1, // 当前页
  pagesize: 100, // 分页大小
  memberId: "",
  meritPointDate: currentYearAndMonth,
});

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 == 1) {
    return "row1";
  } else {
    return "row2";
  }
};

// 传参实时监听变化与赋值
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      state.memberId = props.jfInfo.memberId;
      postRanking();
    }
  }
);

// 获取分类列表
const postRanking = async () => {
  let res: any = await postDetailList(state);
  state.tableData = res.object.pageContent;
};

// 指定值改变事件
const changeRank = () => {
  state.curpage = 1;
  postRanking();
};

const disabledMonthDate = (time: Date) => {
  const threeMonthsAgo = new Date();
  const threeMonthsBef = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
  threeMonthsBef.setMonth(threeMonthsBef.getMonth());
  // 禁用选择三个月前以前的日期
  return (
    time.getTime() < threeMonthsAgo.getTime() ||
    time.getTime() > threeMonthsBef.getTime()
  );
};

const reset = () => {
  Object.assign(state, {
    tableData: [], // 数据列表
    curpage: 1, // 当前页
    pagesize: 10, // 分页大小
    memberId: "",
    meritPointDate: currentYearAndMonth,
  });
};

const emit = defineEmits(["update:showDetail"]);
const updateShowDetail = () => {
  reset();
  emit("update:showDetail", false);
};
</script>

<style lang="less" scoped>
@import "./com.less";
</style>
