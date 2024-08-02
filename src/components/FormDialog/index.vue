<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-04-09 17:34:47
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-06-26 17:15:41
 * @FilePath: \hby\src\components\AlertDialog\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 设置时间 | 导览名称 -->
  <div class="form-dialog">
    <div class="flex-center title">
      <img
        loading="lazy"
        class="w-15px h-20px mr-10px"
        :src="getAssets('icon_jt.png')"
        alt="icon"
      />
      {{ props.dialog.label }}
      <img
        loading="lazy"
        class="w-16px h-16px ml-auto"
        @click="handelDialogBtn('close')"
        :src="getAssets('gb3.png')"
        alt="关闭"
      />
    </div>
    <div class="w-100% h-1px bg-[#66BECC] opacity-80 mb-12px"></div>
    <el-form label-width="auto" label-position="left" :model="form">
      <template v-for="items in formItem" :key="items.label">
        <el-form-item :label="items.label">
          <!-- 输入框 -->
          <template v-if="items.type == 'input'">
            <el-input v-model="form[items.field]" />
          </template>
          <!-- 下拉框 -->
          <template v-else-if="items.type == 'select'">
            <el-select v-model="form[items.field]" placeholder="请选择">
              <el-option
                v-for="optI in items.selectOpt"
                :key="optI.value"
                :label="optI.label"
                :value="optI.value"
              />
            </el-select>
          </template>
          <template v-else-if="items.type == 'materialLibrary'">
            <el-select-v2
              v-model="form[items.field]"
              :options="items.selectOpt"
              placeholder="请选择材质"
              class="w-190px"
            >
              <template #default="{ item }">
                <div class="flex items-center">
                  <img loading="lazy" class="w-80px h-40px mr-8px " :src="item.value" alt="材质图片"/>
                  <span>{{ item.label }}</span>
                </div>
              </template>
            </el-select-v2>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <div class="dialog-footer flex justify-between">
      <el-button class="clan" @click="handelDialogBtn('reset')">重置</el-button>
      <el-button color="#1887AA" type="primary" @click="handelDialogBtn('save')"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssets } from "@/utils";
interface DialogContent {
  form: any;
  formItem: DialogFormItem[];
  label: string;
}

interface DialogFormItem {
  label: string;
  type: string;
  field: string;
  selectOpt?: any[];
}

interface detailProps {
  dialog: DialogContent;
  width?: string;
  height?: string;
}
const props = withDefaults(defineProps<detailProps>(), {
  height: "228px",
  width: "500px",
});

const form = ref();
const formItem = ref();

watch(
  () => props.dialog,
  (newValue) => {
    form.value = newValue.form;
    formItem.value = newValue.formItem;
  }
);

const emit = defineEmits(["handelBtn"]);
const handelDialogBtn = (type: string) => {
  emit("handelBtn", type);
};
</script>

<style lang="less" scoped>
.form-dialog {
  position: absolute;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: v-bind(width);
  height: v-bind(height);
  background: #041022cc;
  padding: 20px;
  box-sizing: border-box;
  .title {
    font-family: "USTitleBlack";
    font-size: 20px;
    color: #fff;
    margin-bottom: 4px;
  }
  :deep(.el-form) {
    .el-form-item__label {
      color: #fff !important;
      font-size: 16px !important;
      font-weight: 800;
    }

    .el-input__wrapper {
      background: #052a32;
      box-shadow: inset 0px 0px 5px -1px #92efff;
      border-radius: 0;
      .el-input__inner {
        color: #7ac0cc;
      }

      .el-input__inner::placeholder {
        color: #7ac0cc;
      }
    }

    .el-select__wrapper {
      background: #052a32;
      box-shadow: inset 0px 0px 5px -1px #92efff;
      border-radius: 0;
      .el-select__selected-item {
        color: #7ac0cc;
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    .clan {
      background-color: transparent !important;
      color: #fff;
      border-color: #1887aa;
    }
  }
}
</style>
