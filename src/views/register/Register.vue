<template>
  <div class="register_container">
    <div class="register_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/img/avatar.jpg" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <el-form  ref="registerFormRef" 
                label-width="79px" 
                class="register_form" 
                :model="registerForm" 
                :rules="registerFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username" label="账号">
          <el-input prefix-icon="el-icon-user" 
                    v-model="registerForm.username"
                    placeholder="长度在 3 到 12 个字符"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input type="password" 
                    prefix-icon="el-icon-lock" 
                    v-model="registerForm.password"
                    placeholder="密码长度不能小于 6 个字符"></el-input>
        </el-form-item>
        
        <!-- 再次输入密码 -->
        <el-form-item prop="checkPassword" label="确认密码">
          <el-input type="password" 
                    prefix-icon="el-icon-lock" 
                    v-model="registerForm.checkPassword"
                    placeholder="请再次输入密码"></el-input>
        </el-form-item>
        
        <!-- 注册、登录和重置按钮 -->
        <div class="bottom_box">
          <el-link type="info" class="login" @click="login">已有账号，立即登录！</el-link>
          <el-form-item class="btns">
            <el-button type="primary" :plain="true" @click="register">注册</el-button>
            <el-button type="info" :plain="true" @click="resetRegisterForm">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register, checkName } from 'network/login_register'

export default {
  name: 'Register',
  data() { 
    // 验证用户名的规则函数
    const validName = async (rule, value, callback) => {
      this.registerForm.nameExists = false
      const result = await checkName(value);
      if(result.status === 409) {
        this.registerForm.nameExists = true
        callback(new Error('用户已存在'))
      } else {
        callback()
      }
    };
    // 验证确认密码的规则函数
    const validPwd = (rule, value, callback) => {
      if(value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      // 登陆表单数据绑定对象
      registerForm: {
        username: "",
        password: "",
        checkPassword:"",
        nameExists:false
      },
      // 表单验证规则对象
      registerFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur"},
          { validator: validName, trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 40, message: "密码长度不能小于 6 个字符", trigger: "blur" },
        ],
        checkPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validPwd, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    // 点击注册文字，跳转到登录界面
    login() {
      this.$router.push('/login')
    },
    // 点击重置按钮，重置登录表单
    resetRegisterForm() {
      this.$refs.registerFormRef.resetFields()
      this.$message('表单信息已重置');
    },
    async register() {
      const { username, password, checkPassword, nameExists } = this.registerForm
      if(nameExists) {
        console.log(`用户名已存在`);
        return 
      } else if(!username || !password || !checkPassword) {
        console.log(`不能为空`);
        return
      } else if(password !== checkPassword) {
        console.log(`密码不一致`);
        return 
      }
      const result = await register(username, password)
      if(result.status === 200) {
        this.$message({
          message: '恭喜你注册成功',
          type: 'success',
          center: true
        })
        this.$refs.registerFormRef.resetFields()
      }
      // console.log(result);
    }
  },
 }
</script>

<style lang="less" scoped>
.register_container {
  background-color: #2b4b6b;
  height: 100%;

  display: flex;
}

.register_box {
  width: 450px;
  height: 410px;
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

.register_form {
  position: relative;
  bottom: 20px;
  padding: 0 20px;
}

.bottom_box {
  display: flex;
  justify-content: space-around;
  .login {
    margin-bottom: 22px;
  }
}
</style>
