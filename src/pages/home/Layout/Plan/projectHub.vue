<template>
  <div class="left flex">
    <div v-show="dialog">
      <InfoDialog :title="'xmgl'">
        <template #infoMain>
          <div class="info_main">
            <!-- 列表 -->
            <List
              :height="480"
              tab-title="列表信息"
              :tab-value="props.tabValue"
              @change="change"
              :dict-type="'built_project_status'"
            />
          </div>
        </template>
      </InfoDialog>
    </div>
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

const dialog = ref<boolean>(true);

const emit = defineEmits(["change"]);
const change = (i) => {
  emit("change", i);
};
</script>

<style lang="less" scoped></style>
