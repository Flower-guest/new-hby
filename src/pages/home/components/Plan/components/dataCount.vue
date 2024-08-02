<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-07-14 15:45:44
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-06-26 17:24:04
 * @FilePath: \lhs-demo\src\components\TableList\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="mt-22px mr-8px flex items-end">
    <img
      loading="lazy"
      class="w-51px h-50px mr-15px"
      :src="getAssets(props.dataCount.imgUrl)"
      alt="img"
    />
    <div class="grid">
      <div class="text-32px count-to">
        <template v-if="props.dataCount.val">
          <CountTo
            :end="props.dataCount.val"
            :autoPlay="true"
            :duration="3000"
          />
        </template>
        <span class="text-16px">&nbsp;{{ props.dataCount.unit }}</span>
      </div>
      <span class="text-[#2FC6DC] text-16px">{{ props.dataCount.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface detailProps {
  dataCount: any;
}

const props = defineProps<detailProps>();
</script>

<style lang="less" scoped>
.count-to {
  font-family: "DINNEXTLTPRO-BOLD";
}
</style>
