<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../../assets/img/head.jpg" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        ref="loginForm"
        :model="form"
        :rules="formRules"
        label-width="0px"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from "../../network/login";

export default {
  name: "Login",
  data() {
    return {
      // 表单数据绑定对象
      form: {
        username: "admin",
        password: "123456"
      },
      // 表单验证规则
      formRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetClick() {
      this.$refs.loginForm.resetFields();
    },
    loginClick() {
      this.$refs.loginForm.validate(valid => {
        // console.log(valid);
        if (!valid) return;
        getLogin(this.form).then(res => {
          // console.log(res.data);
          const data = res.data;
          if (data.meta.status !== 200) return this.$msg.error("登录失败");
          this.$msg.success("登陆成功");
          window.sessionStorage.setItem("token", data.data.token);
          this.$router.push("/home");
        });
      });
    }
  }
};
</script>

<style scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
}

.login-box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 5px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 1px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>