<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-09 17:34:47
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-04-09 17:52:45
 * @FilePath: \hby\src\components\AlertDialog\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="alert-dialog">
    <img class="w-60px h-60px mb-16px" :src="getAssets(props.dialog.icon)" alt="icon" />
    <div class="text-#E6FCFF text-24px mb-15px">
      {{ props.dialog.label }}
    </div>
    <div class="text-#A1B0B3 text-16px">{{ props.dialog?.hint }}</div>
    <div class="mt-54px flex justify-center text-14px">
      <div
        v-for="(btn, idx) in props.dialog.btn"
        :key="idx"
        class="py-7px px-42px mx-6px rounded-4px"
        :class="idx === 0 ? 'bg-[#1887AA] text-[#fff]' : 'bg-#E6FCFF'"
        @click="handelDialogBtn(btn.type)"
      >
        {{ btn.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface DialogContent {
  icon: string;
  label: string;
  hint?: string;
  btn: DialogButtonType[];
}

type DialogButtonType = {
  label: string;
  type: string;
};

interface detailProps {
  dialog: DialogContent;
}
const props = defineProps<detailProps>();

const emit = defineEmits(["handelBtn"]);
const handelDialogBtn = (type: string) => {
  emit("handelBtn", type);
};
</script>

<style lang="less" scoped>
.alert-dialog {
  background: #041022;
  border-radius: 10px 10px 10px 10px;
  border: 0;
  width: 550px;
  height: 320px;
  box-sizing: border-box;
  position: absolute;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 52px 0 36px;
}
</style>
