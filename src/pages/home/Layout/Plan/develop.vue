<template>
  <div class="left flex">
    <!-- 列表 -->
    <List
      :height="550"
      tab-title="列表信息"
      :tab-value="props.tabValue"
      @change="change"
      :dict-type="'investment_status'"
    />
  </div>
</template>

<script lang="ts" setup>
import "./com.less";
import List from "./components/list.vue";

interface detailProps {
  ruralInfo?: any;
  dataCount: any;
  tabValue: any;
}
const props = defineProps<detailProps>();

const emit = defineEmits(["change"]);
const change = (i) => {
  emit("change", i);
};
</script>

<style lang="less" scoped>
.lists {
  position: absolute;
  z-index: 1;
  div {
    width: 88px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: url("@/assets/img/info-bg.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    cursor: pointer;
  }
  div:hover::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 28px;
    z-index: 1;
    background: url(@/assets/img/table-bg.png) no-repeat left center/100% auto;
  }
}
</style>
