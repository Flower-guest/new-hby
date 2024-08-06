<template>
  <div class="modal" v-show="attrs.show">
    <div class="box">
      <div class="title">
        {{ state.villagerData?.[0]?.groupName }}
        <img
          loading="lazy"
          @click="updateShow"
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
          <CustomTable
            :data="state.villagerData"
            :tableList="tabList"
            :lazy="state.loading"
            :total="state.total"
            :page-size="state.pageSize"
            :current-page="state.pageNo"
            @current-change="changePage"
            @changePage="changePage"
          />
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
import {
  // maskNumber,
  getAssets,
} from "@/utils";
// import { getDictLabel } from "@/utils/dict";
import { tabList } from "@/const/personModal";
// import { GetDataByTypeId } from "@/service/api";
import { rowList } from "@/const/tableInfo";

const attrs: any = useAttrs();

const titleTabActive = ref("l"); //tab切换

const bgConfig = computed(() => (i) => {
  return titleTabActive.value == i
    ? `url(${getAssets(`btn-person-${i}-active.png`)})`
    : `url(${getAssets(`btn-person-${i}.png`)}`;
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

// 传参实时监听变化与赋值
watch(
  () => attrs.show,
  (newValue) => {
    getVillagers(newValue);
    getBuilding();
  }
);

// 获取人口信息
const getVillagers = async (val) => {
  // const res: any = await GetDataByTypeId({
  //   type: val.dataType,
  //   id: val.dataValue,
  // });
  const res = {
    list: [
      {
        name: "李四",
        gender: 0,
        idNumber: "string",
        isPartyMember: 0,
        isKeyFocusGroups: 0,
        isThisVillageVillagers: 0,
        age: 0,
        maritalStatus: 2,
        childrenNumber: 0,
        workingStatus: 1,
        phoneNumber: "string",
        tel: "string",
        fileNum: "string",
        fnum: 0,
        building: "string",
        floor: "string",
        houseNumber: "string",
        registeredResidence: "string",
        school: "string",
        job: "string",
        skill: "string",
        health: "string",
        vegetableField: "string",
        isLeftChild: 0,
        isFarmerSubsidy: 0,
        isSafeWater: 0,
        yearOutpoor: "string",
        poorReason: "不喜欢",
        propertyOutpoor: "string",
        poorAccount: "23590",
        helpPerson: "string",
        helpIndustry: "string",
        imagePerson: ["string"],
        remarks: "string",
        gridName: "芋艿",
        groupName: "李四",
        politicalOrientation: "string",
        post: "string",
        educationLevel: "string",
        labor: "string",
        socialSecurity: "string",
        relationshipHuzhu: "string",
        familyProperty: "string",
        persionSituation: "string",
        showLevel: 0,
        id: 7422,
      },
    ],
    total: 0,
  };
  state.villagerData = res.list;
  state.total = res.total;
  console.log(val, res);
};
// 获取房屋信息
const getBuilding = async () => {
  const res = [
    {
      dataType: "2",
      fnum: 0,
      mapElementsName: "王五",
      x: "string",
      y: "string",
      storeyNo: 0,
      addressNo: "string",
      assetNo: "string",
      assetName: "芋艿",
      assetType: "1",
      assetUsage: "string",
      rentalIntention: 0,
      houseTypeBuild: 0,
      address: "string",
      buildingStructure: "string",
      occupyingArea: 0,
      yearBuilt: "string",
      isLift: "string",
      buildingType: "1",
      floorSpace: 0,
      assetStatus: 1,
      buildingOrientation: "string",
      ownerName: "赵六",
      ownerId: "12526",
      assetCertificateNumber: "string",
      investmentStatus: 1,
      listingPrice: 24052,
      merchantsMode: "string",
      floor: 0,
      decorationStatus: "1",
      usageDescribe: "string",
      lookNumber: 0,
      contacts: "string",
      telephone: "string",
      transactionPrice: 16410,
      expirationTime: "2019-08-24T14:15:22Z",
      locationDescription: "你猜",
      panoramicAddress: "string",
      videoAddress: "string",
      assetImage: ["string"],
      landType: "2",
      houseType: "1",
      investmentPromotionTime: "2019-08-24T14:15:22Z",
      remarks: "string",
      gridName: "赵六",
      groupName: "李四",
      titleInvestment: "string",
      tagInvestment: "string",
      buildingTypeOther: "string",
      showLevel: 0,
      id: 2163,
      createTime: "2019-08-24T14:15:22Z",
    },
  ];
  // const res: any = await GetDataByTypeId({
  //   type: "asset",
  //   id: 1,
  // });
  state.buildingData = res[0];
};

const changePage = (val, totalPage = null) => {
  if (val == "prev") {
    if (state.pageNo < 2) return (state.pageNo = 1);
    state.pageNo--;
  } else {
    if (state.pageNo > totalPage - 1) return;
    state.pageNo++;
  }
  getVillagers({});
};

const emit = defineEmits(["update:show", "showWebView"]);

// 全景按钮点击
const vrClick = (vrUrl) => {
  emit("showWebView", vrUrl);
};

const updateShow = () => {
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
