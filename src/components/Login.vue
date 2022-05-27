<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 (show-password可选显示密码)-->
        <el-form-item prop="password">
          <el-input
            show-password
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单的验证规则,prop用于绑定验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单登录预验证  用validate()
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(result);
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功！");

        console.log(res);
        // 将登录成功后，服务器返回的token保存到客户端的sessionStorge中，保持登录状态（sessionStorge和localStorge保存期限不同，sessionStorge在窗口关闭后会删除保存的数据，localStorge没有保存期限）；
        // 所有API接口除了登录接口外，都需要登录之后才能访问
        //通过编程式导航跳转到后台主页，路由地址是/home（在 Vue 实例内部，你可以通过$router 访问路由实例。因此你可以调用 this.$router.push）
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(98, 168, 206);
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1px solid #eee;
      background-color: rgb(255, 255, 255);
      padding: 10px;
      box-shadow: 0 0 15px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .login_form {
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
  }
}
</style>>

