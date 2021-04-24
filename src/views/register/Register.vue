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
        
        <!-- 邮箱 -->
        <el-form-item  prop="email" label="邮箱">
          <el-input v-model="registerForm.email" 
                    prefix-icon="el-icon-s-promotion"
                    placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="registerForm.mobile" 
                    prefix-icon="el-icon-phone"
                    placeholder="请输入电话"></el-input>
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
import { 
  validName, verifyNameNotNull, verifyNameSize, 
  verifyPwdNotNull, verifyPwdSize,
  verifyEmailNotNull, validEmail,
  verifyMobileNotNull, verifyMobileSize, validMobile
} from 'common/utils'

export default {
  name: 'Register',
  data() {
    // 验证确认密码的规则函数
    const validPwd = (rule, value, callback) => {
      if(value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      nameExists:false,
      // 登陆表单数据绑定对象
      registerForm: {
        username: "",
        password: "",
        checkPassword:"",
        email: '',
        mobile: '',
      },
      // 表单验证规则对象
      registerFormRules: {
        // 验证用户名是否合法
        username: [
          verifyNameNotNull,
          verifyNameSize,
          { validator: validName, trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          verifyPwdNotNull,
          verifyPwdSize,
        ],
        checkPassword: [
          verifyPwdNotNull,
          { validator: validPwd, trigger: 'blur' }
        ],
        email: [ verifyEmailNotNull, { validator: validEmail, trigger: 'blur' } ],
        mobile: [ verifyMobileNotNull, verifyMobileSize, { validator: validMobile, trigger: 'blur' } ]
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
    register() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if(!valid) return
        const result = await register(this.registerForm)
        if(result.status === 200) {
          this.$message({
            message: '恭喜你注册成功',
            type: 'success',
            center: true
          })
          this.$refs.registerFormRef.resetFields()
        }
      })
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
  height: 440px;
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
  bottom: 70px;
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
