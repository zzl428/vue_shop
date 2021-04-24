import axios from 'axios'

export function request(config) {
  // 1创建实例
  const instance = axios.create({
    baseURL: 'http://localhost:8006',
    headers: {
      "Content-Type": config.headers || "application/x-www-form-urlencoded;charset=UTF-8"
    },
    timeout:5000,
    method: config.method
  })

  // 2axios的拦截器
  instance.interceptors.request.use(config=>{
    const token = window.sessionStorage.getItem('token')
    // console.log(token);
    config.headers.Authorization = 'Bearer ' + token
    // console.log(config);
    // 放行
    return config
  },err=>{
    console.log(err);
  })

  instance.interceptors.response.use(res=>{
    return {
      data: res.data,
      status: res.status
    }
  },err=>{
    return {
      status:err.response.status,
      data:err.response.data
    }
  })

  // 3发送网络请求
  return instance(config)
}