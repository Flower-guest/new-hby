<template>
  <div class="left flex">
    <div v-show="dialog">
      <InfoDialog :title="'rfxx'">
        <template #infoMain>
          <div class="info_main">
            <!-- 列表 -->
            <List :height="510" tab-title="列表信息" @change="change" />
          </div>
        </template>
      </InfoDialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "./com.less";
import List from "./components/rfxxList.vue";

const dialog = ref<boolean>(true);

const emit = defineEmits(["change"]);
const change = () => {
  emit("change", { showTable: false });
};
</script>

<style lang="less" scoped></style>
