<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-11-23 16:25:47
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-28 11:21:02
 * @FilePath: \map-platform\src\pages\pc\com\personRoomFormModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="modal" v-if="showPerson">
    <div class="box">
      <div class="title">
        {{ state.villagerData?.[0]?.groupName }}
        <img
          loading="lazy"
          @click="updateShowPerson"
          class="w-48px h-48px"
          :src="getAssets('gb5.png')"
          alt="关闭"
        />
      </div>
      <div class="main">
        <!-- 房屋信息 -->
        <div class="main-title">
          <div
            class="title-btn"
            @click="titleTabActive = 'l'"
            :style="{ backgroundImage: bgConfig('l') }"
          >
            人口信息
          </div>
          <div
            class="title-btn"
            @click="titleTabActive = 'r'"
            :style="{ backgroundImage: bgConfig('r') }"
          >
            房屋信息
          </div>
        </div>
        <!-- 人口信息 -->
        <div v-show="titleTabActive == 'l'">
          <div class="table h-380px">
            <div class="table-head">
              <div class="table-tr">
                <span
                  v-for="i in tabList"
                  :key="i.label"
                  class="table-th rel"
                  :style="{ width: widthTD }"
                  >{{ i.label }}</span
                >
              </div>
            </div>
            <div class="table-body">
              <template v-if="state.villagerData.length > 0">
                <div
                  class="table-tr mt-9px py-16px"
                  v-for="i in state.villagerData"
                  :key="i.name"
                >
                  <div
                    class="table-td"
                    :style="{ width: widthTD }"
                    v-for="j in tabList"
                    :key="j.label"
                  >
                    <div class="name-item">
                      {{
                        j?.type
                          ? getDictLabel(j.type, i[j.prop])
                          : j?.maskType
                          ? maskNumber(j?.maskType, i[j.prop])
                          : i[j.prop]
                      }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="text-[#33f7ff] text-center text-[24px] mt-20px">
                  暂无数据
                </div>
              </template>
            </div>
          </div>
          <!-- 底部分页按钮 -->
          <div class="flex justify-center mt-20px">
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
                <div class="pagination-pageNo mx-15px">
                  <span class="text-[#3E8999]">{{ state.pageNo }}/</span
                  ><span class="text-[#C8F1F9]">{{ totalPage }}</span>
                </div>
                <div class="pagination-btn" @click="changePage('next')">
                  下一页
                </div>
              </div>
            </el-pagination>
          </div>
        </div>
        <!-- 房屋信息 -->
        <div v-show="titleTabActive == 'r'">
          <div class="flex-between px-7px pt-18px pb-29px">
            <div class="home-l">
              <el-carousel
                class="w-100%"
                height="auto"
                indicator-position="none"
              >
                <template v-if="state.buildingData">
                  <el-carousel-item
                    class="carousel_item"
                    v-for="j in state.buildingData.assetImage"
                    :key="j"
                  >
                    <div class="relative w-100% h-100%">
                      <img
                        loading="lazy"
                        class="w-100% h-100%"
                        :src="j"
                        alt="icon"
                      />
                      <img
                        loading="lazy"
                        class="qj_icon"
                        alt="icon"
                        v-show="
                          state.buildingData.panoramicAddress ? true : false
                        "
                        :src="getAssets('icon-qj.png')"
                        @click="vrClick(state.buildingData.panoramicAddress)"
                      />
                    </div>
                  </el-carousel-item>
                </template>
                <template v-else>
                  <el-carousel-item class="carousel_item">
                    <img
                      loading="lazy"
                      class="w-100% h-100%"
                      :src="getAssets('person-no-img.png')"
                      alt="信息提示"
                    />
                  </el-carousel-item>
                </template>
              </el-carousel>
            </div>
            <div class="home-r">
              <RowTab :row-list="rowList.baseInfo" :data="state.buildingData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { maskNumber, getAssets } from "@/utils";
import { getDictLabel } from "@/utils/dict";
import { tabList } from "@/const/personModal";
import { getVillager, getBuildingManagement } from "@/service/api/admin-api";
import { rowList } from "@/const/tableInfo";

interface detailProps {
  showPerson: boolean;
  personProp: any;
}
const props = defineProps<detailProps>();
const showPerson = toRef(props, "showPerson"); //是否显示弹窗
const titleTabActive = ref("l"); //tab切换

const bgConfig = computed(() => (i) => {
  return titleTabActive.value == i
    ? `url(${getAssets(`btn-person-${i}-active.png`)})`
    : `url(${getAssets(`btn-person-${i}.png`)}`;
});
const widthTD = computed(() => {
  //计算属性传递参数
  return 100 / tabList.length + "%";
});

const state = reactive<any>({
  loading: false,
  villagerData: [], // 人信息数据列表
  buildingData: {}, // 房屋资产数据列表
  total: 0, // 总条数
  pageNo: 1, // 当前页
  pageSize: 5, // 分页大小
  fnum: 0, //关联对象
});

// 总页数
const totalPage = computed(() => Math.ceil(state.total / state.pageSize));

// 传参实时监听变化与赋值
watch(
  () => props.personProp,
  async (newValue) => {
    state.fnum = newValue.fnum;
    if (state.fnum) {
      await getVillagers();
      await getBuilding();
    }
  }
);

// 获取人口信息
const getVillagers = async () => {
  const res: any = await getVillager(state);
  state.villagerData = res.list.reverse();
  state.total = res.total;
};
// 获取房屋信息
const getBuilding = async () => {
  const res: any = await getBuildingManagement(state);
  state.buildingData = res[0];
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

const emit = defineEmits(["update:showPerson", "showWebView"]);

// 全景按钮点击
const vrClick = (vrUrl) => {
  emit("showWebView", vrUrl);
};

const updateShowPerson = () => {
  // 数据重置
  Object.assign(state, {
    loading: false,
    villagerData: [],
    buildingData: {},
    total: 0,
    pageNo: 1,
    pageSize: 5,
    fnum: 0,
  });
  titleTabActive.value = "l";
  emit("update:showPerson", false);
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
    background: url("@/assets/img/bg-person-modal.png") no-repeat;
    background-size: 100% 100%;
    width: 1149px;
    height: 563px;

    .title {
      font-family: "USTitleBlack";
      font-size: 39px;
      color: #ffffff;
      margin: 13px 0 0;
      text-align: center;
      img {
        position: absolute;
        right: -16px;
        top: 27px;
      }
    }

    .main {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      padding: 0 23px 20px;

      .main-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 13px;
        margin-left: 106px;
        margin-right: 106px;
        color: #c8f1f9;
        font-size: 18px;
        font-weight: 800;
        .title-btn {
          background-repeat: no-repeat;
          background-size: 100%;
          padding: 7px 48px 5px;
        }
      }

      .table {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 18px;
        color: #c8f1f9;
        .table-tr {
          display: flex;
          background: #132326;
          box-shadow: inset 0px 0px 16px 1px #33f7ff;
          .table-th {
            padding: 16px 0;
          }
          .rel {
            position: relative;
          }
        }
        .table-body {
          flex: 1;
          overflow: hidden;
          .table-tr:hover {
            background: #1f8d99 !important;
            box-shadow: inset 0px 0px 12px 1px #33f7ff;
          }
          .table-td {
            .name-item {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .home-l {
        width: 412px;
        height: 412px;
        box-sizing: border-box;
        background: url("@/assets/img/bg-person-swiper.png") no-repeat;
        background-size: 100% 100%;
        padding: 12px;
        .carousel_item {
          width: 388px;
          height: 388px;
        }
        :deep(.el-carousel) {
          .el-carousel__arrow {
            background-color: rgba(46, 74, 77, 0.7);
          }
        }
      }

      .home-r {
        width: 650px;
        height: 412px;
        box-sizing: border-box;
        padding: 24px 32px;
        background: url("@/assets/img/bg-person-info.png") no-repeat;
        background-size: 100% 100%;
        .row {
          height: 324px;
        }
      }

      .pagination-btn {
        padding: 8px 24px;
        background: #143944;
        border: 1px solid #2195a8;
        color: #fff;
        cursor: pointer;
      }
      .pagination-pageNo {
        font-size: 18px;
        padding: 8px 29px;
        background: #132326;
        border: 1px solid #2179b8;
      }
    }
  }
}

:deep(.el-select) {
  width: 120px;

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
</style>
@/const/tableInfo
