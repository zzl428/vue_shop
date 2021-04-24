import { searchByField } from 'network/login_register'

// 验证邮箱的正则
const regEmail = /^[0-9a-zA-Z\.]+@[0-9a-zA-Z]+\.[a-z]{3}$/
// 邮箱规则函数部分抽取
export const partValidEmail = async (value) => {
  if(!regEmail.test(value)) {
    return new Error('邮箱格式错误')
  } else {
    const result = await searchByField('user', `email`, value)
    if(result.data.search === 'have') {
      return new Error('邮箱已被注册过')
    }
  }
}
// 手机规则函数部分抽取
export const partValidMobile = async (value) => {
  const result = await searchByField('user', 'mobile', value);
  if(result.data.search === 'have') {
    return new Error('手机号已被注册')
  }
}

// 验证用户名的规则函数
export async function validName(rule, value, callback) {
  const result = await searchByField('user', 'name', value);
  if(result.data.search === 'have') {
    return callback(new Error('用户已存在'))
  } else {
    callback()
  }
};

// 验证邮箱的规则函数
export async function validEmail(rule, value, callback) {
  const result = await partValidEmail(value)
  if(!result) {
    return callback()
  } else {
    return callback(result)
  }
}


// 验证手机的规则函数
export async function validMobile(rule, value, callback) {
  const result = await partValidMobile(value)
  if(!result) {
    return callback
  } else {
    return callback(result)
  }
};




// 用户账号规则
export const verifyNameNotNull = { required: true, message: "请输入用户名称", trigger: "blur" }
export const verifyNameSize = { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur"}
// 用户密码规则
export const verifyPwdNotNull = { required: true, message: "请输入密码", trigger: "blur" }
export const verifyPwdSize = { min: 6, max: 40, message: "密码长度不能小于 6 个字符", trigger: "blur" }
// 用户邮箱规则
export const verifyEmailNotNull = { required: true, message: "请输入邮箱", trigger: "blur" }
// 用户手机规则
export const verifyMobileNotNull = { required: true, message: "请输入电话号码", trigger: "blur" }
export const verifyMobileSize = { min: 11, max: 11, message: "格式错误", trigger: "blur"}