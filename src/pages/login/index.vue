<template>
  <div class="login-container">
    <div class="login-card" v-if="!projectInfo.checkedProject">
      <div class="title">{{ projectInfo.basicInfo.name || "用户登录" }}</div>
      <div class="content">
        <el-form
          :hide-required-asterisk="true"
          :label-position="'top'"
          ref="loginFormRef"
          :model="loginFormData"
          :rules="loginFormRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username" label="账号">
            <el-input
              v-model.trim="loginFormData.username"
              type="text"
              tabindex="1"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              v-model.trim="loginFormData.password"
              type="password"
              tabindex="2"
              size="large"
              show-password
            />
          </el-form-item>
          <el-button
            :loading="loginLoading"
            type="primary"
            size="large"
            @click.prevent="handleLogin"
            >登 录</el-button
          >
        </el-form>
        <div class="flex-between">
          <el-checkbox
            v-model="loginFormData.remember"
            label="记住密码"
            size="large"
          />
          <div
            v-show="projectInfo.basicInfo.guest"
            class="el-checkbox el-checkbox--large"
            @click.prevent="guestLogin"
          >
            <span class="el-checkbox__label">游客访问</span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-card" v-else>
      <div class="title">项目选择</div>
      <el-row :gutter="0">
        <el-col
          :span="8"
          v-for="item in projectInfo.projectList"
          :key="item.id"
          @click="toPage(item.id)"
        >
          <img class="thumb" :src="getServeImg(item.thumb_path)" />
          <div>{{ item.name }}</div></el-col
        >
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GetBasicinfo, PostLogin, GetProjectList } from "@/service/api";
import { type FormInstance, FormRules } from "element-plus";
import { getServeImg } from "@/utils";
import * as authUtil from "@/utils/auth";

const { push } = useRouter();

let { gid }: { gid: string } = useUrlSearchParams("hash");

/** 登录表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null);

/** 登录按钮 Loading */
const loginLoading = ref(false);

/** 登录表单数据 */
const loginFormData: any = reactive({
  username: "",
  password: "",
  remember: false, //记住密码
});

const projectInfo: any = reactive({
  projectList: [],
  basicInfo: {},
  checkedProject: false,
});

/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

// 密码回显
const initLoginFormData = () => {
  const res = authUtil.getLoginForm();
  if (res && res.remember) {
    loginFormData.username = res.username;
    loginFormData.password = res.password;
    loginFormData.remember = res.remember;
  }
};

/** 游客登录 */
const guestLogin = () => {
  loginFormData.username = "guest";
  loginFormData.password = "guest";
  loginFormData.remember = false;
  handleLogin();
};

/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      loginLoading.value = true;
      try {
        const { appid, token } = await PostLogin(loginFormData);
        if (!appid) return;

        // 判断是否记住密码
        if (loginFormData.remember) {
          authUtil.setLoginForm(loginFormData);
        } else {
          authUtil.removeLoginForm();
        }
        // 指定数据存储
        authUtil.setAPPId(appid);
        authUtil.setToken(token);

        getProjectList();
        loginLoading.value = false;
      } catch (error) {
        loginLoading.value = false;
        console.log("An error occurred:", error);
      }
    } else {
      console.error("表单校验不通过", fields);
    }
  });
};

// 获取项目列表
const getProjectList = async () => {
  if (gid) {
    // 跳转页面
    toPage(gid);
  } else {
    try {
      const projectList = await GetProjectList();
      if (projectList.length > 1) {
        projectInfo.checkedProject = true;
        projectInfo.projectList = projectList;
      } else {
        gid = projectList.length[0].id;
        toPage(gid);
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  }
};

// 跳转页面
const toPage = (gid) => {
  let { redirect }: { redirect: string } = useUrlSearchParams("hash");
  authUtil.setGid(gid);
  // 跳转页面
  if (!redirect) {
    redirect = "/?gid=" + gid;
  }
  push({ path: redirect + "?gid=" + gid });
};

onMounted(async () => {
  if (gid) projectInfo.basicInfo = await GetBasicinfo(gid);
  initLoginFormData();
});
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background: url("@/assets/img/login-bg.png") no-repeat;
  background-size: 100% 100%;

  .login-card {
    width: 520px;
    height: 500px;
    box-sizing: border-box;
    border-radius: 20px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(19px) brightness(120%);
    -webkit-backdrop-filter: blur(19px) brightness(120%);
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 34px;
      margin-top: 48px;
      color: var(--login-title-color);
    }
    :deep(.content) {
      padding: 52px 57px 44px;
      .el-form-item__label {
        color: #cccccc;
        font-size: 17px;
      }
      .el-input__wrapper {
        padding: 0 8px 0 0;
        box-shadow: 0 0 0px 0px
          var(--el-input-border-color, var(--el-border-color)) inset;
        border-bottom: 1px solid #fff;
        border-radius: 0;
        cursor: default;
        background-color: transparent;
        font-size: 28px;
        .el-input__inner {
          color: #fff;
          cursor: default !important;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
        background: linear-gradient(270deg, #24929e 0%, #36a9b3 100%);
        border: 1px solid var(--login-checkbox-color);
      }
      .el-checkbox {
        margin-top: 21px;
        .el-checkbox__input {
          border: 1px solid var(--login-checkbox-color);
          .el-checkbox__inner {
            background-color: transparent;
            border: none;
          }
          .el-checkbox__inner::after {
            left: 5px;
            top: 0px;
            height: 10px;
            border-color: var(--login-checkbox-color);
          }
        }
        .el-checkbox__label {
          font-size: 18px;
          color: var(--login-checkbox-color);
        }
      }
    }
    :deep(.el-row) {
      margin-top: 20px;
      padding: 6px;
      box-sizing: border-box;

      .el-col {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 20px;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;
        .thumb {
          width: 60px;
          height: 60px;
          margin-bottom: 10px;
        }

        &:hover {
          cursor: pointer;
          border: 1px solid #24929e;
        }
      }
    }
  }
}
</style>
