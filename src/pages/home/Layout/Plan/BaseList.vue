<template>
  <!-- tab栏与标题 -->
  <div class="mt-20px">
    <div class="main-title flex-between">
      <span>{{ data.title }}</span>
      <div class="flex justify-end">
        <template v-for="i in state.typeList" :key="i.key">
          <div
            @click="changeType(i.key)"
            class="cursor-pointer mt-6px ml-23px text-14px"
          >
            <div :class="{ activeItem: state.category == i.key }">
              {{ i.value }}
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
        @change="changeStatus"
        :clearable="true"
      >
        <el-option
          v-for="item in state.statusList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
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
    <template v-if="state.list.length > 0">
      <div
        class="item"
        :style="{
          backgroundColor: clickItem == i.id ? 'rgba(51,116,128,0.8)' : '',
        }"
        v-for="i in state.list"
        :key="i.id"
        @click="getById(i.id)"
      >
        <img
          loading="lazy"
          class="w-80px h-80px mr-8px"
          alt="缩略图"
          :src="
            getServeImg(i.thumbnail.split(',')[0]) ??
            getAssets('default_thumb.jpg')
          "
        />
        <div class="flex flex-col text-12px">
          <span class="text-18px text-[#fff] mb-6px">{{ i.name }}</span>
          <span class="color85"
            >登记时间：{{ i.project_registration_date }}</span
          >
          <span class="color85 my-5px">占地面积：{{ i.plan_area }}㎡</span>
          <div class="color85">
            价格：<span class="text-[#BFC52E]"
              >{{ i.project_budget || "面议"
              }}{{ i.project_budget ? "元" : "" }}</span
            >
          </div>
        </div>
        <div :class="['status', statusBg(i.project_status)]">
          <span class="text-12px">{{ statusLabel(i.project_status) }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center mt-100px">暂无数据</div>
    </template>
  </div>
  <!--分页按钮  -->
  <div class="flex-between-center mt-20px">
    <span class="text-[#fff] text-16px font-extrabold">{{
      "总计：" + state.total
    }}</span>
    <el-pagination
      background
      layout="slot"
      :hide-on-single-page="totalPage < 2"
      :total="state.total"
      :page-size="state.size"
      :current-page="state.page"
      @current-change="changePage"
    >
      <div key="1" class="flex">
        <div class="pagination-btn" @click="changePage('prev', totalPage)">
          上一页
        </div>
        <div class="pagination-btn mx-15px">
          <span class="text-[#C8F1F9]">{{ state.page }}/</span
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
import {
  GetInvestmentType,
  GetInvestmentList,
  GetInvestmentById,
  GetBuiltProjectType,
  GetBuiltProjectList,
  GetBuiltProjectById,
} from "@/service/api";
import { workerFormat } from "@/hooks/useLoadData";
import { getAssets, getServeImg, toObjArray } from "@/utils";

const props = defineProps<{ data: any }>();
const type = props.data.data_model;
const clickItem = ref<number>();
const state = reactive<any>({
  list: [],
  statusList: [],
  typeList: [],
  category: 0, //当前激活的分类
  height: 520,
  status: "",
  name: "",
  page: 1,
  size: 10,
  total: 0, // 总条数
});

// 状态对应的文字
const statusLabel = computed(() => (status) => {
  return state.statusList.find((i: any) => i.key === status + "").value;
});

const statusMap = {
  "1": "bg-[#2EAEC5]",
  "2": "bg-[#BFC52E]",
  "94": "bg-[#2EAEC5]",
  "95": "bg-[#f75444]",
  "96": "bg-[#18bc9c]",
  "97": "bg-[#BFC52E]",
};
// 状态背景颜色
const statusBg = computed(() => (status) => {
  return statusMap[status];
});

// 总页数
const totalPage = computed(() => Math.ceil(state.total / state.size));

onMounted(async () => {
  await getType();
  await getList();
});

// 获取状态与分类数据
const getType = async () => {
  try {
    const typeRes =
      type === "invesList"
        ? await GetInvestmentType()
        : await GetBuiltProjectType();
    state.statusList = toObjArray(typeRes.statusList);
    state.typeList = toObjArray(typeRes.typeList);
    state.category = state.typeList[0].key;
  } catch (error) {
    console.log(error);
  }
};

// 获取列表
const getList = async () => {
  try {
    const listRes =
      type === "invesList"
        ? await GetInvestmentList(state)
        : await GetBuiltProjectList(state);
    state.list = listRes.data;
    state.total = listRes.total;
  } catch (error) {
    console.log(error);
  }
};

// 切换类型
const changeType = async (key) => {
  state.name = "";
  state.status = "";
  state.page = 1;
  state.category = key;
  getList();
};

// 状态修改
const changeStatus = async (value) => {
  state.status = value || "";
  state.page = 1;
  getList();
};

// 搜索
const search = async () => {
  state.page = 1;
  getList();
};

// 分页按钮点击事件
const changePage = (val, totalPage) => {
  if (val == "prev") {
    if (state.page < 2) return (state.page = 1);
    state.page--;
  } else {
    if (state.page > totalPage - 1) return;
    state.page++;
  }
  getList();
};

// 点击列表展示弹窗信息
const handelInfoDialog: any = inject("handelInfoDialog");
const getById = async (id: number) => {
  // 清除地图上现有的点位和线面
  const { divGraphic, primitiveLoader } = window.cesiumInit;
  divGraphic.deleteDivGraphic();
  primitiveLoader.deleteFn();

  // 如果点击同一个项目，取消选中并关闭弹窗
  if (id === clickItem.value) {
    clickItem.value = -1;
    handelInfoDialog("", false);
    return;
  }

  // 设置新的点击项
  clickItem.value = id;

  // 根据类型设置数据类型和标记类型
  const { dataType, markerType } = getDataTypeAndMarkerType(type);

  // 显示弹窗信息
  handelInfoDialog({ dataType, markerType, dataValue: id });

  try {
    const response = await fetchDataById(id, type);
    if (response) {
      const { gis_menu_id, gis_spot } = response;
      workerFormat({
        type: "loadListData",
        menuId: gis_menu_id,
        findIdArr: [gis_spot],
      });
    }
  } catch (error) {
    console.error("Failed to fetch data by ID:", error);
  }
};

const getDataTypeAndMarkerType = (type: string) => {
  switch (type) {
    case "invesList":
      return { dataType: "investment", markerType: "investment" };
    case "assetsList":
      return { dataType: "asset", markerType: "investment" };
    default:
      return { dataType: "builtproject", markerType: "build" };
  }
};

const fetchDataById = async (id: number, type: string) => {
  if (type === "invesList") {
    return await GetInvestmentById(id);
  } else if (type === "builtproject") {
    return await GetBuiltProjectById(id);
  }
  return null;
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
    padding: 0 8px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .status {
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
