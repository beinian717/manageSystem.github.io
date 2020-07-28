<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
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
  components: {},
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "登录名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  methods: {
    // 登录按钮
    login() {
      // valid对整个表单进行校验的方法，
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登陆失败!");
        this.$message.success("登陆成功!");
        // 1 将登陆成功之后的token，保存到客户端的sessionStorage中
        // 1.1项目中除了登录之外的其他API接口，必须在登陆之后才能访问
        // 1.2token只应当在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2、通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      });
    },
    // 重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}
.login_form {
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>