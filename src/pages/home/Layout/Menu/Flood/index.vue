<template>
  <!-- 日照分析 -->
  <div class="shadow" v-show="props.flood">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="formState"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="淹没颜色：" prop="floodColor">
        <el-color-picker
          v-model="formState.floodColor"
          @change="onChangeColor"
          show-alpha
        />
      </el-form-item>
      <template v-if="!isShow">
        <el-form-item label="最低海拔：" prop="speed">
          <el-input
            v-model="formState.minHeight"
            placeholder="最低海拔"
            clearable
          />
        </el-form-item>
        <el-form-item label="最高海拔：" prop="speed">
          <el-input
            v-model="formState.maxHeight"
            placeholder="最高海拔"
            clearable
          />
        </el-form-item>
        <el-form-item label="淹没速度：" prop="speed">
          <el-input
            v-model="formState.speed"
            placeholder="淹没速度"
            clearable
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" round @click="btnDraw">绘制多边形</el-button
          ><el-button type="primary" round @click="clearDraw"
            >清除多边形</el-button
          >
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" round @click="begin">开始分析</el-button>
          <el-button type="primary" round @click="closeFlood"
            >关闭面板</el-button
          >
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="高度选择：" prop="speed">
          <el-slider
            @input="onChangeHeight"
            v-model="formState.height"
            :min="formState.minHeight"
            :max="formState.maxHeight"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" round @click="startPlay">{{
            isStart ? "暂停" : "播放"
          }}</el-button
          ><el-button type="primary" round @click="goBack">返回</el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import Flood from "./FloodByMaterial"; //日照分析

interface detailProps {
  flood: boolean;
}
const props = defineProps<detailProps>();

const floods = new Flood();

const isStart = ref<boolean>(true);
const isShow = ref<boolean>(false);
const formState = reactive<any>({
  minHeight: 0,
  maxHeight: 0,
  speed: 80,
  height: 0,
  floodColor: "rgba(0, 123, 230, 0.5)",
});

// 监听到高度发生变化
floods.eventTarget.on("heightChange", (e: any) => {
  isShow.value = true;
  formState.height = Math.ceil(e.height);
});

// 监听淹没完成
floods.eventTarget.on("floodEnd", () => {
  isStart.value = false;
});

// 添加多边形
const btnDraw = () => {
  floods.btnDraw((min: any, max: any) => {
    formState.minHeight = min;
    formState.maxHeight = max;
  }, formState.floodColor);
};

const clearDraw = () => {
  floods.clearDraw();
  formState.minHeight = 0;
  formState.maxHeight = 0;
};

// 开始淹没
const begin = () => {
  floods.begin(formState);
};

// 高度改变
const onChangeHeight = () => {
  floods.onChangeHeight(formState.height);
};

// 颜色修改
const onChangeColor = () => {
  floods.onChangeColor(formState.floodColor);
};

// 默认自动播放
const startPlay = () => {
  isStart.value = !isStart.value;
  floods.startPlay();
};

const goBack = () => {
  floods.clearDraw();
  formState.minHeight = 0;
  formState.maxHeight = 0;
  isShow.value = false;
  isStart.value = true;
  formState.enabledShowElse = true;
};

const emit = defineEmits(["update:flood"]);
// 关闭淹没分析
const closeFlood = () => {
  formState.floodColor = "rgba(0, 123, 230, 0.5)";
  emit("update:flood", false);
};
</script>

<style scoped lang="less">
.shadow {
  position: absolute;
  top: 120px;
  right: 260px;
  width: 300px;
  height: 320px;
  border: 1px solid #fff;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 15px;
  background-color: #041022;
  color: #fff;
  :deep(.el-form-item__label) {
    color: #fff;
  }
}
</style>
