<template>
  <!-- 日照分析 -->
  <div class="shadow" v-show="props.shadow">
    <el-form
      ref="formStateRef"
      style="max-width: 600px"
      :model="formState"
      label-width="auto"
      class="demo-formState"
      status-icon
    >
      <el-form-item label="日期选择：">
        <el-date-picker
          v-model="formState.date"
          type="date"
          valueFormat="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="时间选择：" prop="time">
        <el-slider
          @input="timeChange"
          v-model="formState.time"
          :max="1440"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="当前时间：">
        {{ formState.date }} {{ hours }} 时 {{ minutes }}分
      </el-form-item>
      <el-form-item label="自动播放：">
        <el-button type="primary" round @click="startPlay">播放</el-button
        ><el-button type="primary" round @click="stopPlay">暂停</el-button>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" round @click="closeShadows">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import Shadows from "./Shadow"; //日照分析
import dayjs from "dayjs";

interface detailProps {
  shadow: boolean;
}
const props = defineProps<detailProps>();

const shadows = new Shadows();

const formState = reactive<any>({
  date: dayjs().format("YYYY-MM-DD"),
  time: 420,
});

const hours = computed(() => Math.floor(formState.time / 60));
const minutes = computed(() => Math.floor(formState.time % 60));

watch(
  () => props.shadow,
  (newValue: any) => {
    newValue ? shadows.startShadows() : closeShadows();
  }
);

// 开始播放日照分析
const startPlay = () => {
  shadows.startPlay(formState.date, hours.value, minutes.value);
  shadows.eventTarget.on("changeShadows", (event: any) => {
    const date = event.shadowTime;
    formState.time = date.getHours() * 60 + date.getMinutes();
  });
};
// 暂停日照分析
const stopPlay = () => {
  shadows.stopPlay();
};

const emit = defineEmits(["update:shadow"]);
// 关闭日照分析
const closeShadows = () => {
  formState.time = 420;
  shadows.deleteShadows();
  emit("update:shadow", false);
};
// 日照时间滑块改变
const timeChange = () => {
  shadows.setShadows(formState.date, hours.value, minutes.value);
};
</script>

<style scoped lang="less">
.shadow {
  position: absolute;
  top: 120px;
  right: 260px;
  width: 300px;
  height: 260px;
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
