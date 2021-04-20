<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/img/avatar.jpg" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <el-form  ref="loginFormRef" 
                label-width="0px" class="login_form" 
                :model="loginForm" 
                :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 注册、登录和重置按钮 -->
        <div class="bottom_box">
          <el-link type="info" class="register" @click="register">没有账号，立即注册！</el-link>
          <el-form-item class="btns">
            <el-button type="primary" :plain="true" @click="login">登录</el-button>
            <el-button type="info" :plain="true" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from 'network/login_register'

export default {
  name: "Login",
  data() {
    return {
      // 登陆表单数据绑定对象
      loginForm: {
        username: "zzl",
        password: "000000",
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur"},
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 40, message: "密码长度不能小于 6 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 点击注册文字，跳转到注册界面
    register() {
      this.$router.push('/register')
    },
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
      this.$message('表单信息已重置');
    },
    // 点击登录按钮，进行登录
    async login() {
      const { username, password } = this.loginForm
      if(!username || !password) {
        this.$message('用户名和密码不得为空！');
        return
      } else if(username.length < 2 || username.length > 12 || password.length < 6 || password.length > 40) {
        this.$message({
          message: '用户名或密码错误',
          type: 'error',
          center: true
        })
      }
      const { data, status } = await login(username, password)
      console.log(data);
      if(status === 200) {
        this.$message({
          message: '登录成功',
          type: 'success',
          center: true
        })
        // 保存token
        window.sessionStorage.setItem('token', data.token)
        this.$router.push('/home')
      } else {
        this.$message({
          message: '登录失败',
          type: 'error',
          center: true
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  display: flex;
}

.login_box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  margin: auto;

  .avatar_box {
    position: relative;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 130px;
    height: 130px;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    border: 1px solid #eee;
    border-radius: 50%;

    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: relative;
  bottom: 20px;
  padding: 0 20px;
}

.bottom_box {
  display: flex;
  justify-content: space-around;
  .register {
    margin-bottom: 22px;
  }
}
</style>
