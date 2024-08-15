<template>
  <div class="modal" v-if="show">
    <div class="box">
      <div class="title">
        积分排行榜
        <img
          loading="lazy"
          @click="updateShow"
          class="w-22px h-22px"
          :src="getAssets('gb3.png')"
        />
      </div>
      <div class="main">
        <!-- 排行方式 -->
        <div class="house-sort">
          <div class="flex-center mr-18px" v-for="i in rank" :key="i.label">
            <div class="text-[#fff] text-18px font-extrabold">
              {{ i.label }}：
            </div>
            <el-select
              v-model="rank.val"
              placeholder="总积分"
              @change="rankChange"
              :suffix-icon="IconDropDown"
            >
              <el-option
                v-for="item in i.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- 区间月份 -->
            <div class="flex-center ml-18px" v-show="rank.val == '1'">
              <div class="text-[#fff] text-24px font-extrabold">区间排行：</div>
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  v-model="state.monthArr"
                  @change="changeRank"
                  :disabled-date="disabledMonthDate"
                  class="datetimerange"
                  type="monthrange"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  value-format="YYYY-MM"
                />
              </el-config-provider>
            </div>
            <!-- 月份 -->
            <div class="flex-center ml-18px" v-show="rank.val == '2'">
              <div class="text-[#fff] text-24px font-extrabold">月份：</div>
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  @change="changeRank"
                  v-model="state.month"
                  :disabled-date="disabledMonthDate"
                  type="month"
                  placeholder="选择月份"
                  value-format="YYYY-MM"
                />
              </el-config-provider>
            </div>
          </div>
        </div>
        <!-- 表单 -->
        <el-table
          class="table"
          @row-click="rowClick"
          :data="state.tableData"
          :row-class-name="tableRowClassName"
          :header-cell-class-name="'table-head'"
        >
          <el-table-column
            :align="'center'"
            width="360"
            type="index"
            label="排名"
          >
            <template #default="scope">
              <img
                loading="lazy"
                class="w-53px h-22px"
                v-if="ranking(scope) < 4"
                :src="getAssets(`jf${ranking(scope)}.png`)"
              />
              <span v-else>{{ ranking(scope) }}</span>
            </template>
          </el-table-column>
          <template v-for="i in tabList" :key="i.prop">
            <el-table-column
              :align="'center'"
              :prop="i.prop"
              :label="i.label"
            />
          </template>
        </el-table>
        <!-- 底部分页按钮 -->
        <div class="flex-between-center mt-32px">
          <span class="text-[#fff] text-22px font-extrabold"
            >统计人数：{{ state.sum }}人</span
          >
          <el-pagination
            background
            layout="slot"
            :total="state.sum"
            :page-size="state.pagesize"
            :current-page="state.curpage"
            :hide-on-single-page="sumPage < 2"
            @current-change="changePage"
          >
            <div key="1" class="flex">
              <div class="pagination-btn" @click="changePage('prev')">
                上一页
              </div>
              <div class="pagination-btn mx-20px">
                <span class="text-[#C8F1F9]">{{ state.curpage }}/</span
                ><span class="text-[#3E8999]">{{ sumPage }}</span>
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
  <Details v-model:show="showDetail" :jf-info="jfInfo" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import Details from "./details.vue";
import IconDropDown from "@/components/IconDropDown/index.vue";
import { getAssets } from "@/utils";
import { tabList, rankMethod } from "@/const/integrakModal";
import * as jfRequest from "@/service/api/jifenzhi-api";
import { getJFInfoKey, setJFKey, setJFInfoKey } from "@/utils/auth";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

defineProps<{ show: boolean }>();

const currentYearAndMonth = dayjs().format("YYYY-MM");
const rank = ref<any>(rankMethod);
const showDetail = ref<boolean>(false);
const jfInfo = ref<any>("");
const state = reactive({
  tableData: [], // 数据列表
  orgId: "", //组织Id
  rankId: "", //排行榜Id
  sum: 0, // 总条数
  curpage: 1, // 当前页
  pagesize: 10, // 分页大小
  rankWayType: "standard",
  type: "0",
  month: currentYearAndMonth,
  monthArr: [],
});

onMounted(() => {
  const info = getJFInfoKey();
  if (!info?.orgId) {
    getJFData();
  } else {
    state.orgId = info.orgId;
    state.orgId = info.rankId;
  }
  if (state.orgId) postRanking();
});

// 获取积分相关数据
const getJFData = async () => {
  const jfData = {
    username: "15197760675",
    password: "dyj535395",
    areaCode: 86,
  };
  try {
    const jfToken: any = await jfRequest.postJFToken(jfData);
    if (!jfToken.object.access_token) return;
    setJFKey(jfToken.object.access_token);
    const orgInfo: any = await jfRequest.postJFOrgList();
    const rankInfo: any = await jfRequest.postJFRankList({
      orgId: orgInfo.object[0].orgId,
      equipmentFlag: 0,
      type: 0,
      rankWayType: "standard",
    });
    state.orgId = orgInfo.object[0].orgId;
    state.orgId = rankInfo.object[0].id;
    setJFInfoKey({
      orgId: orgInfo.object[0].orgId,
      rankId: rankInfo.object[0].id,
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 == 1) {
    return "row1";
  } else {
    return "row2";
  }
};

// 排名
const ranking = computed(() => (scope) => {
  return (state.curpage - 1) * state.pagesize + scope.$index + 1;
});
// 总页数
const sumPage = computed(() => {
  return Math.ceil(state.sum / state.pagesize);
});

// 获取分类列表
const postRanking = async () => {
  let res: any;
  switch (rank.value.val) {
    case "2": //月积分
      res = await jfRequest.postPointsRanking(state);
      break;
    case "1": //区间积分
      res = await jfRequest.postStagePointsRanking({
        ...state,
        monthStart: state.monthArr[0],
        monthEnd: state.monthArr[1],
      });
      break;
    default: //总积分
      res = await jfRequest.postTotalPointsRanking(state);
      break;
  }
  state.tableData = res.object.pageContent;
  state.sum = res.object.sum;
};

// 指定值改变事件
const changeRank = () => {
  state.curpage = 1;
  if (state.month || state.monthArr.length > 0) {
    postRanking();
  }
};

// 下拉菜单值变更
const rankChange = () => {
  reset();
  rank.value.val !== "1" && postRanking();
};

// 分页按钮点击
const changePage = (val) => {
  if (val == "prev") {
    if (state.curpage < 2) return (state.curpage = 1);
    state.curpage--;
  } else {
    if (state.curpage > sumPage.value - 1) return;
    state.curpage++;
  }
  postRanking();
};

// 点击的行触发事件
const rowClick = (row) => {
  showDetail.value = true;
  jfInfo.value = row;
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
    sum: 0, // 总条数
    curpage: 1, // 当前页
    pagesize: 10, // 分页大小
    rankWayType: "standard",
    type: "0",
    month: currentYearAndMonth,
    monthArr: [],
  });
};

const emit = defineEmits(["update:show"]);
const updateShow = () => {
  emit("update:show", false);
};
</script>

<style lang="less" scoped>
@import "./com.less";
</style>
