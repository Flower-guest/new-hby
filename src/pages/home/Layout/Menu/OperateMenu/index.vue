<template>
  <!-- 场景切换选项 -->
  <div class="menuBox" v-if="toolMenus">
    <template v-if="props.eventType === 'checkboxGroup'">
      <div class="checkbox" v-for="(i, idx) in toolMenus" :key="idx">
        <el-checkbox
          v-model="i.check"
          :indeterminate="i.isInd"
          @change="handleChange(i, $event)"
          >{{ i.name }}</el-checkbox
        >
        <template v-if="i.childlist">
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCitiesChange(i, $event)"
          >
            <el-checkbox
              v-for="is in i.childlist"
              :key="is.id"
              :label="is.name"
              :value="is.id"
              >{{ is.name }}</el-checkbox
            >
          </el-checkbox-group>
        </template>
      </div>
    </template>
    <template v-else-if="props.eventType === 'checkbox'">
      <!-- 带全选按钮的 -->
      <div class="checkbox">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >全部</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="i in toolMenus"
            :key="i.id"
            :label="i.name"
            :value="i.id"
            >{{ i.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </template>
    <template v-else>
      <div
        v-for="i in toolMenus"
        :key="i.id"
        class="radio"
        :class="{ activeText: activeBtn == i.id ? true : false }"
        @click="handelRadio(i)"
      >
        {{ i.name }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface DetailProps {
  toolMenu: any; //tool菜单
  eventType: string; //类型：单选--多选
}
const props = defineProps<DetailProps>();

const activeBtn = ref<number | null>(null); //当前点击的按钮
const checkedCities = ref<any>([]); //选中的值
const cities: string[] = []; //选项值长度 用来判断是否全部选中
const toolMenus = ref<any>(); //菜单内容
const checkAll = ref<boolean>(false); //全部
const isIndeterminate = ref<boolean>(false); //中间状态

const jsonUrl: any = []; //外链json数据数组
const sceneCamera: any = []; //场景视角

let measure: any, mapEvent: any, modelAndImage: any, split: any;

const initMars = () => {
  measure = window.cesiumInit.measure;
  modelAndImage = window.cesiumInit.modelAndImage;
  mapEvent = window.cesiumInit.mapEvent;
  split = window.cesiumInit.split;
};

// 初始化数据
const initData = () => {
  toolMenus.value = props.toolMenu;
  if (props.eventType === "checkboxGroup") {
    toolMenus.value.forEach((i) => {
      i.isInd = false;
      i.check = false;
      i.cities = [];
      if (i.childlist.length > 0) {
        i.childlist.forEach((child) => {
          processItem(child);
          i.cities.push(child.id);
        });
      } else {
        i.cities.push(i.id);
      }
    });
  } else {
    toolMenus.value.forEach((i: any) => {
      processItem(i);
      cities.push(i.id);
    });
  }
};

// 定义一个辅助函数来处理单个对象
const processItem = (item) => {
  if (item.jsonurl) {
    jsonUrl.push({ url: item.jsonurl, id: item.id });
  }
  if (item.scene_camera) {
    sceneCamera.push({ camera: item.scene_camera, id: item.id });
  }
};

// 单选点击事件
const handelRadio = (i: DetailProps["toolMenu"]) => {
  // 当前页面点面实现共存 ，当有点时 在点击点数据 进行点数据删除再加载当前点击的点位数据 面数据同理
  activeBtn.value = activeBtn.value == i.id ? null : i.id;
  if (activeBtn.value) {
    mapEvent.flyToPoint(i.scene_camera);
    deleteGraphic([i.id], () => menuClick(i, [i.id]));
  } else {
    mapEvent.removeLayer(i.id, "id");
  }
};

// 菜单点击事件
// const emit = defineEmits(["handelMenu"]);
const menuClick = async (val, billArr: number[] = []) => {
  // 当菜单点击的时候 获取当前激活的菜单数据
  // emit("handelMenu");
  if (val.menu_type !== "dualViewSync") split.destroyControl();

  switch (val.menu_type) {
    case "measureMaster":
      measure.measureStart(val.handle_type, () => {
        activeBtn.value = 0;
      });
      break;
    case "tilesLoading":
      modelAndImage.addCesium3DTileSet(val);
      if (activeBtn.value) mapEvent.flyToPoint(val.scene_camera);
      break;
    case "dualViewSync": //分屏比对
      if (activeBtn.value) {
        split.createControl(val);
      }
      break;
    default:
      useLoadData(billArr);
      break;
  }
};

// 单个多选框 全选事件
const handleCheckAllChange = (val: boolean) => {
  checkedCities.value = val ? cities : [];
  isIndeterminate.value = false;
  deleteGraphic([cities], () => val && formatData(cities));
};

// 单个多选框 子集选择事件
const handleCheckedCitiesChange = (value: number[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
  deleteGraphic(value, () => formatData(value));
};

// 多个多选框 全选事件
const handleChange = (item, val: boolean) => {
  item.check = val;
  if (!val) item.isInd = val; //去除中间状态
  const childrenArray = item.cities;
  if (val) {
    checkedCities.value = childrenArray;
  } else {
    checkedCities.value = checkedCities.value.filter(
      (id) => !childrenArray.includes(id)
    );
  }
  deleteGraphic(
    checkedCities.value,
    () => {
      const citiesResult = item.cities.filter((item) =>
        checkedCities.value.includes(item)
      );
      formatData(citiesResult);
    },
    item.cities
  );
};

// 多个多选框 子集选择事件  i:父级当前对象  value:选中的值
const handleCitiesChange = (i, value: string[]) => {
  const includeResult = i.cities.filter((id) => value.includes(id));
  i.check = includeResult.length === i.cities.length;
  i.isInd = includeResult.length > 0 && includeResult.length < i.cities.length;
  deleteGraphic(value, () => formatData(includeResult), i.cities);
};

// 加载数据与对应的视角
const formatData = (value) => {
  const jsonResult = jsonUrl.filter((item) => value.includes(item.id)); //外链地址
  const cameraResult =
    sceneCamera.filter((item) => value.includes(item.id)).pop() || null; //视角
  mapEvent.flyToPoint(cameraResult);
  useLoadData(value, jsonResult);
};

/**
 * 删除指定图层数据
 * @param checkArray :选中的菜单id数组
 * @param ck :回调函数
 * @param fArray: 所选菜单下的所有可选子集id
 */
const deleteGraphic = (checkArray, ck, fArray = cities) => {
  // 使用filter方法过滤出不在checkArray中的元素
  const excludeResult = fArray.filter((item) => !checkArray.includes(item));
  excludeResult.forEach((item) => {
    mapEvent.removeLayer(item, "id");
    window.cesiumInit.divGraphic.removeLayer(item);
  });
  ck();
};

onMounted(() => {
  initMars();
  initData();
});
</script>

<style lang="less" scoped>
.menuBox {
  margin-top: -24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  color: var(--menu-menuBox-color);
  width: 164px;
  padding: 14px 14px 8px;
  background: url("@/assets/img/sugges-list-bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20px;
  :deep(.checkbox) {
    .el-checkbox-group {
      margin-left: 13px;
    }
    .is-indeterminate {
      background-color: transparent;
      border-color: #13879c;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      background-color: #00ffff;
    }
    .el-checkbox {
      color: #fff;
      .el-checkbox__inner {
        background-color: transparent;
        border-color: #13879c;
      }
    }
    .is-checked {
      .el-checkbox__label {
        color: #fff;
      }
      .el-checkbox__inner {
        background-color: transparent;
        border-color: #13879c;
      }
      .el-checkbox__inner::after {
        border: 1px solid #00ffff;
        border-left: 0;
        border-top: 0;
      }
    }
  }
  .radio {
    width: 100%;
    text-align: center;
    cursor: pointer;
    padding: 8px 0;
    font-size: 14px;
    color: #fff;
    position: relative;
    &:hover::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 100%;
      height: 8px;
      background: url("@/assets/img/icon_gy.png") no-repeat left center/100%
        auto;
    }
  }
  .activeText {
    color: var(--menu-activeText-color) !important;
  }
}
</style>
