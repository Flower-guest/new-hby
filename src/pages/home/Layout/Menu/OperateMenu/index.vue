<template>
  <!-- 场景切换选项 -->
  <div class="menuBox">
    <template v-if="props.eventType === 'checkboxGroup'">
      <div class="checkbox" v-for="(menu, idx) in toolMenus" :key="idx">
        <el-checkbox
          v-model="menu.check"
          :indeterminate="menu.isInd"
          @change="handleCheckboxGroupChange(menu, $event)"
          >{{ menu.name }}</el-checkbox
        >
        <el-checkbox-group
          v-if="menu.childlist"
          v-model="checkedCities"
          @change="handleChildlistChange(menu, $event)"
        >
          <el-checkbox
            v-for="child in menu.childlist"
            :key="child.id"
            :label="child.name"
            :value="child.id"
            >{{ child.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </template>
    <template v-else-if="props.eventType === 'checkbox'">
      <!-- 带全选按钮的 -->
      <div class="checkbox">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="toggleCheckAll"
          >全部</el-checkbox
        >
        <el-checkbox-group v-model="checkedCities" @change="syncCheckedCities">
          <el-checkbox
            v-for="menu in toolMenus"
            :key="menu.id"
            :label="menu.name"
            :value="menu.id"
            >{{ menu.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </template>
    <template v-else>
      <div
        v-for="menu in toolMenus"
        :key="menu.id"
        class="radio"
        :class="{ activeText: activeBtn == menu.id }"
        @click="toggleRadio(menu)"
      >
        {{ menu.name }}
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
const checkedCities = ref<number[]>([]); //选中的值
const cities: number[] = []; //选项值长度 用来判断是否全部选中
const toolMenus = ref<any>(); //菜单内容
const checkAll = ref<boolean>(false); //全部
const isIndeterminate = ref<boolean>(false); //中间状态

const jsonUrl: { url: string; id: number }[] = []; //外链json数据数组
const tilesUrl: { url: string; id: number }[] = []; //3dtiles数据数组
const sceneCamera: { camera: any; id: number }[] = []; //场景视角

const { measure, mapEvent, modelAndImage, split } = window.cesiumInit;

const initData = () => {
  toolMenus.value = props.toolMenu;
  toolMenus.value.forEach((menu) => {
    menu.isInd = false;
    menu.check = false;
    menu.cities = [];

    if (props.eventType === "checkboxGroup") {
      processGroupMenu(menu);
    } else {
      processItem(menu);
    }
  });

  cities.forEach((id) => {
    const layers = window.cesiumInit.map3d.getLayersByAttr(id, "id");
    const divLayer =
      window.cesiumInit.divGraphic.graphicDivLayer.getGraphicsByAttr(
        id,
        "name"
      );

    if (layers.length > 0 || divLayer.length > 0) {
      checkedCities.value.push(id);
    }
  });
  checkAll.value = checkedCities.value.length === cities.length;
  isIndeterminate.value =
    checkedCities.value.length > 0 &&
    checkedCities.value.length < cities.length;
  activeBtn.value = checkedCities.value[0];
};

// 定义一个辅助函数来处理单个对象
const processGroupMenu = (menu) => {
  if (menu.childlist.length > 0) {
    menu.childlist.forEach((child) => {
      processItem(child);
      menu.cities.push(child.id);
    });
  } else {
    menu.cities.push(menu.id);
    cities.push(menu.id);
  }
};
const processItem = (item) => {
  if (item.jsonurl) {
    jsonUrl.push({ url: item.jsonurl, id: item.id });
  }
  if (item.scene_camera) {
    sceneCamera.push({ camera: item.scene_camera, id: item.id });
  }
  if (item.menu_type === "tilesLoading" && item.url) {
    tilesUrl.push({ url: item.url, id: item.id });
  }
  cities.push(item.id);
};

// 单选点击事件
const toggleRadio = (menu: DetailProps["toolMenu"]) => {
  // 当前页面点面实现共存 ，当有点时 在点击点数据 进行点数据删除再加载当前点击的点位数据 面数据同理
  activeBtn.value = activeBtn.value == menu.id ? null : menu.id;
  if (activeBtn.value) {
    mapEvent.flyToPoint(menu.scene_camera);
    deleteGraphic([menu.id], () => menuClick(menu, [menu.id]));
  } else {
    mapEvent.removeLayer(menu.id, "id");
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
      measure.measureStart(val.handle_type, () => (activeBtn.value = 0));
      break;
    case "tilesLoading":
      modelAndImage.addCesium3DTileSet(val);
      if (activeBtn.value) mapEvent.flyToPoint(val.scene_camera);
      break;
    case "dualViewSync": //分屏比对
      if (activeBtn.value) split.createControl(val);
      break;
    default:
      useLoadData(billArr);
      break;
  }
};

// 单个多选框 全选事件
const toggleCheckAll = (val: boolean) => {
  checkedCities.value = val ? cities : [];
  isIndeterminate.value = false;
  deleteGraphic([cities], () => val && formatData(cities));
};

// 单个多选框 子集选择事件
const syncCheckedCities = (value: number[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
  deleteGraphic(value, () => formatData(value));
};

// 多个多选框 全选事件
const handleCheckboxGroupChange = (menu, val: boolean) => {
  if (!val) menu.isInd = val; //去除中间状态
  const childrenArray = menu.cities;
  checkedCities.value = menu.check
    ? [...checkedCities.value, ...childrenArray]
    : checkedCities.value.filter((id) => !childrenArray.includes(id));
  deleteGraphic(
    checkedCities.value,
    () => {
      const citiesResult = menu.cities.filter((item) =>
        checkedCities.value.includes(item)
      );
      formatData(citiesResult);
    },
    menu.cities
  );
};

// 多个多选框 子集选择事件  menu  value:选中的值
const handleChildlistChange = (menu, value: string[]) => {
  const includeResult = menu.cities.filter((id) => value.includes(id));
  menu.check = includeResult.length === menu.cities.length;
  menu.isInd =
    includeResult.length > 0 && includeResult.length < menu.cities.length;
  deleteGraphic(value, () => formatData(includeResult), menu.cities);
};

// 加载数据与对应的视角
const formatData = (value) => {
  const jsonResult = jsonUrl.filter((item) => value.includes(item.id)); //外链地址
  const tilesResult = tilesUrl.filter((item) => value.includes(item.id)); //模型地址
  const cameraResult: any = value.reduceRight(
    (match, id) => match ?? sceneCamera.find((camera) => camera.id === id),
    null
  );//取所选值的最后一个视角值
  mapEvent.flyToPoint(cameraResult?.camera);
  useLoadData(value, jsonResult, tilesResult);
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
